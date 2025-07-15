import { Metadata } from "next"
import Link from "next/link"
import { 
  ArrowRight, 
  Star, 
  Users, 
  Zap, 
  BookOpen,
  CheckCircle,
  Image,
  Palette,
  Download,
  Sparkles
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Generate structured data for Midjourney Arabic page
function generateMidjourneyArabicJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Midjourney بالعربي - الدليل الشامل لإنشاء الصور بالذكاء الاصطناعي",
    description: "تعلم كيفية استخدام Midjourney باللغة العربية لإنشاء صور مذهلة بالذكاء الاصطناعي. دليل شامل مع أمثلة عملية.",
    url: "https://arabie.ai/midjourney-arabic",
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
    keywords: "Midjourney بالعربي, Midjourney شرح عربي, إنشاء صور بالذكاء الاصطناعي, AI art Arabic, تصميم بالذكاء الاصطناعي",
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
          name: "Midjourney بالعربي",
          item: "https://arabie.ai/midjourney-arabic"
        }
      ]
    },
    mainEntity: {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "ما هو Midjourney؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Midjourney هو أداة ذكاء اصطناعي متقدمة لإنشاء الصور من النصوص. يمكنك وصف أي فكرة بالكلمات وسيقوم بإنشاء صورة مذهلة لها."
          }
        },
        {
          "@type": "Question",
          name: "كيف أستخدم Midjourney بالعربي؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "يمكنك استخدام Midjourney من خلال Discord، اكتب الأمر /imagine متبوعاً بوصف الصورة التي تريدها باللغة العربية أو الإنجليزية."
          }
        },
        {
          "@type": "Question",
          name: "هل Midjourney مجاني؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Midjourney يقدم تجربة مجانية محدودة، مع خطط مدفوعة تبدأ من 10 دولار شهرياً للاستخدام الأوسع."
          }
        }
      ]
    }
  }
}

export const metadata: Metadata = {
  title: "Midjourney بالعربي - الدليل الشامل لإنشاء الصور بالذكاء الاصطناعي",
  description: "تعلم كيفية استخدام Midjourney باللغة العربية لإنشاء صور مذهلة بالذكاء الاصطناعي. دليل شامل مع أمثلة عملية ونصائح متقدمة ⚡",
  keywords: "Midjourney بالعربي, Midjourney شرح عربي, إنشاء صور بالذكاء الاصطناعي, AI art Arabic, تصميم بالذكاء الاصطناعي, صور AI مجانية",
  openGraph: {
    title: "Midjourney بالعربي - الدليل الشامل",
    description: "تعلم كيفية استخدام Midjourney باللغة العربية لإنشاء صور مذهلة بالذكاء الاصطناعي",
    type: "website",
    url: "https://arabie.ai/midjourney-arabic",
    siteName: "العربي للذكاء الاصطناعي",
    locale: "ar_SA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Midjourney بالعربي - الدليل الشامل",
    description: "تعلم كيفية استخدام Midjourney باللغة العربية لإنشاء صور مذهلة بالذكاء الاصطناعي",
  },
  alternates: {
    canonical: "https://arabie.ai/midjourney-arabic",
  }
}

// For static generation, we'll use a hardcoded list of related tools
const midjourneyRelatedTools = [
  {
    id: 1,
    arabic_name: "Midjourney",
    codename: "Midjourney",
    description: "أداة إنشاء الصور بالذكاء الاصطناعي",
    arabic_description: "أداة إنشاء الصور بالذكاء الاصطناعي",
    logo_src: "/logos/midjourney.png",
    is_free: false
  },
  {
    id: 2,
    arabic_name: "DALL-E",
    codename: "DALL-E",
    description: "أداة إنشاء الصور من OpenAI",
    arabic_description: "أداة إنشاء الصور من OpenAI",
    logo_src: "/logos/dalle.png",
    is_free: true
  }
]

