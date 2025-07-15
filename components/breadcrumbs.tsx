"use client"

import Link from "next/link"
import { ChevronLeft, Home } from "lucide-react"
import { Fragment } from "react"

export interface BreadcrumbItem {
  label: string
  labelEn?: string
  href?: string
  current?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav 
      aria-label="مسار التنقل" 
      className={`flex items-center space-x-2 text-sm ${className}`}
      dir="rtl"
      role="navigation"
    >
      {/* Home icon */}
      <Link 
        href="/" 
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="الرئيسية"
      >
        <Home className="h-4 w-4" />
      </Link>

      {items.map((item, index) => (
        <Fragment key={index}>
          <ChevronLeft className="h-4 w-4 text-muted-foreground/50" />
          
          {item.current || !item.href ? (
            <span 
              className="font-medium text-foreground"
              aria-current={item.current ? "page" : undefined}
            >
              {item.label}
              {item.labelEn && (
                <span className="text-muted-foreground font-normal ml-1">
                  ({item.labelEn})
                </span>
              )}
            </span>
          ) : (
            <Link 
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
              {item.labelEn && (
                <span className="font-normal ml-1">
                  ({item.labelEn})
                </span>
              )}
            </Link>
          )}
        </Fragment>
      ))}
      
    </nav>
  )
}