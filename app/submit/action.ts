"use server"

import "server-only"
import { revalidatePath, revalidateTag } from "next/cache"
import { createClient } from "@/db/supabase/server"
import { anthropic } from "@ai-sdk/anthropic"
import { generateObject } from "ai"

import { enrichmentSchema, schema } from "./schema"

// Configuration object
const config = {
  aiEnrichmentEnabled: false,
  aiModel: anthropic("claude-3-haiku-20240307"), // You can change this to another model if needed
  storageBucket: "product-logos",
  cacheControl: "3600",
  allowNewTags: true,
  allowNewLabels: true,
  allowNewCategories: true,
}

export type FormState = {
  message: string
  fields?: Record<string, string>
  issues: string[]
}

type Enrichment = {
  tags: string[]
  labels: string[]
}

// Helper function to check if an error has a message
function isErrorWithMessage(error: unknown): error is Error {
  return typeof error === "object" && error !== null && "message" in error
}

// Uploads the logo file to the storage bucket
async function uploadLogoFile(
  db: any,
  logoFile: File,
  codename: string
): Promise<string> {
  const fileExt = logoFile.name.split(".").pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `${codename}/${fileName}`
  const fileBuffer = await logoFile.arrayBuffer()

  const { error: uploadError } = await db.storage
    .from(config.storageBucket)
    .upload(filePath, Buffer.from(fileBuffer), {
      cacheControl: config.cacheControl,
      upsert: false,
    })

  if (uploadError) {
    console.error(`Error uploading file: ${uploadError.message}`)
    throw new Error(uploadError.message)
  }

  const publicUrlResponse = db.storage
    .from(config.storageBucket)
    .getPublicUrl(filePath)
  console.log(
    `Logo file uploaded. Public URL: ${publicUrlResponse.data.publicUrl}`
  )
  return publicUrlResponse.data.publicUrl
}

// Inserts a new entry if it does not already exist
async function insertIfNotExists(
  db: any,
  table: string,
  name: string
): Promise<void> {
  console.log(`Attempting to insert ${name} into ${table}`)

  const { error } = await db
    .from(table)
    .insert([{ name }], { onConflict: "name" })

  if (error && !error.message.includes("duplicate key value")) {
    console.error(`Error inserting into ${table}: ${error.message}`)
    throw new Error(`Error inserting into ${table}: ${error.message}`)
  }

  console.log(`${name} successfully inserted or already exists in ${table}`)
}

// Generates the AI enrichment prompt with examples

// Main function to handle the form submission
export async function onSubmitToolAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const db = createClient()
  const data = Object.fromEntries(formData.entries())
  const parsed = schema.safeParse(data)

  if (!parsed.success) {
    console.error("Form validation failed")
    const fields: Record<string, string> = {}
    for (const key of Object.keys(data)) {
      fields[key] = data[key].toString()
    }
    return {
      message: "Invalid form data",
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    }
  }

  try {
    const { data: authData, error: authError } = await db.auth.getUser()
    if (authError || !authData.user) {
      console.error("User authentication failed")
      throw new Error("User authentication failed")
    }
    const user = authData.user

    let logoUrl = ""
    const logoFile = formData.get("images") as File
    if (logoFile) {
      logoUrl = await uploadLogoFile(db, logoFile, parsed.data.codename)
    }

    let tags: Enrichment["tags"] = []
    let labels: Enrichment["labels"] = ["unlabeled"]

    if (config.aiEnrichmentEnabled) {
      console.log("Generating AI enrichment data")
      const enrichmentPrompt = getAIEnrichmentPrompt(
        parsed.data.codename,
        parsed.data.categories,
        parsed.data.description
      )
      const { object: enrichment } = await generateObject({
        model: config.aiModel,
        schema: enrichmentSchema,
        prompt: enrichmentPrompt,
      })

      tags = enrichment.tags
      labels = enrichment.labels ?? ["unlabeled"]

      if (config.allowNewTags) {
        for (const tag of tags) {
          await insertIfNotExists(db, "tags", tag)
        }
      }

      if (config.allowNewLabels) {
        for (const label of labels) {
          await insertIfNotExists(db, "labels", label)
        }
      }
    }

    if (config.allowNewCategories) {
      await insertIfNotExists(db, "categories", parsed.data.categories)
    }

    const productData = {
      full_name: parsed.data.fullName,
      email: parsed.data.email,
      twitter_handle: parsed.data.twitterHandle,
      product_website: parsed.data.productWebsite,
      codename: parsed.data.codename,
      punchline: parsed.data.punchline,
      description: parsed.data.description,
      logo_src: logoUrl,
      categories: parsed.data.categories,
      user_id: user.id,
      approved: true,
      tags,
      labels,
    }

    console.log("Inserting product data")
    const { error } = await db.from("products").insert([productData]).select()

    if (error) {
      console.error(`Error inserting product data: ${error.message}`)
      throw new Error(error.message)
    }

    revalidatePath("/")
    revalidateTag("product-filters")

    console.log("Product data successfully inserted")

    return { message: "Tool submitted successfully", issues: [] }
  } catch (error) {
    console.error(
      `Submission failed: ${
        isErrorWithMessage(error) ? error.message : "Unknown error occurred"
      }`
    )
    return {
      message: `Submission failed: ${
        isErrorWithMessage(error) ? error.message : "Unknown error occurred"
      }`,
      issues: [
        isErrorWithMessage(error) ? error.message : "Unknown error occurred",
      ],
    }
  }
}
