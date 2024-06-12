"use client"

import React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Blocks,
  Edit2Icon,
  ExternalLink,
  Hash,
  HeartIcon,
  MessageSquareTextIcon,
  Sparkles,
  Tag,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { CardDescription, CardTitle } from "@/components/ui/card"

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

export const ProductDetails = ({ product }: { product: Product }) => (
  <div className={cn("py-4 relative flex flex-col h-full")}>
    <div className="w-full gap-8 py-6 relative items-center">
      <div className="grid grid-cols-6 md:grid-cols-12 gap-8 w-full">
        <div className="space-y-6 col-span-6 md:col-span-5 md:mt-12 z-10">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Products</BreadcrumbLink>/
              <BreadcrumbLink href={`/products/${product.id}`}>
                {product.codename.substring(0, 20)}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <CardTitle className="text-6xl tracking-tighter font-extrabold text-neutral-900 dark:text-neutral-200">
            {product.punchline}
          </CardTitle>
          <CardDescription className="md:text-xl text-lg tracking-tight text-neutral-800 text-balance dark:text-neutral-400 flex gap-2 items-center ">
            <Blocks className="stroke-1 size-8" />{" "}
            <span className="flex-wrap">{product.categories}</span>
          </CardDescription>
          {product.tags.length >= 1 && (
            <CardDescription className="md:text-xl text-lg tracking-tight text-neutral-800 text-balance dark:text-neutral-400 flex gap-2 items-center ">
              <Tag className="stroke-1 size-8" />{" "}
              <span className="flex-wrap">{product.tags.join(", ")}</span>
            </CardDescription>
          )}

          <Link
            href={`/products`}
            className="py-4 md:flex items-center text-2xl font-semibold text-yellow-500  z-10 hidden"
          >
            <ArrowLeft className="mr-2" /> Back to all products
          </Link>
        </div>

        <div
          className={cn(
            "w-full col-span-7 p-3 md:p-7 rounded-[36px] md:rounded-[58px] border border-black/10 space-y-10",
            "bg-white dark:bg-[#1E1E1E]  shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]"
          )}
        >
          <div className="w-full p-1 md:p-3 rounded-[28px] md:rounded-[36px] bg-[#3d3d3d]">
            <img
              className="w-full h-full rounded-3xl object-cover"
              src={product.logo_src}
              alt={`${product.full_name} image`}
            />
          </div>
          <CardDescription className="text-2xl tracking-tight leading-tight text-neutral-800 text-balance dark:text-neutral-400">
            {product.description}
          </CardDescription>

          <div className="md:text-xl sm:text-lg tracking-tight text-neutral-800 text-balance dark:text-neutral-400 flex gap-2 items-center flex-wrap text-sm">
            {product.labels[0] !== "unlabeled" &&
              product.labels.map((label, index) => (
                <Link
                  href={`/products?label=${label}`}
                  key={index}
                  className="flex-wrap flex gap-1"
                >
                  <Hash className="stroke-1 size-4" /> <span>{label}</span>
                </Link>
              ))}
          </div>

          {product.product_website && (
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="w-full flex items-center justify-center py-6 text-lg rounded-[44px]"
            >
              <a
                href={product.product_website}
                target="_blank"
                rel="noreferrer noopener"
              >
                <span className="font-semibold">Check out site</span>
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
    <Link
      href={`/`}
      className="py-4 md:hidden items-center text-2xl font-semibold text-yellow-500  z-10 w-full flex"
    >
      <ArrowLeft className="mr-2" /> Back to all productss
    </Link>
    <div className="absolute top-36 md:top-0 left-[-10%] right-0 h-[400px] w-[300px]  md:h-[500px] md:w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,235,59,.15),rgba(255,255,255,0))]"></div>
  </div>
)
