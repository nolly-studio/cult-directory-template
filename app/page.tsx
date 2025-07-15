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
      <NavSidebar
        categories={filters.categories}
        labels={filters.labels}
        tags={filters.tags}
      />

      <AdaptiveLayout className="py-6">
        <FadeIn>
          {/* Hero Section - Conversion Focused */}
          <div className="text-center pb-12 pt-8">
            {/* Main Headline */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Brain className="h-8 w-8 text-primary" />
                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {timeStats.totalUsers}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-l from-purple-600 to-blue-600 bg-clip-text text-transparent">
                إتقان الذكاء الاصطناعي
                <br />
                <span className="text-2xl md:text-3xl">باللغة العربية</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                دورات عملية، أدوات مشروحة، ونصائح الخبراء. كل ما تحتاجه لتبدأ بثقة وتتوقف عن الشعور بالضياع.
                <br />
                <strong className="text-foreground">تعلّم من الصفر</strong> إلى 
                <strong className="text-foreground">الاحتراف</strong>
              </p>
            </div>

            {/* Primary CTA Section */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-8">
                <Link href="/tutorials">
                  📚 ابدأ أول دورة مجانية لك
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="border-2 border-blue-500 text-blue-700 hover:bg-blue-50 font-medium">
                <Link href="/tools">
                  🔧 استكشف الأدوات
                </Link>
              </Button>
            </div>

            {/* Search Section - Secondary */}
            <div className="max-w-md mx-auto mb-8">
              <DirectorySearch />
              <p className="text-sm text-muted-foreground mt-2">
                ابحث من بين {data.length} أداة مشروحة ومصنفة
              </p>
            </div>

            {/* Social Proof Bar */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-4 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">{timeStats.activeUsers}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>{timeStats.todayTrials}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-orange-500" />
                  <span>انضم إلى آلاف المتعلمين العرب</span>
                </div>
              </div>
            </div>
          </div>

          {/* Return Visitor Message */}
          <UserContext showReturnMessage={true} />
          
          {/* Featured Courses Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold">ابدأ رحلتك التعليمية من هنا</h2>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/tutorials">
                  عرض جميع الدورات
                  <ArrowRight className="h-4 w-4 mr-2" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCourses.length > 0 ? (
                featuredCourses.slice(0, 3).map((course) => {
                  const difficultyColor = 
                    course.difficulty_level === 'مبتدئ' ? 'bg-green-100 text-green-800' :
                    course.difficulty_level === 'متوسط' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  
                  const durationColor = 
                    course.difficulty_level === 'مبتدئ' ? 'bg-green-500' :
                    course.difficulty_level === 'متوسط' ? 'bg-blue-500' :
                    'bg-purple-500'
                  
                  const durationHours = Math.round(course.total_duration_minutes / 60)
                  
                  return (
                    <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
                      <Link href={`/courses/${course.slug}`}>
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={`${difficultyColor} text-xs`}>
                              {course.price === 0 ? 'مجاني' : `${course.price} ${course.currency}`}
                            </Badge>
                            <div className="text-xs text-muted-foreground">{course.difficulty_level}</div>
                          </div>
                          <CardTitle className="text-lg font-bold">{course.title_ar}</CardTitle>
                          <p className="text-sm text-muted-foreground">{course.description_ar}</p>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 ${durationColor} rounded-full`}></div>
                                <span className="text-xs text-muted-foreground">
                                  {durationHours > 0 ? `${durationHours} ساعة` : `${course.total_duration_minutes} دقيقة`}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {course.lesson_count} درس
                                </span>
                              </div>
                            </div>
                            <Button size="sm" className="group-hover:scale-105 transition-transform">
                              ابدأ التعلم
                            </Button>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  )
                })
              ) : (
                // Fallback static courses if no data
                <>
                  <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <Link href="/tutorials">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-green-100 text-green-800 text-xs">مجاني</Badge>
                          <div className="text-xs text-muted-foreground">للمبتدئين</div>
                        </div>
                        <CardTitle className="text-lg font-bold">أساسيات ChatGPT</CardTitle>
                        <p className="text-sm text-muted-foreground">تعلم كيفية استخدام ChatGPT بفعالية لزيادة إنتاجيتك</p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-muted-foreground">30 دقيقة</span>
                          </div>
                          <Button size="sm" className="group-hover:scale-105 transition-transform">
                            ابدأ التعلم
                          </Button>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                  <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <Link href="/tutorials">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-green-100 text-green-800 text-xs">مجاني</Badge>
                          <div className="text-xs text-muted-foreground">متوسط</div>
                        </div>
                        <CardTitle className="text-lg font-bold">التصميم بـ Midjourney</CardTitle>
                        <p className="text-sm text-muted-foreground">أنشئ صور احترافية باستخدام الذكاء الاصطناعي</p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                            <span className="text-xs text-muted-foreground">45 دقيقة</span>
                          </div>
                          <Button size="sm" className="group-hover:scale-105 transition-transform">
                            ابدأ التعلم
                          </Button>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                  <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <Link href="/tutorials">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-green-100 text-green-800 text-xs">مجاني</Badge>
                          <div className="text-xs text-muted-foreground">متقدم</div>
                        </div>
                        <CardTitle className="text-lg font-bold">بناء روبوت AI</CardTitle>
                        <p className="text-sm text-muted-foreground">طوّر مساعد ذكي لعملك باستخدام أحدث التقنيات</p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                            <span className="text-xs text-muted-foreground">90 دقيقة</span>
                          </div>
                          <Button size="sm" className="group-hover:scale-105 transition-transform">
                            ابدأ التعلم
                          </Button>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                </>
              )}
            </div>
          </div>
          
          {/* Supporting Resources Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Primary: Learning Resources */}
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-green-500/20 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-900/10">
              <Link href="/tutorials">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <BookOpen className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold">تعلّم الاستخدام</CardTitle>
                        <p className="text-sm text-muted-foreground">دروس عملية ونصائح احترافية</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-green-600 transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border">
                      <div className="text-lg font-bold text-green-600">{featuredCourses.length}+</div>
                      <div className="text-xs text-muted-foreground">دورات مجانية</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border">
                      <div className="text-lg font-bold text-blue-600">3 مستويات</div>
                      <div className="text-xs text-muted-foreground">مبتدئ لمتقدم</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700">للمبتدئين</Badge>
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">متوسط</Badge>
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">متقدم</Badge>
                  </div>
                </CardContent>
              </Link>
            </Card>
            
            {/* Secondary: Tools Directory */}
            <div className="space-y-4">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <Link href="/tools">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Brain className="h-6 w-6 text-blue-600" />
                        <CardTitle className="text-lg">استكشف مكتبتنا</CardTitle>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-2">+{data.length} أداة ذكاء اصطناعي مشروحة</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">ChatGPT</Badge>
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">Midjourney</Badge>
                    </div>
                  </CardContent>
                </Link>
              </Card>
              
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <Link href="/news">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Newspaper className="h-6 w-6 text-purple-600" />
                        <CardTitle className="text-lg">آخر الأخبار</CardTitle>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-600 transition-colors" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 bg-red-500 rounded-full"></span>
                        <span className="truncate">GPT-5 قريباً من OpenAI</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 bg-orange-500 rounded-full"></span>
                        <span className="truncate">Claude يدعم العربية الآن</span>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            </div>
          </div>
          
          {/* Popular Tools Section - Supporting Role */}
          <div id="featured" className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Brain className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold">استكشف مكتبتنا: أدوات مشروحة</h2>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/tools?sort=popular">
                  عرض الكل
                  <ArrowRight className="h-4 w-4 mr-2" />
                </Link>
              </Button>
            </div>
            
            {/* Time-Based Usage Stats */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-3 mb-6 border border-green-200 dark:border-green-800">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">{timeStats.activeUsers}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-3 w-3 text-yellow-500" />
                  <span>{timeStats.todayTrials}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-3 w-3 text-orange-500" />
                  <span>{timeStats.totalUsers}</span>
                </div>
              </div>
            </div>

            {/* Activity Ticker */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2 mb-6 overflow-hidden">
              <div className="animate-pulse text-center">
                <span className="text-sm text-yellow-700 dark:text-yellow-300">
                  {activityMessages[Math.floor(Date.now() / 10000) % activityMessages.length]}
                </span>
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#1E1E1E] rounded-[2rem] p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]">
              <ErrorBoundaryWrapper>
                {popularTools.length > 0 ? (
                  <FeaturedGrid featuredData={popularTools} />
                ) : (
                  <EmptyFeaturedGrid />
                )}
              </ErrorBoundaryWrapper>
            </div>
          </div>

          {/* Featured Sections - Compact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Tool of the Day - Compact */}
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-full">
                    <Star className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{toolOfTheDay.badge}</h3>
                    <p className="text-xs text-muted-foreground">يتغير يومياً</p>
                  </div>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs ml-auto">
                    اليوم
                  </Badge>
                </div>
                
                <div className="text-center">
                  <h4 className="text-lg font-bold mb-1">{toolOfTheDay.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{toolOfTheDay.reason}</p>
                  <Button asChild size="sm" className="w-full">
                    <Link href={`/tools/${toolOfTheDay.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      جرّب الآن
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Trending - Compact */}
            <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-full">
                    <Sparkles className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{weeklyTrending.title}</h3>
                    <p className="text-xs text-muted-foreground">يتغير أسبوعياً</p>
                  </div>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs ml-auto">
                    هذا الأسبوع
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  {weeklyTrending.tools.slice(0, 2).map((tool, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800/50 rounded-lg p-2 border border-orange-200 dark:border-orange-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{tool.name}</h4>
                          <p className="text-xs text-muted-foreground">{tool.reason}</p>
                        </div>
                        <Button asChild size="sm" variant="ghost" className="text-xs">
                          <Link href={`/tools/${tool.name.toLowerCase().replace(/\s+/g, '-')}`}>
                            جرّب
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button asChild size="sm" variant="outline" className="w-full">
                    <Link href="/tools?trending=weekly">
                      عرض جميع الترندات
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Newsletter Section */}
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left Column: Newsletter Signup */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                      <Newspaper className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">النشرة الأسبوعية لرواد AI</h3>
                      <p className="text-sm text-muted-foreground">واكب كل جديد. كن أول من يعرف.</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    احصل على أهم 3 أخبار، أداة الأسبوع، ونصيحة عملية مباشرة في بريدك كل خميس.
                  </p>
                  
                  <NewsletterHero />
                </CardContent>
              </Card>

              {/* Right Column: Latest Articles */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-bold">أحدث المقالات</h3>
                </div>
                
                <div className="space-y-3">
                  <Card className="group hover:shadow-md transition-all duration-300 cursor-pointer">
                    <Link href="/blog">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-start gap-3">
                          <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                              دليل شامل: كيفية كتابة Prompts فعالة لـ ChatGPT
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">منذ يومين</p>
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                  
                  <Card className="group hover:shadow-md transition-all duration-300 cursor-pointer">
                    <Link href="/blog">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-start gap-3">
                          <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                              أفضل أدوات AI للمصممين: مراجعة شاملة لـ 2024
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">منذ أسبوع</p>
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                </div>
                
                <Button variant="outline" size="sm" asChild className="mt-4">
                  <Link href="/blog">
                    عرض جميع المقالات
                    <ArrowRight className="h-4 w-4 mr-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Simple Testimonials Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">لماذا يثق بنا المبتكرون العرب؟</h2>
              <p className="text-muted-foreground">شهادات حقيقية من متعلمين نجحوا في إتقان AI</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-900/10 border-green-200 dark:border-green-800">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-bold text-sm">س</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">سارة القحطاني</p>
                      <p className="text-xs text-muted-foreground">مسوقة رقمية، السعودية</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    "أخيراً محتوى عربي يشرح الذكاء الاصطناعي بطريقة عملية ومفهومة. زادت إنتاجيتي 300% بعد الدورات!"
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-700 font-bold text-sm">أ</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">أحمد المصري</p>
                      <p className="text-xs text-muted-foreground">مطور تطبيقات، مصر</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    "الشروحات واضحة جداً والأدوات مفيدة. وفرت علي ساعات من البحث والتجريب."
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-900/10 border-purple-200 dark:border-purple-800">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-700 font-bold text-sm">ف</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">فاطمة الزهراني</p>
                      <p className="text-xs text-muted-foreground">ريادة أعمال، الإمارات</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    "بفضل الدورات تمكنت من بناء روبوت خدمة عملاء لشركتي. نتائج مذهلة!"
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Separator className="my-8" />
          
          {/* All Tools Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">جميع الأدوات</h2>
              </div>
              <Badge variant="outline" className="text-base px-3 py-1">
                {data.length} أداة
              </Badge>
            </div>
            
            <ResourceCardGrid
              sortedData={data}
              filteredFeaturedData={filteredFeaturedData}
            />
          </div>
        </FadeIn>
      </AdaptiveLayout>
    </>
  )
}

export default Page