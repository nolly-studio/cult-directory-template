import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Clock, Eye, Share2, Calendar, User, Bookmark, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getNewsById, incrementNewsViews, getLatestNews } from "../../actions/news"
import { ContentImage } from "@/components/content-image"
import { MarkdownRenderer } from "@/components/markdown-renderer"

export const dynamic = "force-dynamic"

// Generate structured data for news article
function generateNewsArticleJsonLd(article: any) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title_ar,
    description: article.summary_ar || article.summary || (article.content_ar || '').substring(0, 200),
    image: article.image_url,
    author: {
      "@type": "Person",
      name: article.author || "العربي للذكاء الاصطناعي"
    },
    publisher: {
      "@type": "Organization",
      name: "العربي للذكاء الاصطناعي",
      logo: {
        "@type": "ImageObject",
        url: "https://arabie.ai/logo.png"
      }
    },
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://arabie.ai/news/${article.id}`
    },
    inLanguage: "ar",
    articleSection: article.category,
    keywords: `${article.category}, أخبار الذكاء الاصطناعي, AI news Arabic, تحديثات تقنية`,
    about: {
      "@type": "Thing",
      name: "الذكاء الاصطناعي"
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "الرئيسية",
          item: "https://arabie.ai"
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "الأخبار",
          item: "https://arabie.ai/news"
        },
        {
          "@type": "ListItem",
          position: 3,
          name: article.title_ar,
          item: `https://arabie.ai/news/${article.id}`
        }
      ]
    }
  }
}

export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  const article = await getNewsById(params.id)
  
  if (!article) {
    return {
      title: "المقال غير موجود - العربي للذكاء الاصطناعي"
    }
  }

  const description = article.summary_ar || article.summary || 
    (article.content_ar || article.content_en || '').substring(0, 150).replace(/[#*`]/g, '') + '...'
  
  return {
    title: `${article.title_ar} - أخبار العربي للذكاء الاصطناعي`,
    description: description || `اقرأ ${article.title_ar} - آخر الأخبار والتحديثات في عالم الذكاء الاصطناعي`,
    keywords: `${article.category}, أخبار الذكاء الاصطناعي, AI news Arabic, تحديثات, أخبار تقنية عربية, تطورات AI`,
    openGraph: {
      title: article.title_ar,
      description: description,
      type: 'article',
      publishedTime: article.published_at,
      modifiedTime: article.updated_at,
      authors: article.author ? [article.author] : ['العربي للذكاء الاصطناعي'],
      section: article.category,
      images: article.image_url ? [article.image_url] : undefined,
      url: `https://arabie.ai/news/${article.id}`,
      siteName: 'العربي للذكاء الاصطناعي',
      locale: 'ar_SA',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title_ar,
      description: description,
      images: article.image_url ? [article.image_url] : undefined,
    },
    alternates: {
      canonical: `https://arabie.ai/news/${article.id}`,
    }
  }
}

interface NewsPageProps {
  params: {
    id: string
  }
}

// Helper functions
const getReadingTime = (content: string | null | undefined) => {
  if (!content) return '2 دقائق'
  const wordCount = content.split(' ').length
  const minutes = Math.ceil(wordCount / 200)
  return `${minutes} دقائق قراءة`
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatRelativeDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-SA', {
    month: 'long',
    day: 'numeric'
  })
}

const getContent = (article: any) => {
  return article.content_ar || article.content_en || ''
}

