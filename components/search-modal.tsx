"use client"

import { useState, useEffect } from "react"
import { Search, Package, Newspaper, BookOpen, PenTool, ArrowRight, X, Zap } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface SearchResult {
  id: string
  title: string
  description: string
  category: string
  type: 'tool' | 'news' | 'tutorial' | 'blog'
  href: string
  icon: React.ComponentType<any>
}

export function SearchModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void 
}) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Mock search results - in a real app, this would call your search API
  const mockSearch = async (searchQuery: string): Promise<SearchResult[]> => {
    if (!searchQuery.trim()) return []
    
    const mockResults: SearchResult[] = [
      {
        id: "1",
        title: "ChatGPT - مساعد الذكاء الاصطناعي",
        description: "أداة محادثة قوية تساعدك في كتابة النصوص وحل المشاكل",
        category: "أدوات الذكاء الاصطناعي",
        type: "tool",
        href: "/tools/chatgpt",
        icon: Package
      },
      {
        id: "2", 
        title: "مقدمة شاملة للذكاء الاصطناعي",
        description: "تعلم أساسيات الذكاء الاصطناعي من البداية",
        category: "دروس تعليمية",
        type: "tutorial",
        href: "/tutorials/ai-introduction",
        icon: BookOpen
      },
      {
        id: "3",
        title: "OpenAI تطلق GPT-5 قريباً",
        description: "آخر التطورات في عالم الذكاء الاصطناعي",
        category: "أخبار التقنية",
        type: "news",
        href: "/news/openai-gpt5",
        icon: Newspaper
      },
      {
        id: "4",
        title: "كيفية كتابة Prompts فعالة",
        description: "دليل شامل لإتقان فن كتابة الأوامر للذكاء الاصطناعي",
        category: "مقالات",
        type: "blog",
        href: "/blog/effective-prompts",
        icon: PenTool
      }
    ]

    // Filter results based on search query
    return mockResults.filter(result => 
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  // Search with debouncing
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim()) {
        setIsLoading(true)
        try {
          const searchResults = await mockSearch(query)
          setResults(searchResults)
        } catch (error) {
          console.error('Search error:', error)
          setResults([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      onClose()
    }
  }

  // Handle result click
  const handleResultClick = (href: string) => {
    router.push(href)
    onClose()
  }

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery("")
      setResults([])
    }
  }, [isOpen])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tool':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'tutorial':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'news':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'blog':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              البحث السريع
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Search Input */}
        <div className="px-6 py-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن الأدوات، الدروس، المقالات..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-4 h-12 text-base"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {!query.trim() && (
            <div className="px-6 py-8 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">ابحث في جميع المحتوى</h3>
              <p className="text-muted-foreground">
                اكتب للبحث في الأدوات، الدروس، المقالات، والأخبار
              </p>
            </div>
          )}

          {query.trim() && isLoading && (
            <div className="px-6 py-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">جاري البحث...</p>
            </div>
          )}

          {query.trim() && !isLoading && results.length === 0 && (
            <div className="px-6 py-8 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا توجد نتائج</h3>
              <p className="text-muted-foreground mb-4">
                جرب كلمات مختلفة أو تحقق من الإملاء
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  router.push(`/search?q=${encodeURIComponent(query)}`)
                  onClose()
                }}
              >
                البحث في جميع المحتوى
                <ArrowRight className="h-4 w-4 mr-2" />
              </Button>
            </div>
          )}

          {results.length > 0 && (
            <div className="px-6 py-4 space-y-3">
              {results.map((result) => {
                const Icon = result.icon
                return (
                  <Card 
                    key={result.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleResultClick(result.href)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm truncate">
                              {result.title}
                            </h3>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs px-2 py-1 ${getTypeColor(result.type)}`}
                            >
                              {result.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {result.description}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              
              {results.length > 0 && (
                <div className="pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      router.push(`/search?q=${encodeURIComponent(query)}`)
                      onClose()
                    }}
                  >
                    عرض جميع النتائج ({results.length}+)
                    <ArrowRight className="h-4 w-4 mr-2" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>اضغط Enter للبحث</span>
              <span>ESC للإغلاق</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              <span>بحث سريع</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}