import { Metadata } from "next"
import Link from "next/link"
import { 
  ArrowRight, 
  Star, 
  Users, 
  Clock, 
  BookOpen,
  CheckCircle,
  MessageSquare,
  Zap
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Generate structured data for the landing page
function generateChatGPTArabicJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "ChatGPT بالعربي - الدليل الشامل لاستخدام ChatGPT باللغة العربية",
    description: "تعلم كيفية استخدام ChatGPT بالعربي مع أمثلة عملية ونصائح متقدمة. دليل شامل لجميع المستويات.",
    url: "https://arabie.ai/chatgpt-arabic",
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
    keywords: "ChatGPT بالعربي, ChatGPT شرح عربي, كيفية استخدام ChatGPT, ذكاء اصطناعي عربي, OpenAI عربي",
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
          name: "ChatGPT بالعربي",
          item: "https://arabie.ai/chatgpt-arabic"
        }
      ]
    },
    mainEntity: {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "ما هو ChatGPT؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "ChatGPT هو نموذج ذكاء اصطناعي متقدم من OpenAI يمكنه فهم النصوص والإجابة على الأسئلة باللغة العربية والإنجليزية."
          }
        },
        {
          "@type": "Question",
          name: "هل ChatGPT مجاني؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "نعم، ChatGPT متاح مجاناً مع إمكانية الترقية إلى ChatGPT Plus للحصول على ميزات إضافية."
          }
        },
        {
          "@type": "Question",
          name: "كيف أستخدم ChatGPT بالعربي؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "يمكنك استخدام ChatGPT بالعربي عبر كتابة أسئلتك أو طلباتك باللغة العربية مباشرة وسيفهم ويجيب بالعربية."
          }
        }
      ]
    }
  }
}

export const metadata: Metadata = {
  title: "ChatGPT بالعربي - الدليل الشامل والكامل لاستخدام ChatGPT باللغة العربية",
  description: "تعلم كيفية استخدام ChatGPT بالعربي مع أمثلة عملية ونصائح متقدمة. دليل شامل للمبتدئين والمحترفين مع روابط مباشرة ⚡",
  keywords: "ChatGPT بالعربي, ChatGPT شرح عربي, كيفية استخدام ChatGPT, ذكاء اصطناعي عربي, OpenAI عربي, ChatGPT مجاني, تعلم ChatGPT",
  openGraph: {
    title: "ChatGPT بالعربي - الدليل الشامل",
    description: "تعلم كيفية استخدام ChatGPT بالعربي مع أمثلة عملية ونصائح متقدمة",
    type: "website",
    url: "https://arabie.ai/chatgpt-arabic",
    siteName: "العربي للذكاء الاصطناعي",
    locale: "ar_SA",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChatGPT بالعربي - الدليل الشامل",
    description: "تعلم كيفية استخدام ChatGPT بالعربي مع أمثلة عملية ونصائح متقدمة",
  },
  alternates: {
    canonical: "https://arabie.ai/chatgpt-arabic",
  }
}

// For static generation, we'll use a hardcoded list of related tools
const chatGPTRelatedTools = [
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
  }
]

export default function ChatGPTArabicPage() {
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateChatGPTArabicJsonLd()),
        }}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ChatGPT بالعربي
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            الدليل الشامل لاستخدام ChatGPT باللغة العربية مع أمثلة عملية ونصائح متقدمة للمبتدئين والمحترفين
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="https://chat.openai.com" target="_blank" rel="noopener noreferrer">
                <MessageSquare className="ml-2 h-5 w-5" />
                ابدأ ChatGPT الآن
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
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle>سهل الاستخدام</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                واجهة بسيطة وسهلة، اكتب سؤالك بالعربي واحصل على إجابة فورية
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle>دعم كامل للعربية</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                يفهم اللهجات العربية المختلفة ويجيب بطلاقة تامة
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Clock className="h-8 w-8 text-purple-500 mb-2" />
              <CardTitle>متاح 24/7</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                يعمل على مدار الساعة بدون انقطاع، جاهز للإجابة على أسئلتك
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">الأسئلة الشائعة عن ChatGPT</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                ما هو ChatGPT؟
              </h3>
              <p className="text-muted-foreground">
                ChatGPT هو نموذج ذكاء اصطناعي متقدم من OpenAI يمكنه فهم النصوص والإجابة على الأسئلة باللغة العربية والإنجليزية. يمكنه المساعدة في الكتابة، الترجمة، البرمجة، والعديد من المهام الأخرى.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                هل ChatGPT مجاني؟
              </h3>
              <p className="text-muted-foreground">
                نعم، ChatGPT متاح مجاناً مع إمكانية الترقية إلى ChatGPT Plus مقابل 20 دولار شهرياً للحصول على ميزات إضافية مثل الوصول المتقدم وسرعة أكبر.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                كيف أستخدم ChatGPT بالعربي؟
              </h3>
              <p className="text-muted-foreground">
                يمكنك استخدام ChatGPT بالعربي عبر كتابة أسئلتك أو طلباتك باللغة العربية مباشرة وسيفهم ويجيب بالعربية. لا حاجة لإعدادات خاصة.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Related Tools */}
        {chatGPTRelatedTools.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">أدوات مشابهة لـ ChatGPT</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chatGPTRelatedTools.map((tool) => (
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
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">ابدأ رحلتك مع ChatGPT الآن</h2>
              <p className="text-muted-foreground mb-6">
                اكتشف قوة الذكاء الاصطناعي واستخدمه لتطوير مهاراتك وإنجاز مهامك بكفاءة أكبر
              </p>
              <Button size="lg" asChild>
                <Link href="https://chat.openai.com" target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="ml-2 h-5 w-5" />
                  جرب ChatGPT مجاناً
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}