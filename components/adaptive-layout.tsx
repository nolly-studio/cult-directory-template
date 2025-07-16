"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/contexts/sidebar-context"

interface AdaptiveLayoutProps {
  children: ReactNode
  className?: string
}

export function AdaptiveLayout({ children, className }: AdaptiveLayoutProps) {
  const pathname = usePathname()
  
  // Use sidebar context with fallback
  let isOpen = true
  try {
    const sidebar = useSidebar()
    isOpen = sidebar.isOpen
  } catch (error) {
    console.warn("Sidebar context not available in AdaptiveLayout")
  }
  
  // Don't apply sidebar margin on admin pages or login pages
  const excludedPages = ['/login', '/login/password']
  const shouldApplyMargin = !pathname.startsWith('/admin') && !excludedPages.includes(pathname)

  return (
    <div 
      className={cn(
        "transition-all duration-150 ease-in-out w-full",
        className
      )}
    >
      <div className="w-full max-w-6xl mx-auto px-4">
        {children}
      </div>
    </div>
  )
}