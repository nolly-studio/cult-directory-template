"use client"

import { useState } from "react"
import { BookOpen, Play, Monitor } from "lucide-react"

interface CourseThumbnailProps {
  src?: string
  alt: string
  category?: string
  className?: string
}

const categoryIcons = {
  'ChatGPT': Monitor,
  'الذكاء الاصطناعي': Monitor,
  'التقنية': Monitor,
  'البرمجة': BookOpen,
  'التصميم': Play,
}

const categoryColors = {
  'ChatGPT': 'from-green-400 to-blue-500',
  'الذكاء الاصطناعي': 'from-purple-400 to-pink-500',
  'التقنية': 'from-blue-400 to-indigo-500',
  'البرمجة': 'from-yellow-400 to-orange-500',
  'التصميم': 'from-pink-400 to-red-500',
}

export default function CourseThumbnail({ src, alt, category, className = "" }: CourseThumbnailProps) {
  const [imageError, setImageError] = useState(false)
  
  const IconComponent = category ? categoryIcons[category as keyof typeof categoryIcons] || Monitor : Monitor
  const gradientColor = category ? categoryColors[category as keyof typeof categoryColors] || 'from-gray-400 to-gray-600' : 'from-gray-400 to-gray-600'

  if (!src || imageError) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br ${gradientColor} ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <IconComponent className="h-12 w-12 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-medium opacity-90">{category || 'دورة تعليمية'}</p>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/20" />
      </div>
    )
  }

  return (
    <img 
      src={src}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
    />
  )
}