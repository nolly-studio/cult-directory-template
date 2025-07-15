"use client"

import { cn } from "@/lib/utils"

interface SkipNavProps {
  className?: string
}

export function SkipNavigation({ className }: SkipNavProps) {
  return (
    <div className={cn("sr-only focus-within:not-sr-only", className)}>
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transform -translate-y-full focus:translate-y-0 transition-transform"
      >
        تخطي إلى المحتوى الرئيسي
      </a>
      <a
        href="#navigation"
        className="fixed top-4 left-32 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transform -translate-y-full focus:translate-y-0 transition-transform"
      >
        تخطي إلى التنقل
      </a>
    </div>
  )
}

// Main content wrapper component
export function MainContent({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <main 
      id="main-content" 
      className={cn("focus:outline-none", className)}
      tabIndex={-1}
    >
      {children}
    </main>
  )
}