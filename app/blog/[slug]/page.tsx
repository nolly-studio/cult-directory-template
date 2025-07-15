import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { 
  ArrowRight, 
  ArrowLeft,
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  User,
  Calendar,
  BookOpen,
  Tag,
  Star,
  MessageCircle,
  TrendingUp,
  CheckCircle
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  getBlogArticleBySlug, 
  getRelatedBlogArticles, 
  incrementBlogViewCount,
  getBlogArticlesBySeries
} from "@/app/actions/blog"
import { ContentImage } from "@/components/content-image"
import { FadeIn } from "@/components/cult/fade-in"

// Generate structured data for blog article
function generateBlogArticleJsonLd(article: any) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title_ar,
    alternativeHeadline: article.title_en,
    description: article.excerpt_ar || article.meta_description_ar,
    image: article.featured_image_url,
    author: {
      "@type": "Person",
      name: article.author_name,
      description: article.author_bio
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
      "@id": `https://arabie.ai/blog/${article.slug}`
    },
    inLanguage: "ar",
    keywords: article.keywords.join(", "),
    articleSection: article.category,
    articleBody: article.content_ar,
    wordCount: article.content_ar.split(' ').length,
    timeRequired: `PT${article.estimated_reading_time}M`,
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/ReadAction",
        userInteractionCount: article.view_count
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/LikeAction",
        userInteractionCount: article.like_count
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/ShareAction",
        userInteractionCount: article.share_count
      }
    ],
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
          name: "المدونة",
          item: "https://arabie.ai/blog"
        },
        {
          "@type": "ListItem",
          position: 3,
          name: article.title_ar,
          item: `https://arabie.ai/blog/${article.slug}`
        }
      ]
    }
  }
}

export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const article = await getBlogArticleBySlug(params.slug)
  
  if (!article) {
    return {
      title: "المقال غير موجود - العربي للذكاء الاصطناعي"
    }
  }

  const seoTitle = article.title_ar + " | مدونة العربي للذكاء الاصطناعي"
  const seoDescription = article.meta_description_ar || article.excerpt_ar || 
    article.content_ar.substring(0, 160) + "..."

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: article.keywords.join(", "),
    openGraph: {
      title: article.title_ar,
      description: seoDescription,
      images: article.featured_image_url ? [article.featured_image_url] : undefined,
      type: 'article',
      publishedTime: article.published_at,
      modifiedTime: article.updated_at || article.published_at,
      authors: [article.author_name],
      section: article.category,
      tags: article.tags,
      url: `https://arabie.ai/blog/${article.slug}`,
      siteName: 'العربي للذكاء الاصطناعي',
      locale: 'ar_SA',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title_ar,
      description: seoDescription,
      images: article.featured_image_url ? [article.featured_image_url] : undefined,
    },
    alternates: {
      canonical: `https://arabie.ai/blog/${article.slug}`,
    }
  }
}

