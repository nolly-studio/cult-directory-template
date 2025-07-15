"use client"

import { useOptimistic } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, Eye, Globe, DollarSign, Sparkles, Zap, Brain, ExternalLink } from "lucide-react"

import { cn, codeNameToSlug } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import MinimalCard, {
  MinimalCardContent,
  MinimalCardDescription,
  MinimalCardFooter,
  MinimalCardImage,
  MinimalCardTitle,
} from "@/components/cult/minimal-card"
import { incrementClickCount } from "@/app/actions/product"
import { ProductLogo } from "@/components/product-logo"
import { StarRating } from "@/components/star-rating"

interface AITool {
  id: string
  created_at: string
  full_name: string
  email: string
  twitter_handle: string
  product_website: string
  codename: string
  punchline: string
  description: string
  logo_src: string
  user_id: string
  tags: string[]
  view_count: number
  approved: boolean
  labels: string[]
  categories: string
  // AI specific fields
  tool_type?: string
  difficulty_level?: string
  language_support?: string[]
  is_free?: boolean
  arabic_name?: string
  arabic_description?: string
  pricing_model?: string
  // Rating data (passed from server)
  averageRating?: number
  reviewCount?: number
}

const difficultyColors = {
  'مبتدئ': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'متوسط': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'متقدم': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
}

const categoryIcons = {
  'text-generation': Brain,
  'image-generation': Sparkles,
  'video-generation': Zap,
  'code-assistant': Brain,
  'productivity': Zap,
  'design': Sparkles,
  'search-engine': Globe
}

export const AIToolCard: React.FC<{
  trim?: boolean
  data: AITool
  order: any
  context?: string
}> = ({ trim, data, order, context = "products" }) => {
  const [optimisticResource, addOptimisticUpdate] = useOptimistic<
    AITool,
    Partial<AITool>
  >(data, (currentResource, newProperties) => {
    return { ...currentResource, ...newProperties }
  })

  const handleClick = () => {
    const newClickCount = (optimisticResource.view_count || 0) + 1
    addOptimisticUpdate({ view_count: newClickCount })
    incrementClickCount(data.id)
  }

  const handleTryNow = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Define demo URLs for specific tools
    const demoUrls: { [key: string]: string } = {
      'ChatGPT': 'https://chat.openai.com',
      'Claude': 'https://claude.ai/chat',
      'Perplexity': 'https://perplexity.ai'
    }
    
    const demoUrl = demoUrls[data.codename] || data.product_website
    if (demoUrl && typeof window !== 'undefined') {
      // Track the demo click
      incrementClickCount(data.id)
      window.open(demoUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const hasTryNowFeature = ['ChatGPT', 'Claude', 'Perplexity'].includes(data.codename)
  const Icon = categoryIcons[data.tool_type as keyof typeof categoryIcons] || Brain

  return (
    <motion.div
      key={`ai-tool-card-${data.id}-${order}`}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative w-full h-full"
    >
      <Link
        href={`/tools/${codeNameToSlug(data.codename)}?from=${context}`}
        key={`/tools/${data.id}`}
        className=""
        onClick={handleClick}
      >
        <div className="w-full h-full">
          <MinimalCard
            className={cn(
              "w-full h-full flex flex-col transition-all duration-150 hover:shadow-lg",
              optimisticResource.view_count > 350
                ? "border-primary/20 bg-gradient-to-br from-primary/5 to-transparent"
                : ""
            )}
          >
            <div className="flex items-start gap-3 flex-1">
              <ProductLogo 
                logo_src={data.logo_src}
                tool_type={data.tool_type}
                codename={data.codename}
                arabic_name={data.arabic_name}
                size="md"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <MinimalCardTitle className="text-base font-bold mb-1 line-clamp-2">
                      {data.codename}
                    </MinimalCardTitle>
                    {data.arabic_name && (
                      <p className="text-xs text-muted-foreground mb-2 truncate">
                        {data.arabic_name}
                      </p>
                    )}
                  </div>
                  
                  {data.is_free !== undefined && (
                    <Badge variant={data.is_free ? "default" : "secondary"} className="text-xs flex-shrink-0">
                      {data.is_free ? "مجاني" : "مدفوع"}
                    </Badge>
                  )}
                </div>
                
                <MinimalCardDescription className="text-sm leading-relaxed mb-3 line-clamp-3">
                  {data.arabic_description || data.punchline}
                </MinimalCardDescription>
                
                <div className="flex flex-wrap gap-2 items-center">
                  {data.difficulty_level && (
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", difficultyColors[data.difficulty_level as keyof typeof difficultyColors])}
                    >
                      {data.difficulty_level}
                    </Badge>
                  )}
                  
                  {data.categories && (
                    <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                      {data.categories}
                    </Badge>
                  )}
                  
                  {data.language_support?.includes('Arabic') && (
                    <Badge variant="outline" className="text-xs bg-cyan-50 text-cyan-700 border-cyan-200">
                      يدعم العربية
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Try Now Button */}
            {hasTryNowFeature && (
              <div className="px-4 pb-3">
                <Button 
                  onClick={handleTryNow}
                  size="sm" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
                >
                  <ExternalLink className="w-3 h-3 ml-1" />
                  جرّب مجاناً
                </Button>
              </div>
            )}

            <MinimalCardFooter>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{optimisticResource.view_count || 0}</span>
                  </div>
                  
                  {(optimisticResource.averageRating && optimisticResource.averageRating > 0) ? (
                    <StarRating 
                      rating={optimisticResource.averageRating} 
                      readonly 
                      size="sm" 
                      showCount
                      reviewCount={optimisticResource.reviewCount}
                    />
                  ) : (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-gray-300" />
                      <span className="text-xs text-muted-foreground">جديد</span>
                    </div>
                  )}
                </div>
                
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="text-xs text-primary font-medium"
                >
                  استكشف ←
                </motion.span>
              </div>
            </MinimalCardFooter>
          </MinimalCard>
        </div>
      </Link>
    </motion.div>
  )
}