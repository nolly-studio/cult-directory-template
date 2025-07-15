import { ReactElement } from "react"
import { BoxIcon, Hash, Search, TagIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FadeIn } from "@/components/cult/fade-in"
import { GradientHeading } from "@/components/cult/gradient-heading"
import { ResourceCardGrid } from "@/components/directory-card-grid"

import { NavSidebar } from "../../components/nav"
import { AdaptiveLayout } from "@/components/adaptive-layout"
import { getCachedFilters } from "../actions/cached_actions"
import { getProducts } from "../actions/product"

export const dynamic = "force-dynamic"

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: {
    search?: string
    category?: string
    label?: string
    tag?: string
  }
}): Promise<ReactElement> {
  const { search, category, label, tag } = searchParams
  
  let data: any[] = []
  let filters: { categories: string[]; labels: string[]; tags: string[] } = { 
    categories: [], 
    labels: [], 
    tags: [] 
  }
  
  try {
    data = await getProducts(search, category, label, tag)
    filters = await getCachedFilters()
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }

  return (
    <>
      <NavSidebar
        categories={filters.categories}
        labels={filters.labels}
        tags={filters.tags}
      />

      <AdaptiveLayout className="max-w-full pt-4">
        <FadeIn>
          <ResourceCardGrid sortedData={data} filteredFeaturedData={null}>
            {search ?? category ?? label ?? tag ? (
              <div className="md:ml-auto mx-auto flex flex-col items-center md:items-start">
                <div className="flex mb-1 justify-center md:justify-start">
                  {search ? (
                    <Search className="ml-1 bg-neutral-800 fill-yellow-300/30 stroke-yellow-500 size-6 p-1 rounded-full" />
                  ) : null}
                  {category ? (
                    <BoxIcon className="ml-1 bg-neutral-800 fill-yellow-300/30 stroke-yellow-500 size-6 p-1 rounded-full" />
                  ) : null}
                  {label ? (
                    <Hash className="ml-1 bg-neutral-800 fill-yellow-300/30 stroke-yellow-500 size-6 p-1 rounded-full" />
                  ) : null}
                  {tag ? (
                    <TagIcon className="ml-1 bg-neutral-800 fill-yellow-300/30 stroke-yellow-500 size-6 p-1 rounded-full" />
                  ) : null}
                  {search ? "البحث" : ""}
                  {category ? "الفئة" : ""}
                  {label ? "التصنيف" : ""}
                  {tag ? "العلامة" : ""}
                </div>
                <GradientHeading size="xxl">
                  {search ?? category ?? label ?? tag}
                </GradientHeading>
                <div className="text-sm text-muted-foreground mt-2">
                  {data.length} نتيجة
                </div>
              </div>
            ) : null}

            {/* <Separator className="mb-12 ml-auto w-[85%] bg-black/5 h-[2px] animate-pulse rounded-l-full" /> */}
          </ResourceCardGrid>
        </FadeIn>
      </AdaptiveLayout>
    </>
  )
}