import { Newspaper, Clock, ExternalLink, ArrowLeft, Eye, Flame, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getNews, getFeaturedNews, getNewsFilters } from "../actions/news"
import { NavSidebar } from "@/components/nav"
import { AdaptiveLayout } from "@/components/adaptive-layout"
import { FadeIn } from "@/components/cult/fade-in"
import { ContentImage } from "@/components/content-image"
import { ErrorBoundaryWrapper } from "@/components/error-boundary"

export const dynamic = "force-dynamic"

export default async function NewsPage({
  searchParams,
}: {
  searchParams: {
    category?: string
  }
}) {
  const { category } = searchParams
  const [news, featuredNews, filters] = await Promise.all([
    getNews(category),
    getFeaturedNews(4), // Get more featured articles
    getNewsFilters()
  ])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getReadingTime = (content: string | null | undefined) => {
    if (!content) return '2 دقائق'
    const wordCount = content.split(' ').length
    const minutes = Math.ceil(wordCount / 200)
    return `${minutes} دقائق قراءة`
  }

  const getContent = (article: any) => {
    return article.content_ar || article.content || ''
  }

  const getSummary = (article: any) => {
    return article.summary_ar || article.summary || getContent(article).substring(0, 200) + '...'
  }

  const mainFeatured = featuredNews[0]
  const secondaryFeatured = featuredNews.slice(1, 4)
  const regularNews = news.filter(article => !article.is_featured)

  return (
    <>
      <NavSidebar
        categories={filters.categories}
        labels={[]}
        tags={[]}
      />
      
      <AdaptiveLayout>
        <ErrorBoundaryWrapper>
          <div className="min-h-screen bg-background">
          {/* News Header */}
          <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Newspaper className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-bold">أخبار الذكاء الاصطناعي</h1>
                  </div>
                  <Badge variant="outline" className="hidden sm:flex">
                    {news.length} مقال
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>آخر تحديث: {formatDate(new Date().toISOString())}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <FadeIn>
              {/* Hero Section - Main Featured Article */}
              {mainFeatured && (
                <section className="mb-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Badge variant="default" className="bg-red-600 hover:bg-red-700">
                          {mainFeatured.category}
                        </Badge>
                        <Badge variant="outline" className="text-red-600 border-red-600">
                          <Flame className="h-3 w-3 mr-1" />
                          عاجل
                        </Badge>
                      </div>
                      
                      <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-foreground">
                        <Link 
                          href={`/news/${mainFeatured.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {mainFeatured.title_ar}
                        </Link>
                      </h2>
                      
                      <p className="text-xl text-muted-foreground leading-relaxed">
                        {getSummary(mainFeatured)}
                      </p>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span>{formatFullDate(mainFeatured.published_at)}</span>
                        <span>{getReadingTime(getContent(mainFeatured))}</span>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {mainFeatured.view_count} مشاهدة
                        </div>
                      </div>
                    </div>
                    
                    <div className="order-first lg:order-last">
                      <Link href={`/news/${mainFeatured.id}`}>
                        <ContentImage 
                          image_url={mainFeatured.image_url}
                          content_type="news"
                          title={mainFeatured.title_ar}
                          aspectRatio="wide"
                          className="h-64 lg:h-80 hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                    </div>
                  </div>
                </section>
              )}

              {/* Secondary Featured Articles */}
              {secondaryFeatured.length > 0 && (
                <section className="mb-12">
                  <div className="flex items-center gap-3 mb-6 pb-2 border-b-2 border-primary">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold">الأكثر أهمية</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {secondaryFeatured.map((article, index) => (
                      <article key={article.id} className="group">
                        <Link href={`/news/${article.id}`}>
                          <ContentImage 
                            image_url={article.image_url}
                            content_type="news"
                            title={article.title_ar}
                            aspectRatio="wide"
                            className="h-48 mb-3 group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
                        
                        <div className="space-y-2">
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                          
                          <h4 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
                            <Link href={`/news/${article.id}`}>
                              {article.title_ar}
                            </Link>
                          </h4>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {article.summary_ar || article.summary || getContent(article).substring(0, 120) + '...'}
                          </p>
                          
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{formatDate(article.published_at)}</span>
                            <span>{getReadingTime(getContent(article))}</span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* Latest News Section */}
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6 pb-2 border-b">
                  <h3 className="text-xl font-bold">آخر الأخبار</h3>
                  <Badge variant="outline">{regularNews.length} مقال</Badge>
                </div>
                
                <div className="space-y-6">
                  {regularNews.map((article, index) => (
                    <article 
                      key={article.id} 
                      className={`group pb-6 ${index !== regularNews.length - 1 ? 'border-b border-border/50' : ''}`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-1">
                          <Link href={`/news/${article.id}`}>
                            <ContentImage 
                              image_url={article.image_url}
                              content_type="news"
                              title={article.title_ar}
                              aspectRatio="square"
                              className="h-24 md:h-20 group-hover:scale-105 transition-transform duration-300"
                            />
                          </Link>
                        </div>
                        
                        <div className="md:col-span-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={
                                article.category === 'تحديثات' ? 'default' :
                                article.category === 'تعليم' ? 'secondary' : 'outline'
                              }
                              className="text-xs"
                            >
                              {article.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(article.published_at)}
                            </span>
                          </div>
                          
                          <h4 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
                            <Link href={`/news/${article.id}`}>
                              {article.title_ar}
                            </Link>
                          </h4>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {getSummary(article)}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{getReadingTime(getContent(article))}</span>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {article.view_count}
                            </div>
                            {article.author && <span>بقلم {article.author}</span>}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* Newsletter CTA */}
              <section className="bg-muted/30 rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold mb-3">ابق على اطلاع دائم</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  احصل على آخر أخبار الذكاء الاصطناعي والتطورات التقنية مباشرة في بريدك الإلكتروني
                </p>
                <Button size="lg" className="px-8">
                  اشترك في النشرة الإخبارية
                </Button>
              </section>
            </FadeIn>
          </div>
        </div>
        </ErrorBoundaryWrapper>
      </AdaptiveLayout>
    </>
  )
}