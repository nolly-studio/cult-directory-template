import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Clock, Eye, Share2, BookOpen, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getTutorialBySlug, incrementTutorialViews, getFeaturedTutorials } from "../../actions/tutorials"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { TableOfContents } from "@/components/table-of-contents"
import { ReadingProgress } from "@/components/reading-progress"

export const dynamic = "force-dynamic"

// Generate structured data for tutorial
function generateTutorialJsonLd(tutorial: any) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: tutorial.title_ar,
    description: tutorial.content ? tutorial.content.substring(0, 200) : '',
    url: `https://arabie.ai/tutorials/${tutorial.id}`,
    inLanguage: "ar",
    author: {
      "@type": "Organization",
      name: "العربي للذكاء الاصطناعي"
    },
    publisher: {
      "@type": "Organization",
      name: "العربي للذكاء الاصطناعي",
      logo: {
        "@type": "ImageObject",
        url: "https://arabie.ai/logo.png"
      }
    },
    datePublished: tutorial.created_at,
    dateModified: tutorial.updated_at || tutorial.created_at,
    educationalLevel: tutorial.difficulty || 'مبتدئ',
    learningResourceType: "Tutorial",
    about: {
      "@type": "Thing",
      name: "الذكاء الاصطناعي"
    },
    teaches: tutorial.category,
    timeRequired: `PT${Math.ceil((tutorial.content?.split(' ').length || 0) / 180)}M`,
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/ReadAction",
      userInteractionCount: tutorial.view_count || 0
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
          name: "الدروس",
          item: "https://arabie.ai/tutorials"
        },
        {
          "@type": "ListItem",
          position: 3,
          name: tutorial.title_ar,
          item: `https://arabie.ai/tutorials/${tutorial.id}`
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
  const tutorial = await getTutorialBySlug(params.id)
  
  if (!tutorial) {
    return {
      title: "الدرس غير موجود - العربي للذكاء الاصطناعي"
    }
  }

  const content = tutorial.content || ''
  const excerpt = content.substring(0, 150).replace(/[#*`]/g, '') + '...'
  
  return {
    title: `${tutorial.title_ar} - دروس العربي للذكاء الاصطناعي`,
    description: excerpt || `تعلم ${tutorial.title_ar} - درس تعليمي شامل باللغة العربية`,
    keywords: `${tutorial.category}, ${tutorial.difficulty}, ذكاء اصطناعي, تعلم, دروس عربية, تعليم AI, شروحات بالعربي`,
    openGraph: {
      title: tutorial.title_ar,
      description: excerpt,
      type: 'article',
      publishedTime: tutorial.created_at || undefined,
      modifiedTime: tutorial.updated_at || undefined,
      authors: ['العربي للذكاء الاصطناعي'],
      section: tutorial.category,
      url: `https://arabie.ai/tutorials/${tutorial.id}`,
      siteName: 'العربي للذكاء الاصطناعي',
      locale: 'ar_SA',
    },
    twitter: {
      card: 'summary_large_image',
      title: tutorial.title_ar,
      description: excerpt,
    },
    alternates: {
      canonical: `https://arabie.ai/tutorials/${tutorial.id}`,
    }
  }
}

interface TutorialPageProps {
  params: {
    id: string
  }
}

// Helper functions
const getDurationFromContent = (content: string | null | undefined) => {
  if (!content) return '1 دقيقة'
  // Better Arabic word counting - handle both Arabic and English content
  const arabicWords = content.match(/[\u0600-\u06FF]+/g) || []
  const englishWords = content.match(/[a-zA-Z]+/g) || []
  const totalWords = arabicWords.length + englishWords.length
  // Arabic reading speed is typically 180-200 wpm
  const minutes = Math.ceil(totalWords / 180)
  return `${Math.max(1, minutes)} دقيقة`
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getContent = (tutorial: any) => {
  return tutorial.content_ar || tutorial.content || ''
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  const tutorial = await getTutorialBySlug(params.id)
  
  if (!tutorial) {
    notFound()
  }

  // Increment view count (fire and forget)
  incrementTutorialViews(tutorial.id).catch(console.error)

  // Get featured tutorials for sidebar
  const featuredTutorials = await getFeaturedTutorials()
  
  const tutorialContent = getContent(tutorial)

  return <div>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateTutorialJsonLd(tutorial)),
      }}
    />
    <div className="min-h-screen bg-background">
        <ReadingProgress />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="text-right">
            <Link href="/tutorials" className="flex items-center gap-2 hover:bg-accent transition-all duration-300">
              <ArrowLeft className="h-4 w-4" />
              العودة للدروس
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 min-w-0">
            <article className="space-y-8">
              {/* Header */}
              <header className="text-right">
                <div className="flex items-center justify-start gap-3 mb-6">
                  <Badge 
                    variant={
                      tutorial.difficulty === 'مبتدئ' ? 'default' : 
                      tutorial.difficulty === 'متوسط' ? 'secondary' : 'destructive'
                    }
                    className="transition-all duration-300 hover:scale-105 px-3 py-1"
                  >
                    {tutorial.difficulty || 'مبتدئ'}
                  </Badge>
                  <Badge variant="outline" className="transition-all duration-300 hover:scale-105 border-primary/30 text-primary/80 px-3 py-1">
                    {tutorial.category}
                  </Badge>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6 text-foreground text-right">
                  {tutorial.title_ar}
                </h1>
                
                {tutorial.title_en && (
                  <p className="text-xl text-muted-foreground mb-8 leading-relaxed text-right font-medium">
                    {tutorial.title_en}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-start gap-6 text-sm text-muted-foreground bg-muted/30 rounded-lg p-4 border">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary/60" />
                    <span className="font-medium">{getDurationFromContent(tutorialContent)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-primary/60" />
                    <span className="font-medium">{(tutorial.view_count || 0) + 1} مشاهدة</span>
                  </div>
                  {tutorial.created_at && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary/60" />
                      <span className="font-medium">نُشر في {formatDate(tutorial.created_at)}</span>
                    </div>
                  )}
                </div>
              </header>

              <Separator />

              {/* Content */}
              <MarkdownRenderer content={tutorialContent} />

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t">
                <Card className="transition-all duration-300 hover:shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">شارك هذا الدرس</h3>
                        <p className="text-muted-foreground">ساعد الآخرين في التعلم</p>
                      </div>
                      <Button variant="outline" className="flex items-center gap-2 transition-all duration-300 hover:scale-105">
                        <Share2 className="h-4 w-4" />
                        شارك
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto space-y-6 pb-8">
              {/* Table of Contents */}
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardContent className="pt-6">
                  <TableOfContents content={tutorialContent} />
                </CardContent>
              </Card>
              
              {/* Featured Tutorials */}
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    دروس مميزة
                  </CardTitle>
                  <CardDescription>
                    دروس أخرى قد تهمك
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {featuredTutorials
                    .filter(t => t.id !== tutorial.id)
                    .slice(0, 3)
                    .map((featuredTutorial) => (
                    <Link 
                      key={featuredTutorial.id} 
                      href={`/tutorials/${featuredTutorial.id}`}
                      className="block group"
                    >
                      <div className="space-y-2 p-3 rounded-lg transition-all duration-300 hover:bg-accent">
                        <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                          {featuredTutorial.title_ar}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {featuredTutorial.difficulty || 'مبتدئ'}
                          </Badge>
                          <span>•</span>
                          <span>{featuredTutorial.view_count || 0} مشاهدة</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Learning Path */}
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle>مسار التعلم المقترح</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-all duration-300">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>أساسيات الذكاء الاصطناعي</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-all duration-300">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>ChatGPT للمبتدئين</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-all duration-300">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>هندسة الطلبات المتقدمة</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-all duration-300">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>أدوات التصميم بالذكاء الاصطناعي</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Call to Action */}
              <Card className="bg-primary/5 border-primary/20 transition-all duration-300 hover:shadow-md hover:border-primary/30">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">هل استفدت من هذا الدرس؟</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    شاركنا اقتراحاً لدرس جديد أو أداة ذكية
                  </p>
                  <Button className="w-full transition-all duration-300 hover:scale-105" asChild>
                    <Link href="/submit">
                      اقترح محتوى جديد
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
} 