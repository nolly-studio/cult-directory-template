import { Suspense } from "react"
import Link from "next/link"
import { Brain, Sparkles, BookOpen, Newspaper, ArrowLeft, ArrowRight, Zap, Star } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/cult/fade-in"
import { DirectorySearch } from "@/components/directory-search"
import { NewsletterHero } from "@/components/newsletter-hero"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorBoundaryWrapper } from "@/components/error-boundary"
import { UserContext } from "@/components/user-context"
import { LaunchpadExplainer } from "@/components/launchpad-explainer"
import { CapstoneShowcase } from "@/components/capstone-showcase"
import { ArmoryLogos } from "@/components/armory-logos"
import { HowItWorks } from "@/components/how-it-works"
import { Testimonials } from "@/components/testimonials"
import { SuccessStats } from "@/components/success-stats"
import { FinalCTA } from "@/components/final-cta"

import {
  EmptyFeaturedGrid,
  FeaturedGrid,
  ResourceCardGrid,
} from "../components/directory-card-grid"
import { NavSidebar } from "../components/nav"
import { AdaptiveLayout } from "@/components/adaptive-layout"
import { getCachedFilters } from "./actions/cached_actions"
import { getProducts } from "./actions/product"
import { getProductsWithRatings } from "./actions/reviews"
import { getTimeBasedStats, getActivityMessages, getToolOfTheDay, getWeeklyTrendingTools } from "@/lib/time-based-stats"
import { getFeaturedCourses } from "./actions/courses"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Featured AI tools to highlight
const FEATURED_IDS: string[] = [
  '550e8400-e29b-41d4-a716-446655440001', // ChatGPT
  '550e8400-e29b-41d4-a716-446655440004', // Midjourney
  '550e8400-e29b-41d4-a716-446655440002', // Claude
  '550e8400-e29b-41d4-a716-446655440014', // Perplexity
  '550e8400-e29b-41d4-a716-446655440007', // GitHub Copilot
  '550e8400-e29b-41d4-a716-446655440005', // DALL-E 3
]

async function Page({ searchParams }: { searchParams: { search?: string } }) {
  let data: any[] = []
  let filters: { categories: string[]; labels: string[]; tags: string[] } = { 
    categories: [], 
    labels: [], 
    tags: [] 
  }
  let featuredCourses: any[] = []
  
  try {
    const [productsData, filtersData, coursesData] = await Promise.all([
      getProducts(searchParams.search),
      getCachedFilters(),
      getFeaturedCourses()
    ])
    
    data = productsData
    filters = filtersData
    featuredCourses = coursesData
  } catch (error) {
    console.error('Failed to fetch data:', error)
    // Continue with empty data for build process
  }
  
  const filteredFeaturedData = data.filter((d: any) =>
    FEATURED_IDS.includes(d.id)
  )
  
  // Get popular tools (high view count)
  const popularToolsBase = data
    .sort((a: any, b: any) => (b.view_count || 0) - (a.view_count || 0))
    .slice(0, 6)
  
  // Get latest tools
  const latestTools = data
    .sort((a: any, b: any) => {
      const dateA = new Date(b.created_at || 0).getTime()
      const dateB = new Date(a.created_at || 0).getTime()
      return dateA - dateB
    })
    .slice(0, 4)

  // Get ratings for popular tools (with error handling)
  let ratings: any[] = []
  try {
    if (popularToolsBase.length > 0) {
      ratings = await getProductsWithRatings(popularToolsBase.map((tool: any) => tool.id))
    }
  } catch (error) {
    console.error('Error fetching ratings:', error)
    ratings = []
  }
  
  // Merge popular tools with their ratings
  const popularTools = popularToolsBase.map((tool: any) => {
    const rating = ratings.find(r => r.productId === tool.id)
    return {
      ...tool,
      averageRating: rating?.averageRating || 0,
      reviewCount: rating?.totalReviews || 0
    }
  })

  // Get time-based stats for dynamic feeling
  const timeStats = getTimeBasedStats()
  const activityMessages = getActivityMessages()
  const toolOfTheDay = getToolOfTheDay()
  const weeklyTrending = getWeeklyTrendingTools()

  return (
    <>
      <AdaptiveLayout className="py-6">
        <FadeIn>
          {/* Hero Section - The Declaration */}
          <div className="text-center pb-16 pt-12">
            {/* Main Headline */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
                رحلتك لبناء المستقبل
                <br />
                بالذكاء الاصطناعي تبدأ هنا
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
                توقف عن مشاهدة الدروس النظرية. حان الوقت لبناء مشاريع حقيقية مع نظامنا التعليمي المتكامل:
                <br />
                <strong className="text-foreground font-bold text-2xl md:text-3xl">
                  The Launchpad | منصة الإطلاق
                </strong>
              </p>
            </div>

            {/* Primary CTA Section */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-4 text-lg glow-teal glow-teal-hover transition-all duration-300">
                <Link href="/tutorials">
                  🚀 ابدأ العمل على مشروعك الأول (مجانًا)
                </Link>
              </Button>
            </div>

          </div>

          {/* Return Visitor Message */}
          <UserContext showReturnMessage={true} />
        </FadeIn>
      </AdaptiveLayout>
      
      {/* The Launchpad Explainer Block */}
      <LaunchpadExplainer />
      
      {/* Capstone Project Showcase */}
      <CapstoneShowcase />
      
      {/* The Armory - Logos Only */}
      <ArmoryLogos featuredTools={data} />
      
      {/* How It Works Section */}
      <HowItWorks />
      
      {/* Enhanced Testimonials Section */}
      <Testimonials />
      
      {/* Success Stats Section */}
      <SuccessStats />
      
      {/* Final CTA Section */}
      <FinalCTA />
      
    </>
  )
}

export default Page