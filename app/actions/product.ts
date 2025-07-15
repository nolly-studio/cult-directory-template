"use server"

import "server-only"
import { cache } from "react"
import { revalidatePath } from "next/cache"
import { createClient } from "@/db/supabase/server"

export async function getFilters() {
  const db = createClient()
  const { data: categoriesData, error: categoriesError } = await db
    .from("products")
    .select("categories")

  const { data: labelsData, error: labelsError } = await db
    .from("products")
    .select("labels")

  const { data: tagsData, error: tagsError } = await db
    .from("products")
    .select("tags")

  if (categoriesError || labelsError || tagsError) {
    console.error(
      "Error fetching filters:",
      categoriesError,
      labelsError,
      tagsError
    )
    return { categories: [], labels: [], tags: [] }
  }

  return {
    categories: categoriesData.map((item) => item.categories).filter(Boolean),
    labels: labelsData.map((item) => item.labels).filter(Boolean),
    tags: tagsData.map((item) => item.tags).filter(Boolean),
  }
}

export const getProducts = cache(
  async (
    searchTerm?: string,
    category?: string,
    label?: string,
    tag?: string
  ) => {
    try {
      const db = createClient()
      let query = db.from("products").select("*")

      if (searchTerm) {
        query = query.or(
          `codename.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,punchline.ilike.%${searchTerm}%`
        )
      }

      if (category) {
        query = query.eq("categories", category)
      }

      if (label) {
        query = query.contains("labels", [label])
      }

      if (tag) {
        query = query.contains("tags", [tag])
      }

      const { data, error } = await query

      if (error) {
        console.error("Error searching resources:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Failed to fetch products:", error)
      return []
    }
  }
)

export async function getProductById(id?: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
  if (error) {
    console.error("Error fetching resources:", error)
    return []
  }

  console.log(data)
  return data
}

export async function getProductBySlug(slug?: string) {
  const supabase = createClient()

  if (!slug) return []

  // Convert slug back to codename - handle various formats
  let codename = slug
  
  // Handle common slug patterns
  if (slug === 'character-ai') {
    codename = 'Character.AI'
  } else {
    // Convert kebab-case back to proper format
    codename = slug
      .split('-')
      .map(word => {
        // Special cases for known patterns
        if (word.toLowerCase() === 'ai') return 'AI'
        if (word.toLowerCase() === 'gpt') return 'GPT'
        return word.charAt(0).toUpperCase() + word.slice(1)
      })
      .join('.')
  }

  // First try exact match
  let { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("codename", codename)
  
  // If not found, try case-insensitive search
  if (!data || data.length === 0) {
    const { data: caseInsensitiveData, error: caseError } = await supabase
      .from("products")
      .select("*")
      .ilike("codename", codename)
    
    data = caseInsensitiveData
    error = caseError
  }

  // If still not found, try original slug as-is
  if (!data || data.length === 0) {
    const { data: originalData, error: originalError } = await supabase
      .from("products")
      .select("*")
      .eq("codename", slug)
    
    data = originalData
    error = originalError
  }
  
  if (error) {
    console.error("Error fetching product by slug:", error)
    return []
  }

  return data || []
}


export async function incrementClickCount(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase.rpc("increment_product_view_count", {
    product_id: id,
  })

  if (error) {
    console.error("Error incrementing click count:", error)
  } else {
    console.log("Click count incremented:", data)
  }

  revalidatePath("/products")
}

export async function incrementProductViews(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.rpc('increment_product_view_count', {
    product_id: id
  })

  if (error) {
    console.error('Error incrementing product view count:', error)
  }
}
