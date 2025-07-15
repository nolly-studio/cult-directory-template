import { Metadata } from "next"
import Link from "next/link"
import { 
  ArrowRight, 
  Star, 
  Users, 
  Zap, 
  BookOpen,
  CheckCircle,
  MessageSquare,
  Image,
  Code,
  Video,
  Mic,
  FileText
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Generate structured data for AI tools page
function generateAIToolsArabicJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "أفضل أدوات الذكاء الاصطناعي للعرب - قائمة شاملة 2024",
    description: "اكتشف أفضل أدوات الذكاء الاصطناعي المجانية والمدفوعة مع شرح مفصل باللغة العربية. ChatGPT، Midjourney، وأكثر من 100 أداة.",
    url: "https://arabie.ai/ai-tools-arabic",
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
    keywords: "أدوات الذكاء الاصطناعي, AI tools Arabic, ذكاء اصطناعي مجاني, ChatGPT عربي, Midjourney عربي, أدوات AI للعرب",
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
          name: "أدوات الذكاء الاصطناعي",
          item: "https://arabie.ai/ai-tools-arabic"
        }
      ]
    },
    mainEntity: {
      "@type": "ItemList",
      name: "أفضل أدوات الذكاء الاصطناعي",
      description: "قائمة شاملة بأفضل أدوات الذكاء الاصطناعي المتاحة باللغة العربية",
      numberOfItems: 8
    }
  }
}

export const metadata: Metadata = {
  title: "أفضل أدوات الذكاء الاصطناعي للعرب - قائمة شاملة ومحدثة 2024",
  description: "اكتشف أفضل أدوات الذكاء الاصطناعي المجانية والمدفوعة مع شرح مفصل باللغة العربية. ChatGPT، Midjourney، Claude وأكثر من 100 أداة AI مجاناً ⚡",
  keywords: "أدوات الذكاء الاصطناعي, AI tools Arabic, ذكاء اصطناعي مجاني, ChatGPT عربي, Midjourney عربي, أدوات AI للعرب, تعلم الذكاء الاصطناعي",
  openGraph: {
    title: "أفضل أدوات الذكاء الاصطناعي للعرب - قائمة شاملة 2024",
    description: "اكتشف أفضل أدوات الذكاء الاصطناعي المجانية والمدفوعة مع شرح مفصل باللغة العربية",
    type: "website",
    url: "https://arabie.ai/ai-tools-arabic",
    siteName: "العربي للذكاء الاصطناعي",
    locale: "ar_SA",
  },
  twitter: {
    card: "summary_large_image",
    title: "أفضل أدوات الذكاء الاصطناعي للعرب",
    description: "اكتشف أفضل أدوات الذكاء الاصطناعي المجانية والمدفوعة مع شرح مفصل باللغة العربية",
  },
  alternates: {
    canonical: "https://arabie.ai/ai-tools-arabic",
  }
}

// For static generation, we'll use a hardcoded list of popular tools
const topAITools = [
  {
    id: 1,
    arabic_name: "ChatGPT",
    codename: "ChatGPT",
    description: "مساعد ذكي للمحادثة والكتابة",
    arabic_description: "مساعد ذكي للمحادثة والكتابة",
    logo_src: "/logos/chatgpt.png",
    is_free: true
  },
  {
    id: 2,
    arabic_name: "Claude",
    codename: "Claude",
    description: "مساعد ذكي أكثر أماناً من Anthropic",
    arabic_description: "مساعد ذكي أكثر أماناً من Anthropic",
    logo_src: "/logos/claude.png",
    is_free: true
  },
  {
    id: 3,
    arabic_name: "Midjourney",
    codename: "Midjourney",
    description: "أداة إنشاء الصور بالذكاء الاصطناعي",
    arabic_description: "أداة إنشاء الصور بالذكاء الاصطناعي",
    logo_src: "/logos/midjourney.png",
    is_free: false
  }
]

