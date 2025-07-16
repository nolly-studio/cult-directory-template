"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

interface NavigationEvent {
  from: string
  to: string
  timestamp: number
  method: 'click' | 'keyboard' | 'programmatic'
}

export function useNavigationAnalytics() {
  const pathname = usePathname()
  const previousPath = useRef<string>('')
  const startTime = useRef<number>(Date.now())

  useEffect(() => {
    const currentPath = pathname
    const previous = previousPath.current
    
    if (previous && previous !== currentPath) {
      const event: NavigationEvent = {
        from: previous,
        to: currentPath,
        timestamp: Date.now(),
        method: 'click' // Default, can be enhanced
      }
      
      // Track page view time
      const timeOnPage = Date.now() - startTime.current
      
      // Only track in production and if analytics is enabled
      if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
        // Send to analytics service
        try {
          // Example: Google Analytics 4
          if (typeof window !== 'undefined' && 'gtag' in window) {
            const gtag = (window as any).gtag
            gtag('event', 'page_view', {
              page_title: document.title,
              page_location: window.location.href,
              page_path: currentPath,
              time_on_previous_page: timeOnPage
            })
          }
          
          // Example: Custom analytics
          fetch('/api/analytics/navigation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              event,
              timeOnPage,
              userAgent: navigator.userAgent,
              referrer: document.referrer
            })
          }).catch(console.error)
        } catch (error) {
          // Silently fail in analytics
          console.debug('Analytics tracking failed:', error)
        }
      }
    }
    
    previousPath.current = currentPath
    startTime.current = Date.now()
  }, [pathname])

  // Track navigation method
  const trackNavigation = (method: NavigationEvent['method']) => {
    if (process.env.NODE_ENV === 'production') {
      // Can be used to track specific navigation methods
      console.debug('Navigation method:', method)
    }
  }

  return {
    trackNavigation
  }
}