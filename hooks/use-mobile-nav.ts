"use client"

import { useState, useEffect, useCallback } from "react"

export function useMobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close mobile nav when clicking outside or on route change
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && isMobile) {
        const target = event.target as HTMLElement
        if (!target.closest('[data-mobile-nav]')) {
          setIsOpen(false)
        }
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      // Prevent body scroll when mobile nav is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, isMobile])

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  return {
    isOpen,
    isMobile,
    toggle,
    close,
    open
  }
}