const toolCategories = [
  {
    title: "أدوات النصوص والكتابة",
    icon: FileText,
    description: "ChatGPT، Claude، Jasper AI وغيرها",
    color: "text-blue-500"
  },
  {
    title: "أدوات الصور والتصميم",
    icon: Image,
    description: "Midjourney، DALL-E، Stable Diffusion",
    color: "text-purple-500"
  },
  {
    title: "أدوات الفيديو",
    icon: Video,
    description: "Runway، Pika Labs، Sora",
    color: "text-red-500"
  },
  {
    title: "أدوات البرمجة",
    icon: Code,
    description: "GitHub Copilot، Cursor، Replit",
    color: "text-green-500"
  },
  {
    title: "أدوات الصوت",
    icon: Mic,
    description: "ElevenLabs، Whisper، Murf",
    color: "text-orange-500"
  },
  {
    title: "أدوات التعليم",
    icon: BookOpen,
    description: "Khan Academy، Coursera، EdX",
    color: "text-indigo-500"
  }
]

export default function AIToolsArabicPage() {
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateAIToolsArabicJsonLd()),
        }}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            أفضل أدوات الذكاء الاصطناعي
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            اكتشف أفضل أدوات الذكاء الاصطناعي المجانية والمدفوعة مع شرح مفصل باللغة العربية. 
            أكثر من 100 أداة AI للمبتدئين والمحترفين العرب
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="success" className="text-sm px-4 py-2">
              <CheckCircle className="ml-2 h-4 w-4" />
              أدوات مجانية
            </Badge>
            <Badge variant="default" className="text-sm px-4 py-2">
              <Star className="ml-2 h-4 w-4" />
              شرح باللغة العربية
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">
              <Users className="ml-2 h-4 w-4" />
              للمبتدئين والمحترفين
            </Badge>
          </div>
          <Button size="lg" asChild>
            <Link href="/products">
              <Zap className="ml-2 h-5 w-5" />
              تصفح جميع الأدوات
            </Link>
          </Button>
        </div>

        {/* Categories Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">فئات أدوات الذكاء الاصطناعي</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <category.icon className={`h-8 w-8 ${category.color} mb-2`} />
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Tools */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">أدوات الذكاء الاصطناعي الأكثر شعبية</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topAITools.map((tool, index) => (
              <Card key={tool.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    {tool.logo_src && (
                      <img 
                        src={tool.logo_src} 
                        alt={tool.arabic_name || tool.codename}
                        className="w-10 h-10 rounded"
                      />
                    )}
                    <div className="flex-1">
                      <CardTitle className="text-lg">{tool.arabic_name || tool.codename}</CardTitle>
                      <div className="flex gap-2 mt-1">
                        {tool.is_free && (
                          <Badge variant="success" className="text-xs">مجاني</Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {tool.arabic_description || tool.description}
                  </p>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={`/products/${tool.id}`}>
                      عرض التفاصيل
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Choose Section */}
        <Card className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">لماذا تختار العربي للذكاء الاصطناعي؟</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">شرح مفصل بالعربية</h3>
                <p className="text-sm text-muted-foreground">
                  جميع الأدوات مشروحة بالتفصيل باللغة العربية مع أمثلة عملية
                </p>
              </div>
              <div className="text-center">
                <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">مجتمع عربي نشط</h3>
                <p className="text-sm text-muted-foreground">
                  انضم إلى مجتمع من المستخدمين العرب المهتمين بالذكاء الاصطناعي
                </p>
              </div>
              <div className="text-center">
                <Zap className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">محدث باستمرار</h3>
                <p className="text-sm text-muted-foreground">
                  نضيف أدوات جديدة ونحدث المحتوى باستمرار لنواكب التطورات
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">ابدأ رحلتك مع الذكاء الاصطناعي</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            اكتشف قوة الذكاء الاصطناعي واستخدمه لتطوير مهاراتك الشخصية والمهنية. 
            انضم لآلاف المستخدمين العرب الذين يستخدمون AI يومياً
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/products">
                <Zap className="ml-2 h-5 w-5" />
                تصفح جميع الأدوات
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/tutorials">
                <BookOpen className="ml-2 h-5 w-5" />
                شاهد الدروس
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}