import { z } from "zod"

export const schema = z.object({
  fullName: z.string().trim().min(1, { message: "Full name is required." }),
  email: z.string().trim(),
  twitterHandle: z
    .string()
    .trim()
    .min(1, { message: "Twitter handle is required." }),

  productWebsite: z.string().trim().url({ message: "Invalid URL." }),
  codename: z.string().trim().min(1, { message: "Codename is required." }),
  punchline: z
    .string()
    .trim()
    .max(30, { message: "Punchline must be less than 10 words." }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Description is required." }),
  categories: z.string().trim().min(1, { message: "Category is required." }),
  images: z.any(),
  logo_src: z.any().optional(),
})

export const enrichmentSchema = z.object({
  tags: z
    .array(z.string())
    .min(1, { message: "At least one tag is required." }),
  labels: z
    .array(z.string())
    .min(1, { message: "At least one label is required." }),
})
