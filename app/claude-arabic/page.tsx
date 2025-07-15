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
  Shield,
  Brain,
  FileText
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Generate structured data for Claude AI Arabic page
function generateClaudeArabicJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Claude AI بالعربي - الدليل الشامل لاستخدام Claude من Anthropic",
    description: "تعلم كيفية استخدام Claude AI باللغة العربية. مساعد ذكي أكثر أماناً ودقة من Anthropic مع شرح مفصل بالعربية.",
    url: "https://arabie.ai/claude-arabic",
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
    keywords: "Claude AI بالعربي, Claude شرح عربي, Anthropic Claude, مساعد ذكي آمن, بديل ChatGPT",
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
          name: "Claude AI بالعربي",
          item: "https://arabie.ai/claude-arabic"
        }
      ]
    },
    mainEntity: {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "ما هو Claude AI؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Claude AI هو مساعد ذكي متقدم من شركة Anthropic، مصمم ليكون أكثر أماناً ودقة من البدائل الأخرى، مع دعم ممتاز للغة العربية."
          }
        },
        {
          "@type": "Question",
          name: "ما الفرق بين Claude و ChatGPT؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Claude يتميز بالأمان والدقة العالية، تدريب على مبادئ أخلاقية صارمة، ودعم أفضل للمحادثات الطويلة والتحليل المعمق."
          }
        },
        {
          "@type": "Question",
          name: "هل Claude مجاني؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "نعم، Claude متاح مجاناً مع إمكانية الترقية إلى Claude Pro للحصول على ميزات إضافية واستخدام أوسع."
          }
        }
      ]
    }
  }
}

export const metadata: Metadata = {
  title: "Claude AI بالعربي - الدليل الشامل لاستخدام Claude من Anthropic",
  description: "تعلم كيفية استخدام Claude AI باللغة العربية. مساعد ذكي أكثر أماناً ودقة من Anthropic مع شرح مفصل بالعربية وأمثلة عملية ⚡",
  keywords: "Claude AI بالعربي, Claude شرح عربي, Anthropic Claude, مساعد ذكي آمن, بديل ChatGPT, Claude مجاني, AI assistant Arabic",
  openGraph: {
    title: "Claude AI بالعربي - الدليل الشامل",
    description: "تعلم كيفية استخدام Claude AI باللغة العربية. مساعد ذكي أكثر أماناً ودقة من Anthropic",
    type: "website",
    url: "https://arabie.ai/claude-arabic",
    siteName: "العربي للذكاء الاصطناعي",
    locale: "ar_SA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude AI بالعربي - الدليل الشامل",
    description: "تعلم كيفية استخدام Claude AI باللغة العربية. مساعد ذكي أكثر أماناً ودقة من Anthropic",
  },
  alternates: {
    canonical: "https://arabie.ai/claude-arabic",
  }
}

// For static generation, we'll use a hardcoded list of related tools
const claudeRelatedTools = [
  {
    id: 1,
    arabic_name: "Claude",
    codename: "Claude",
    description: "مساعد ذكي أكثر أماناً من Anthropic",
    arabic_description: "مساعد ذكي أكثر أماناً من Anthropic",
    logo_src: "/logos/claude.png",
    is_free: true
  },
  {
    id: 2,
    arabic_name: "ChatGPT",
    codename: "ChatGPT",
    description: "مساعد ذكي للمحادثة والكتابة",
    arabic_description: "مساعد ذكي للمحادثة والكتابة",
    logo_src: "/logos/chatgpt.png",
    is_free: true
  }
]

