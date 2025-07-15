"use client"

import { FileText, BookOpen, Camera, PenTool } from "lucide-react"
import { ImageWithFallback } from "@/components/cult/fallback-image"
import { cn } from "@/lib/utils"

interface ContentImageProps {
  image_url?: string | null
  content_type?: 'news' | 'tutorial' | 'general' | 'blog'
  title: string
  className?: string
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto'
  size?: 'sm' | 'md' | 'lg'
  showFallbackIcon?: boolean
}

const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video", 
  wide: "aspect-[2/1]",
  auto: ""
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-24 h-24", 
  lg: "w-full h-48"
}

const contentTypeIcons = {
  news: FileText,
  tutorial: BookOpen,
  general: Camera,
  blog: PenTool
}

function getStorageBucketUrl(image_url: string, content_type: string): string {
  // If already a full URL (external or storage), return as is
  if (image_url.startsWith('http') || image_url.startsWith('/')) {
    return image_url
  }
  
  // Determine the correct bucket based on content type
  const bucketMap = {
    news: 'news-images',
    tutorial: 'tutorial-images',
    general: 'site-assets',
    blog: 'blog-images'
  }
  
  const bucket = bucketMap[content_type as keyof typeof bucketMap] || 'site-assets'
  
  // If it's just a filename, construct storage bucket URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${image_url}`
}

export function ContentImage({ 
  image_url, 
  content_type = 'general',
  title,
  className,
  aspectRatio = 'video',
  size = 'lg',
  showFallbackIcon = true
}: ContentImageProps) {
  const Icon = contentTypeIcons[content_type] || Camera
  const aspectClass = aspectRatioClasses[aspectRatio]
  const sizeClass = size === 'lg' ? '' : sizeClasses[size]

  // If we have an image URL, try to display it with fallback
  if (image_url?.trim()) {
    const imageUrl = getStorageBucketUrl(image_url, content_type)
    
    return (
      <div className={cn(
        "rounded-lg overflow-hidden bg-muted",
        aspectClass,
        sizeClass,
        className
      )}>
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          fallback="/placeholder.png"
          fill={size === 'lg'}
          width={size === 'sm' ? 64 : size === 'md' ? 96 : undefined}
          height={size === 'sm' ? 64 : size === 'md' ? 96 : undefined}
        />
      </div>
    )
  }

  // Fallback to icon if no image and showFallbackIcon is true
  if (showFallbackIcon) {
    return (
      <div className={cn(
        "rounded-lg bg-muted flex items-center justify-center",
        aspectClass,
        sizeClass,
        className
      )}>
        <Icon className={cn(
          "text-muted-foreground",
          size === 'sm' ? "w-6 h-6" :
          size === 'md' ? "w-8 h-8" : "w-12 h-12"
        )} />
        <span className="sr-only">صورة {title}</span>
      </div>
    )
  }

  // Return empty div if no image and no fallback icon
  return (
    <div className={cn(
      "rounded-lg bg-muted",
      aspectClass,
      sizeClass,
      className
    )} />
  )
} 