export default async function NewsPage({ params }: NewsPageProps) {
  const article = await getNewsById(params.id)
  
  if (!article) {
    notFound()
  }

  // Increment view count (fire and forget)
  incrementNewsViews(article.id).catch(console.error)

  // Get latest news for sidebar
  const latestNews = await getLatestNews(5)
  
  const articleContent = getContent(article)

  return <div>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateNewsArticleJsonLd(article)),
      }}
    />
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 max-w-7xl">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild className="text-right">
              <Link href="/news" className="flex items-center gap-2 hover:bg-accent transition-all duration-300">
                <ArrowLeft className="h-4 w-4" />
                العودة للأخبار
              </Link>
            </Button>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 min-w-0">
            <article className="space-y-8">
              {/* Article Header */}
              <header className="space-y-6">
                {/* Category and Meta */}
                <div className="flex items-center gap-3">
                  <Badge variant="default" className="bg-red-600 hover:bg-red-700">
                    {article.category}
                  </Badge>
                  {article.is_featured && (
                    <Badge variant="outline" className="text-red-600 border-red-600">
                      مميز
                    </Badge>
                  )}
                </div>
                
                {/* Title */}
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-foreground">
                    {article.title_ar}
                  </h1>
                  
                  {article.title_en && (
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      {article.title_en}
                    </p>
                  )}
                </div>

                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground py-4 border-t border-b">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(article.published_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{getReadingTime(articleContent)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{(article.view_count || 0) + 1} مشاهدة</span>
                  </div>
                  {article.author && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>بقلم {article.author}</span>
                    </div>
                  )}
                </div>

                {/* Summary */}
                {(article.summary_ar || article.summary) && (
                  <div className="bg-muted/30 p-6 rounded-lg border-l-4 border-primary">
                    <p className="text-lg leading-relaxed text-foreground font-medium">
                      {article.summary_ar || article.summary}
                    </p>
                  </div>
                )}
              </header>

              {/* Article Image */}
              <div className="my-8">
                <ContentImage 
                  image_url={article.image_url}
                  content_type="news"
                  title={article.title_ar}
                  aspectRatio="wide"
                  className="h-64 md:h-96 rounded-lg"
                />
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none
                prose-headings:text-foreground prose-headings:font-bold
                prose-p:text-foreground prose-p:leading-relaxed prose-p:text-lg
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold
                prose-ul:text-foreground prose-ol:text-foreground
                prose-li:text-foreground prose-li:leading-relaxed
                prose-blockquote:text-muted-foreground prose-blockquote:border-l-primary
                prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:rounded
              ">
                <MarkdownRenderer content={articleContent} />
              </div>

              {/* Article Footer */}
              <footer className="mt-12 pt-8 border-t space-y-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {/* You can add tags here if you have them in your data model */}
                  <Badge variant="outline" className="text-xs">#{article.category}</Badge>
                  <Badge variant="outline" className="text-xs">#الذكاء_الاصطناعي</Badge>
                  <Badge variant="outline" className="text-xs">#تقنية</Badge>
                </div>

                {/* Share Section */}
                <div className="bg-muted/20 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">شارك هذا المقال</h3>
                      <p className="text-muted-foreground">ساعد الآخرين في البقاء على اطلاع</p>
                    </div>
                    <Button className="flex items-center gap-2">
                      <Share2 className="h-4 w-4" />
                      شارك
                    </Button>
                  </div>
                </div>
              </footer>
            </article>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            {/* Latest News */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">أحدث الأخبار</h3>
              </div>
              
              <div className="space-y-4">
                {latestNews.filter(news => news.id !== article.id).map((news) => (
                  <article key={news.id} className="group">
                    <Link href={`/news/${news.id}`} className="block space-y-2">
                      <ContentImage 
                        image_url={news.image_url}
                        content_type="news"
                        title={news.title_ar}
                        aspectRatio="wide"
                        className="h-20 group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-xs">
                          {news.category}
                        </Badge>
                        
                        <h4 className="text-sm font-medium leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {news.title_ar}
                        </h4>
                        
                        <p className="text-xs text-muted-foreground">
                          {formatRelativeDate(news.published_at)}
                        </p>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-primary/5 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold">اشترك في النشرة</h3>
              <p className="text-sm text-muted-foreground">
                احصل على آخر أخبار الذكاء الاصطناعي أسبوعياً
              </p>
              <Button size="sm" className="w-full">
                اشترك الآن
              </Button>
            </div>

            {/* Ad Space */}
            <div className="bg-muted/20 rounded-lg p-6 text-center space-y-2">
              <p className="text-xs text-muted-foreground">إعلان</p>
              <div className="h-40 bg-muted/50 rounded flex items-center justify-center">
                <p className="text-sm text-muted-foreground">مساحة إعلانية</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
} 