const claudeFeatures = [
  {
    title: "أمان وموثوقية",
    icon: Shield,
    description: "مدرب على مبادئ أخلاقية صارمة لضمان الأمان والموثوقية",
    color: "text-green-500"
  },
  {
    title: "دقة عالية",
    icon: Brain,
    description: "إجابات أكثر دقة وأقل عرضة للأخطاء والمعلومات المضللة",
    color: "text-blue-500"
  },
  {
    title: "محادثات طويلة",
    icon: MessageSquare,
    description: "يمكنه التعامل مع المحادثات الطويلة والمعقدة بفعالية",
    color: "text-purple-500"
  },
  {
    title: "تحليل معمق",
    icon: FileText,
    description: "قدرة ممتازة على التحليل والتفكير النقدي",
    color: "text-orange-500"
  },
  {
    title: "دعم العربية",
    icon: Users,
    description: "يفهم اللغة العربية بطلاقة ويجيب بدقة عالية",
    color: "text-red-500"
  },
  {
    title: "سهولة الاستخدام",
    icon: Zap,
    description: "واجهة بسيطة وسهلة الاستخدام للمبتدئين والمحترفين",
    color: "text-indigo-500"
  }
]

export default function ClaudeArabicPage() {
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateClaudeArabicJsonLd()),
        }}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Claude AI بالعربي
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            الدليل الشامل لاستخدام Claude AI من Anthropic باللغة العربية. مساعد ذكي أكثر أماناً ودقة للمستخدمين العرب
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="success" className="text-sm px-4 py-2">
              <CheckCircle className="ml-2 h-4 w-4" />
              مجاني ومتاح
            </Badge>
            <Badge variant="default" className="text-sm px-4 py-2">
              <Shield className="ml-2 h-4 w-4" />
              آمن وموثوق
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">
              <Star className="ml-2 h-4 w-4" />
              دقة عالية
            </Badge>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="https://claude.ai" target="_blank" rel="noopener noreferrer">
                <MessageSquare className="ml-2 h-5 w-5" />
                جرب Claude الآن
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

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">مميزات Claude AI</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {claudeFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className={`h-8 w-8 ${feature.color} mb-2`} />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Comparison Section */}
        <Card className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl text-center">لماذا Claude AI؟</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                  الأمان والموثوقية
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Claude مدرب على مبادئ أخلاقية صارمة من Anthropic، مما يجعله أكثر أماناً وأقل عرضة لإنتاج محتوى ضار أو مضلل.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                  دقة المعلومات
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  يتميز بدقة عالية في الإجابات وأقل عرضة للهلوسة أو المعلومات الخاطئة مقارنة بالبدائل الأخرى.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">الأسئلة الشائعة عن Claude AI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                ما هو Claude AI؟
              </h3>
              <p className="text-muted-foreground">
                Claude AI هو مساعد ذكي متقدم من شركة Anthropic، مصمم ليكون أكثر أماناً ودقة من البدائل الأخرى. يتميز بالتدريب على مبادئ أخلاقية صارمة ودعم ممتاز للغة العربية.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                ما الفرق بين Claude و ChatGPT؟
              </h3>
              <p className="text-muted-foreground">
                Claude يتميز بالأمان والدقة العالية، تدريب على مبادئ أخلاقية صارمة، ودعم أفضل للمحادثات الطويلة والتحليل المعمق. كما أنه أقل عرضة للمعلومات المضللة.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                هل Claude مجاني؟
              </h3>
              <p className="text-muted-foreground">
                نعم، Claude متاح مجاناً مع إمكانية الترقية إلى Claude Pro مقابل 20 دولار شهرياً للحصول على ميزات إضافية واستخدام أوسع.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Related Tools */}
        {claudeRelatedTools.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">أدوات مشابهة لـ Claude</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {claudeRelatedTools.map((tool) => (
                <Card key={tool.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      {tool.logo_src && (
                        <img 
                          src={tool.logo_src} 
                          alt={tool.arabic_name || tool.codename}
                          className="w-8 h-8 rounded"
                        />
                      )}
                      <div>
                        <CardTitle className="text-lg">{tool.arabic_name || tool.codename}</CardTitle>
                        {tool.is_free && (
                          <Badge variant="success" className="text-xs">مجاني</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
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
        )}

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">ابدأ مع Claude الآن</h2>
              <p className="text-muted-foreground mb-6">
                اكتشف مساعد ذكي أكثر أماناً ودقة لجميع احتياجاتك من الكتابة والتحليل والبحث
              </p>
              <Button size="lg" asChild>
                <Link href="https://claude.ai" target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="ml-2 h-5 w-5" />
                  جرب Claude مجاناً
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}