"use client"

import React, { Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

import { ResourceCard } from "./directory-product-card"

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
  const pathname = usePathname()
  return (
    <div className="flex flex-col md:items-start gap-4 overflow-hidden pb-4 md:mx-4 mx-0 md:ml-[12rem] lg:ml-[12rem] relative">
      <div
        className={cn(
          " px-4",
          pathname.includes("/products")
            ? "md:p-4 md:gap-3"
            : "bg-white p-4 gap-3 dark:bg-[#1E1E1E] rounded-[2rem] shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]"
        )}
      >
        {children}
      </div>

      <div
        // className={cn(
        //   "bg-white dark:bg-[#1E1E1E] rounded-[2rem] p-4 w-full",
        //   "shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)]",
        //   "dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]"
        // )}
        className={cn(
          " p-4 w-full",
          pathname.includes("/products")
            ? ""
            : "bg-white dark:bg-[#1E1E1E] rounded-[2rem] shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]"
        )}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <div className="relative">
            <TailwindMasonryGrid filteredData={sortedData} />
          </div>
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
    <div className="flex justify-center w-full">
      <div className="gap-4 w-full ">
        <div className="columns-1 lg:columns-2 xl:columns-3 2xl:columns-4 3xl:columns-4 space-y-3 w-full  ">
          {filteredData &&
            filteredData.map((data, index) => (
              <div key={`${index}-${data.id}`} className="">
                <ResourceCard data={data} order={index} />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export const FeaturedGrid: React.FC<{ featuredData: Product[] }> = ({
  featuredData,
}) => {
  return (
    <div className="w-full mx-auto max-w-7xl bg-neutral-50/40 dark:bg-neutral-950/40 border border-dashed border-black/10 py-3 px-3 rounded-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {featuredData.map((data, index) => (
          <ResourceCard trim={true} data={data} order={index} />
        ))}
      </div>
    </div>
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
            key={`featured-${index}-${data.codename}`}
            className="md:py-0 "
          >
            {/* @ts-expect-error */}
            <ResourceCard trim={true} data={data} order={index} />
          </Link>
        ))}
      </div>
    </div>
  )
}