const midjourneyFeatures = [
  {
    title: "إنشاء صور من النصوص",
    icon: Sparkles,
    description: "اكتب أي وصف واحصل على صورة مذهلة خلال ثوانٍ",
    color: "text-purple-500"
  },
  {
    title: "جودة عالية",
    icon: Star,
    description: "صور عالية الدقة والجودة تنافس أعمال الفنانين",
    color: "text-yellow-500"
  },
  {
    title: "أساليب متنوعة",
    icon: Palette,
    description: "من الواقعية إلى الخيال العلمي والأنمي",
    color: "text-blue-500"
  },
  {
    title: "سهولة الاستخدام",
    icon: Zap,
    description: "واجهة بسيطة عبر Discord للمبتدئين",
    color: "text-green-500"
  },
  {
    title: "تحديثات مستمرة",
    icon: Download,
    description: "إصدارات جديدة تحسن الجودة والسرعة",
    color: "text-red-500"
  },
  {
    title: "مجتمع نشط",
    icon: Users,
    description: "مجتمع من الفنانين والمصممين العرب",
    color: "text-indigo-500"
  }
]

export default function MidjourneyArabicPage() {
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateMidjourneyArabicJsonLd()),
        }}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Midjourney بالعربي
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            الدليل الشامل لاستخدام Midjourney لإنشاء صور مذهلة بالذكاء الاصطناعي. تعلم كيفية تحويل أفكارك إلى أعمال فنية رائعة
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="success" className="text-sm px-4 py-2">
              <CheckCircle className="ml-2 h-4 w-4" />
              تجربة مجانية
            </Badge>
            <Badge variant="default" className="text-sm px-4 py-2">
              <Star className="ml-2 h-4 w-4" />
              جودة عالية
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">
              <Sparkles className="ml-2 h-4 w-4" />
              سهل الاستخدام
            </Badge>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="https://discord.gg/midjourney" target="_blank" rel="noopener noreferrer">
                <Image className="ml-2 h-5 w-5" />
                جرب Midjourney الآن
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
          <h2 className="text-2xl font-bold mb-6 text-center">مميزات Midjourney</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {midjourneyFeatures.map((feature, index) => (
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

        {/* FAQ Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">الأسئلة الشائعة عن Midjourney</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                ما هو Midjourney؟
              </h3>
              <p className="text-muted-foreground">
                Midjourney هو أداة ذكاء اصطناعي متقدمة لإنشاء الصور من النصوص. يمكنك وصف أي فكرة بالكلمات وسيقوم بإنشاء صورة مذهلة لها. يعمل من خلال Discord ويستخدم أحدث تقنيات الذكاء الاصطناعي.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                كيف أستخدم Midjourney بالعربي؟
              </h3>
              <p className="text-muted-foreground">
                يمكنك استخدام Midjourney من خلال Discord، اكتب الأمر /imagine متبوعاً بوصف الصورة التي تريدها باللغة العربية أو الإنجليزية. مثال: "/imagine قطة جميلة في حديقة مليئة بالزهور"
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                هل Midjourney مجاني؟
              </h3>
              <p className="text-muted-foreground">
                Midjourney يقدم تجربة مجانية محدودة للمستخدمين الجدد، مع خطط مدفوعة تبدأ من 10 دولار شهرياً للاستخدام الأوسع وإنشاء صور أكثر.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Related Tools */}
        {midjourneyRelatedTools.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">أدوات مشابهة لـ Midjourney</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {midjourneyRelatedTools.map((tool) => (
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
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">ابدأ إنشاء صورك الآن</h2>
              <p className="text-muted-foreground mb-6">
                اكتشف قوة الذكاء الاصطناعي في إنشاء الصور وحول أفكارك إلى أعمال فنية مذهلة
              </p>
              <Button size="lg" asChild>
                <Link href="https://discord.gg/midjourney" target="_blank" rel="noopener noreferrer">
                  <Image className="ml-2 h-5 w-5" />
                  جرب Midjourney مجاناً
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}