"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { usePathname } from 'next/navigation'

interface NavigationContextType {
  currentPath: string
  isLoading: boolean
  breadcrumbs: Array<{
    label: string
    href?: string
    current?: boolean
  }>
  setBreadcrumbs: (breadcrumbs: NavigationContextType['breadcrumbs']) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [breadcrumbs, setBreadcrumbs] = useState<NavigationContextType['breadcrumbs']>([])

  // Auto-generate breadcrumbs from pathname
  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean)
    const defaultBreadcrumbs = [
      { label: 'الرئيسية', href: '/' }
    ]

    if (segments.length > 0) {
      const pathMapping: Record<string, string> = {
        'tools': 'الأدوات',
        'news': 'الأخبار',
        'tutorials': 'التعليم',
        'blog': 'المدونة',
        'products': 'المنتجات',
        'learn': 'التعلم',
        'courses': 'الدورات',
        'favorites': 'المفضلة',
        'admin': 'الإدارة'
      }

      let currentPath = ''
      segments.forEach((segment, index) => {
        currentPath += `/${segment}`
        const label = pathMapping[segment] || segment
        const isLast = index === segments.length - 1
        
        defaultBreadcrumbs.push({
          label,
          href: isLast ? undefined : currentPath,
          current: isLast
        })
      })
    }

    setBreadcrumbs(defaultBreadcrumbs)
  }, [pathname])

  // Show loading state on route changes
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 100)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <NavigationContext.Provider
      value={{
        currentPath: pathname,
        isLoading,
        breadcrumbs,
        setBreadcrumbs
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}

// Hook to set custom breadcrumbs
export function useBreadcrumbs(breadcrumbs: NavigationContextType['breadcrumbs']) {
  const { setBreadcrumbs } = useNavigation()
  
  useEffect(() => {
    setBreadcrumbs(breadcrumbs)
    
    // Reset to auto-generated breadcrumbs on cleanup
    return () => {
      setBreadcrumbs([])
    }
  }, [breadcrumbs, setBreadcrumbs])
}