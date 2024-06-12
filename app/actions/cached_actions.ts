"use server"

import "server-only"
import { unstable_cache } from "next/cache"
import { createClient } from "@supabase/supabase-js"

type FilterData = {
  categories: string[]
  labels: string[]
  tags: string[]
}

type CategoryData = {
  name: string
}

type LabelData = {
  name: string
}

type TagData = {
  name: string
}

const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
async function getFilters(): Promise<FilterData> {
  const { data: categoriesData, error: categoriesError } = await client
    .from("categories")
    .select("name")

  const { data: labelsData, error: labelsError } = await client
    .from("labels")
    .select("name")

  const { data: tagsData, error: tagsError } = await client
    .from("tags")
    .select("name")

  if (categoriesError || labelsError || tagsError) {
    console.error(
      "Error fetching filters:",
      categoriesError,
      labelsError,
      tagsError
    )
    return { categories: [], labels: [], tags: [] }
  }

  const unique = (array: string[]) => [...new Set(array)]

  const categories = categoriesData
    ? unique(
        categoriesData.map((item: CategoryData) => item.name).filter(Boolean)
      )
    : []

  const labels = labelsData
    ? unique(labelsData.map((item: LabelData) => item.name).filter(Boolean))
    : []

  const tags = tagsData
    ? unique(tagsData.map((item: TagData) => item.name).filter(Boolean))
    : []

  return { categories, labels, tags }
}

export const getCachedFilters = unstable_cache(
  async (): Promise<FilterData> => {
    const { categories, labels, tags } = await getFilters()
    return { categories, labels, tags }
  },
  ["product-filters"],
  { tags: [`product_filters`], revalidate: 9000 }
)
