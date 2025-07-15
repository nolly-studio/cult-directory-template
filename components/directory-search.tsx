"use client"

import { useTransition, useState, useEffect, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { InputButton } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

import { IconSpinner } from "./ui/icons"

export function DirectorySearch() {
  let router = useRouter()
  let pathname = usePathname()

  let [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Handle search with error handling
  const handleSearch = useCallback((term: string) => {
    if (!term.trim()) return
    
    // Input validation
    if (term.length < 2) {
      setError('يجب أن يحتوي البحث على حرفين على الأقل')
      return
    }
    
    if (term.length > 100) {
      setError('البحث طويل جداً')
      return
    }
    
    // Sanitize input
    const sanitizedTerm = term.replace(/[<>"'&]/g, '').trim()
    
    if (!sanitizedTerm) {
      setError('البحث يحتوي على أحرف غير مسموحة')
      return
    }
    
    setError('')
    
    try {
      startTransition(() => {
        router.push(`/search?q=${encodeURIComponent(sanitizedTerm)}`)
      })
    } catch (err) {
      setError('حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.')
    }
  }, [router])

  // Trigger search when debounced term changes
  useEffect(() => {
    if (debouncedTerm) {
      handleSearch(debouncedTerm)
    }
  }, [debouncedTerm, handleSearch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    
    // Clear error when user starts typing
    if (error) {
      setError('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = (e.target as HTMLInputElement).value
      if (value.trim()) {
        handleSearch(value.trim())
      }
    }
  }

  return (
    <div className="relative max-w-[90%] md:min-w-[4rem] w-full md:max-w-[42ch] md:ml-auto">
      <InputButton
        hasIcon
        id="search"
        className={cn("relative pr-10 pl-12 shadow-sm md:py-5 w-full", error && "border-red-500")}
        tabIndex={0}
        value={searchTerm}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="ابحث في الأدوات والأخبار والدروس"
        spellCheck={false}
        enterKeyHint="go"
        aria-invalid={!!error}
        aria-describedby={error ? "search-error" : undefined}
      >
        <div className="relative -ml-10 hidden items-center justify-center md:flex">
          <div className="absolute ml-4 w-14 rounded-r-full">
            <AnimatePresence>
              {isPending ? (
                <IconSpinner className="-ml-0.5 h-7 w-7 animate-spin stroke-teal-500/80 group-hover:text-teal-500 dark:stroke-teal-400 dark:group-hover:text-teal-300" />
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </InputButton>
      
      {error && (
        <Alert className="mt-2" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription id="search-error">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
