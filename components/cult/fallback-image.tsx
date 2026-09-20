"use client"

import { useEffect, useState } from "react"
import Image, { ImageProps } from "next/image"

// Kupuri Media placeholder — no local asset needed
const placeholderImg = "https://placehold.co/400x400/edf1e8/9bc1bc?text=K"

interface ImageWithFallbackProps extends Omit<ImageProps, "src"> {
  fallback?: string | typeof placeholderImg
  src: string
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  fallback = placeholderImg,
  alt,
  src,
  ...props
}) => {
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    setError(false)
  }, [src])

  return (
    <Image
      alt={alt}
      onError={() => setError(true)}
      src={error ? fallback : src}
      {...props}
    />
  )
}
