import { Metadata } from "next"
import Link from "next/link"
import { 
  BookOpen, 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  TrendingUp, 
  User,
  Tag,
  ArrowRight,
  Star,
  Calendar
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getBlogArticles, getFeaturedBlogArticles, getBlogCategories } from "@/app/actions/blog"
import { ContentImage } from "@/components/content-image"
import { FadeIn } from "@/components/cult/fade-in"

export const metadata: Metadata = {
  title: "مدونة الذكاء الاصطناعي - دليل شامل للمبتدئين والمحترفين",
  description: "اكتشف أحدث مقالات وأدلة الذكاء الاصطناعي باللغة العربية. دروس تفصيلية، مقارنات شاملة، وقصص نجاح من خبراء المجال ⚡",
  keywords: "مدونة الذكاء الاصطناعي, دروس AI بالعربي, شروحات ChatGPT, أدلة Midjourney, مقالات تقنية عربية, تعلم الذكاء الاصطناعي",
  openGraph: {
    title: "مدونة الذكاء الاصطناعي - دليل شامل للمبتدئين والمحترفين",
    description: "اكتشف أحدث مقالات وأدلة الذكاء الاصطناعي باللغة العربية",
    type: "website",
    url: "https://arabie.ai/blog",
    siteName: "العربي للذكاء الاصطناعي",
    locale: "ar_SA",
  },
  alternates: {
    canonical: "https://arabie.ai/blog",
  }
}

// Generate structured data for blog homepage
function generateBlogJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "مدونة العربي للذكاء الاصطناعي",
    description: "مدونة شاملة للذكاء الاصطناعي باللغة العربية مع دروس تفصيلية ومقارنات شاملة",
    url: "https://arabie.ai/blog",
    inLanguage: "ar",
    author: {
      "@type": "Organization",
      name: "العربي للذكاء الاصطناعي",
      url: "https://arabie.ai"
    },
    publisher: {
      "@type": "Organization",
      name: "العربي للذكاء الاصطناعي",
      url: "https://arabie.ai"
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://arabie.ai/blog"
    }
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: {
    category?: string
    tag?: string
    page?: string
  }
}) {
  const { category, tag, page = "1" } = searchParams
  const currentPage = parseInt(page)
  const articlesPerPage = 12
  const offset = (currentPage - 1) * articlesPerPage

  const [articles, featuredArticles, categories] = await Promise.all([
    getBlogArticles(category, tag, undefined, articlesPerPage, offset),
    getFeaturedBlogArticles(4),
    getBlogCategories()
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

  const mainFeatured = featuredArticles[0]
  const secondaryFeatured = featuredArticles.slice(1, 4)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBlogJsonLd()),
        }}
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <FadeIn>
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              مدونة الذكاء الاصطناعي
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              دليل شامل لتعلم الذكاء الاصطناعي باللغة العربية - من الأساسيات إلى التطبيقات المتقدمة
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="default" className="text-sm px-4 py-2">
                <BookOpen className="ml-2 h-4 w-4" />
                +100 مقال
              </Badge>
              <Badge variant="outline" className="text-sm px-4 py-2">
                <User className="ml-2 h-4 w-4" />
                خبراء المجال
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <TrendingUp className="ml-2 h-4 w-4" />
                محتوى حصري
              </Badge>
            </div>
          </div>

          {/* Featured Article */}
          {mainFeatured && (
            <section className="mb-12">
              <Card className="overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
                        <Star className="h-3 w-3 mr-1" />
                        مقال مميز
                      </Badge>
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        {mainFeatured.category}
                      </Badge>
                      {mainFeatured.difficulty_level && (
                        <Badge className={getDifficultyColor(mainFeatured.difficulty_level)}>
                          {mainFeatured.difficulty_level}
                        </Badge>
                      )}
                    </div>
                    
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                      <Link 
                        href={`/blog/${mainFeatured.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {mainFeatured.title_ar}
                      </Link>
                    </h2>
                    
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                      {mainFeatured.excerpt_ar}
                    </p>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {mainFeatured.author_name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(mainFeatured.published_at)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {mainFeatured.estimated_reading_time} دقائق
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {mainFeatured.view_count}
                      </div>
                    </div>
                    
                    <Button size="lg" asChild>
                      <Link href={`/blog/${mainFeatured.slug}`}>
                        اقرأ المقال
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="lg:p-8">
                    <Link href={`/blog/${mainFeatured.slug}`}>
                      <ContentImage 
                        image_url={mainFeatured.featured_image_url}
                        content_type="blog"
                        title={mainFeatured.title_ar}
                        aspectRatio="wide"
                        className="h-64 lg:h-80 hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  </div>
                </div>
              </Card>
            </section>
          )}

          {/* Categories Filter */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">تصفح حسب الفئة</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!category ? "default" : "outline"}
                size="sm"
                asChild
              >
                <Link href="/blog">جميع المقالات</Link>
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={category === cat.slug ? "default" : "outline"}
                  size="sm"
                  asChild
                >
                  <Link href={`/blog?category=${cat.slug}`}>
                    {cat.name_ar}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {cat.article_count}
                    </Badge>
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Secondary Featured Articles */}
          {secondaryFeatured.length > 0 && (
            <section className="mb-12">
              <h3 className="text-2xl font-bold mb-6">مقالات مميزة</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {secondaryFeatured.map((article) => (
                  <Card key={article.id} className="group hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <Link href={`/blog/${article.slug}`}>
                        <ContentImage 
                          image_url={article.featured_image_url}
                          content_type="blog"
                          title={article.title_ar}
                          aspectRatio="wide"
                          className="h-48 mb-3 group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {article.category}
                        </Badge>
                        {article.difficulty_level && (
                          <Badge className={`text-xs ${getDifficultyColor(article.difficulty_level)}`}>
                            {article.difficulty_level}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
                        <Link href={`/blog/${article.slug}`}>
                          {article.title_ar}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {article.excerpt_ar}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span>{formatDate(article.published_at)}</span>
                          <span>{article.estimated_reading_time} دقائق</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {article.view_count}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Latest Articles */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-6">أحدث المقالات</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Card key={article.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <Link href={`/blog/${article.slug}`}>
                      <ContentImage 
                        image_url={article.featured_image_url}
                        content_type="blog"
                        title={article.title_ar}
                        aspectRatio="wide"
                        className="h-48 mb-3 group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {article.category}
                      </Badge>
                      {article.difficulty_level && (
                        <Badge className={`text-xs ${getDifficultyColor(article.difficulty_level)}`}>
                          {article.difficulty_level}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
                      <Link href={`/blog/${article.slug}`}>
                        {article.title_ar}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {article.excerpt_ar}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-3">
                        <span>{formatDate(article.published_at)}</span>
                        <span>{article.estimated_reading_time} دقائق</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.view_count}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="text-xs text-muted-foreground">{article.author_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          <span className="text-xs">{article.like_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Share2 className="h-3 w-3" />
                          <span className="text-xs">{article.share_count}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Newsletter CTA */}
          <section className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-8 text-center border border-blue-200 dark:border-blue-800">
            <h3 className="text-2xl font-bold mb-3">📧 انضم لأكثر من 10,000 مطور ومختص</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              احصل على أحدث أدوات الذكاء الاصطناعي، دروس حصرية، ونصائح عملية كل أسبوع
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <Button size="lg" className="px-8">
                اشترك مجاناً
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/submit">
                  اقترح أداة
                </Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              لا رسائل مزعجة • إلغاء الاشتراك في أي وقت
            </p>
          </section>
        </FadeIn>
      </div>
    </>
  )
}