export default async function BlogArticlePage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const article = await getBlogArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  // Increment view count (fire and forget)
  incrementBlogViewCount(article.id).catch(console.error)

  // Get related articles and series articles
  const [relatedArticles, seriesArticles] = await Promise.all([
    getRelatedBlogArticles(article.id, article.category, article.tags, 4),
    article.series_name ? getBlogArticlesBySeries(article.series_name) : Promise.resolve([])
  ])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDifficultyColor = (level?: string) => {
    switch (level) {
      case 'مبتدئ': return 'bg-green-100 text-green-800 border-green-300'
      case 'متوسط': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'متقدم': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const currentSeriesIndex = seriesArticles.findIndex(a => a.id === article.id)
  const prevArticle = currentSeriesIndex > 0 ? seriesArticles[currentSeriesIndex - 1] : null
  const nextArticle = currentSeriesIndex < seriesArticles.length - 1 ? seriesArticles[currentSeriesIndex + 1] : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBlogArticleJsonLd(article)),
        }}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <FadeIn>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground">الرئيسية</Link>
            <ArrowLeft className="h-4 w-4" />
            <Link href="/blog" className="hover:text-foreground">المدونة</Link>
            <ArrowLeft className="h-4 w-4" />
            <span>{article.category}</span>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="default" className="text-sm">
                {article.category}
              </Badge>
              {article.difficulty_level && (
                <Badge className={`text-sm ${getDifficultyColor(article.difficulty_level)}`}>
                  {article.difficulty_level}
                </Badge>
              )}
              {article.series_name && (
                <Badge variant="outline" className="text-sm">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {article.series_name} - الجزء {article.series_part}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {article.title_ar}
            </h1>

            {article.excerpt_ar && (
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                {article.excerpt_ar}
              </p>
            )}

            <div className="flex items-center justify-between py-4 border-t border-b">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  {article.author_avatar_url && (
                    <img 
                      src={article.author_avatar_url} 
                      alt={article.author_name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{article.author_name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(article.published_at)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {article.estimated_reading_time} دقائق
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {article.view_count}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {article.like_count}
                </div>
                <div className="flex items-center gap-1">
                  <Share2 className="h-4 w-4" />
                  {article.share_count}
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {article.featured_image_url && (
            <div className="mb-8">
              <ContentImage 
                image_url={article.featured_image_url}
                content_type="blog"
                title={article.title_ar}
                aspectRatio="wide"
                className="h-64 md:h-80 rounded-lg"
              />
            </div>
          )}

          {/* Series Navigation */}
          {article.series_name && seriesArticles.length > 1 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  سلسلة: {article.series_name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-muted-foreground">
                    الجزء {article.series_part} من {seriesArticles.length}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(article.series_part || 0) / seriesArticles.length * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {seriesArticles.map((seriesArticle, index) => (
                    <Button
                      key={seriesArticle.id}
                      variant={seriesArticle.id === article.id ? "default" : "outline"}
                      size="sm"
                      asChild
                    >
                      <Link href={`/blog/${seriesArticle.slug}`}>
                        {index + 1}
                      </Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Article Content */}
          <article className="prose prose-lg max-w-none mb-12">
            <div 
              className="leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content_ar }}
            />
          </article>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">الكلمات المفتاحية</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Article Navigation */}
          {(prevArticle || nextArticle) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {prevArticle && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <ArrowRight className="h-4 w-4" />
                      المقال السابق
                    </div>
                    <Link 
                      href={`/blog/${prevArticle.slug}`}
                      className="text-lg font-medium hover:text-blue-600 transition-colors"
                    >
                      {prevArticle.title_ar}
                    </Link>
                  </CardContent>
                </Card>
              )}
              {nextArticle && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <ArrowLeft className="h-4 w-4" />
                      المقال التالي
                    </div>
                    <Link 
                      href={`/blog/${nextArticle.slug}`}
                      className="text-lg font-medium hover:text-blue-600 transition-colors"
                    >
                      {nextArticle.title_ar}
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mb-12">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                مقالات ذات صلة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Card key={relatedArticle.id} className="group hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <Link href={`/blog/${relatedArticle.slug}`}>
                        <ContentImage 
                          image_url={relatedArticle.featured_image_url}
                          content_type="blog"
                          title={relatedArticle.title_ar}
                          aspectRatio="wide"
                          className="h-32 mb-3 group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {relatedArticle.category}
                        </Badge>
                        {relatedArticle.difficulty_level && (
                          <Badge className={`text-xs ${getDifficultyColor(relatedArticle.difficulty_level)}`}>
                            {relatedArticle.difficulty_level}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
                        <Link href={`/blog/${relatedArticle.slug}`}>
                          {relatedArticle.title_ar}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {relatedArticle.excerpt_ar}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span>{formatDate(relatedArticle.published_at)}</span>
                          <span>{relatedArticle.estimated_reading_time} دقائق</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {relatedArticle.view_count}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Newsletter CTA */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">هل استفدت من هذا المقال؟</h3>
              <p className="text-muted-foreground mb-6">
                اشترك في نشرتنا الأسبوعية للحصول على أحدث مقالات الذكاء الاصطناعي
              </p>
              <Button size="lg" className="px-8">
                اشترك الآن
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </>
  )
}