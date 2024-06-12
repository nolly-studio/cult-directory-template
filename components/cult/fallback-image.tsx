"use client"

import { useEffect, useState } from "react"
import Image, { ImageProps } from "next/image"
import placeholderImg from "@/assets/placeholder.png"

interface ImageWithFallbackProps extends Omit<ImageProps, "src"> {
  fallback?: string
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
