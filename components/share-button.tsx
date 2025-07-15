"use client"

import { useState } from "react"
import { Share2, Check, Copy, Twitter, Facebook, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ShareButtonProps {
  url: string
  title: string
  description?: string
  size?: "sm" | "default" | "lg"
  variant?: "outline" | "default" | "ghost"
}

export default function ShareButton({ 
  url, 
  title, 
  description, 
  size = "sm",
  variant = "outline"
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description || title)
  const encodedUrl = encodeURIComponent(fullUrl)

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(fullUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  }

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: fullUrl,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size}>
          <Share2 className="h-4 w-4 ml-2" />
          مشاركة
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCopyLink}>
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2 text-green-500" />
              تم النسخ!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              نسخ الرابط
            </>
          )}
        </DropdownMenuItem>
        
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <DropdownMenuItem onClick={handleNativeShare}>
            <Share2 className="h-4 w-4 mr-2" />
            مشاركة
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem asChild>
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <Twitter className="h-4 w-4 mr-2" />
            تويتر
          </a>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <Facebook className="h-4 w-4 mr-2" />
            فيسبوك
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}