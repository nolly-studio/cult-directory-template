"use client"

import React, { Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

import { AIToolCard } from "./ai-tool-card"
import { ErrorBoundaryWrapper } from "./error-boundary"

interface Product {
  id: string
  created_at: string
  full_name: string
  email: string
  twitter_handle: string
  product_website: string
  codename: string
  punchline: string
  description: string
  logo_src: string
  user_id: string
  tags: string[]
  view_count: number
  approved: boolean
  labels: string[]
  categories: string
}

export interface SEOCardGridProps {
  sortedData: Product[]
  filteredFeaturedData: Product[] | null
  children?: React.ReactNode
}

export const ResourceCardGrid: React.FC<SEOCardGridProps> = ({
  sortedData,
  children,
}) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      {children && (
        <div className="px-4">
          {children}
        </div>
      )}

      <div className="w-full px-4">
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        }>
          <TailwindMasonryGrid filteredData={sortedData} />
        </Suspense>
      </div>
    </div>
  )
}

interface TailwindMasonryGridProps {
  filteredData: Product[]
}

const TailwindMasonryGrid: React.FC<TailwindMasonryGridProps> = ({
  filteredData,
}) => {
  return (
    <ErrorBoundaryWrapper>
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
          {filteredData &&
            filteredData.map((data, index) => (
              <div key={`${index}-${data.id}`} className="flex">
                <ErrorBoundaryWrapper>
                  <AIToolCard data={data} order={index} />
                </ErrorBoundaryWrapper>
              </div>
            ))}
        </div>
      </div>
    </ErrorBoundaryWrapper>
  )
}

export const FeaturedGrid: React.FC<{ featuredData: Product[] }> = ({
  featuredData,
}) => {
  return (
    <ErrorBoundaryWrapper>
      <div className="w-full mx-auto bg-accent/20 border border-dashed border-border py-4 px-4 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {featuredData.map((data, index) => (
            <div key={`featured-${data.id}-${index}`} className="flex">
              <ErrorBoundaryWrapper>
                <AIToolCard 
                  trim={true} 
                  data={data} 
                  order={index} 
                  context="featured" 
                />
              </ErrorBoundaryWrapper>
            </div>
        ))}
      </div>
    </div>
    </ErrorBoundaryWrapper>
  )
}

export const EmptyFeaturedGrid = () => {
  const emptyData = [
    {
      codename: "Join the cult",
      punchline: "Next.j, Supabase & Tailwind Starters",
      product_website: "https://newcult.co",
      description:
        "Check out newcult.co for the premium version of this template",
      logo_src: "/ad-placeholder-metrics.png",
      tags: ["featured"],
      labels: ["featured-ad"],
    },
    {
      codename: "To get Admin Dashboard",
      product_website: "https://newcult.co",
      punchline: "Next.j, Supabase & Tailwind Starters",
      description:
        "Join the cult and get access to the admin dashboard for this template.",
      logo_src: "/ad-placeholder-1.png",
      tags: ["featured"],
      labels: ["featured-ad"],
    },
    {
      codename: "And AI scripts",
      product_website: "https://newcult.co",
      punchline: "Next.j, Supabase & Tailwind Starters",
      description:
        "Includes AI scripts to quickly add new products to your directory..",
      logo_src: "/ad-placeholder-tags.png",
      tags: ["featured"],
      labels: ["featured-ad"],
    },
  ]

  return (
    <div className="w-full mx-auto max-w-7xl  bg-black/20 dark:bg-neutral-950/40 border border-dashed border-black/10 py-3 px-3 rounded-[1.9rem]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {emptyData.map((data, index) => (
          <Link
            href="https://newcult.co"
            target="_blank"
            rel="noreferrer noopener"
            key={`empty-featured-${index}-${data.codename}`}
            className="md:py-0 "
          >
            {/* @ts-expect-error */}
            <AIToolCard trim={true} data={data} order={index} />
          </Link>
        ))}
      </div>
    </div>
  )
}
