"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }

    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(Math.min(Math.max(scrollProgress, 0), 100))
    }

    window.addEventListener("scroll", updateProgress, { passive: true })
    updateProgress() // Initialize on mount
    
    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Progress 
        value={progress} 
        className="h-1 rounded-none bg-primary/10"
      />
    </div>
  )
}