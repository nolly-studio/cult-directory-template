import { Metadata } from "next"
import Link from "next/link"
import { 
  ArrowRight, 
  Star, 
  Users, 
  Zap, 
  BookOpen,
  CheckCircle,
  X,
  Crown,
  DollarSign,
  Globe,
  MessageSquare,
  Image,
  Code,
  Award
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Generate structured data for comparison page
function generateComparisonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "مقارنة أدوات الذكاء الاصطناعي - ChatGPT vs Claude vs Midjourney",
    description: "مقارنة شاملة بين أفضل أدوات الذكاء الاصطناعي. اكتشف الفروقات والمميزات لكل أداة لتختار الأنسب لاحتياجاتك.",
    url: "https://arabie.ai/ai-tools-comparison",
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
    keywords: "مقارنة أدوات الذكاء الاصطناعي, ChatGPT vs Claude, أفضل أدوات AI, مقارنة AI tools, اختيار أداة ذكاء اصطناعي",
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
          name: "مقارنة أدوات الذكاء الاصطناعي",
          item: "https://arabie.ai/ai-tools-comparison"
        }
      ]
    },
    mainEntity: {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "ما هي أفضل أداة ذكاء اصطناعي؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "يعتمد على الاستخدام: ChatGPT للمحادثة العامة، Claude للأمان والدقة، Midjourney لإنشاء الصور، وGitHub Copilot للبرمجة."
          }
        },
        {
          "@type": "Question",
          name: "أيهما أفضل ChatGPT أم Claude؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "ChatGPT أسرع وأكثر شعبية، بينما Claude أكثر أماناً ودقة. الاختيار يعتمد على أولوياتك."
          }
        }
      ]
    }
  }
}

export const metadata: Metadata = {
  title: "مقارنة أدوات الذكاء الاصطناعي - ChatGPT vs Claude vs Midjourney والمزيد",
  description: "مقارنة شاملة بين أفضل أدوات الذكاء الاصطناعي بالعربية. اكتشف الفروقات والمميزات لكل أداة لتختار الأنسب لاحتياجاتك ⚡",
  keywords: "مقارنة أدوات الذكاء الاصطناعي, ChatGPT vs Claude, أفضل أدوات AI, مقارنة AI tools, اختيار أداة ذكاء اصطناعي, أدوات AI مجانية",
  openGraph: {
    title: "مقارنة أدوات الذكاء الاصطناعي - ChatGPT vs Claude vs Midjourney",
    description: "مقارنة شاملة بين أفضل أدوات الذكاء الاصطناعي بالعربية",
    type: "website",
    url: "https://arabie.ai/ai-tools-comparison",
    siteName: "العربي للذكاء الاصطناعي",
    locale: "ar_SA",
  },
  twitter: {
    card: "summary_large_image",
    title: "مقارنة أدوات الذكاء الاصطناعي",
    description: "مقارنة شاملة بين أفضل أدوات الذكاء الاصطناعي بالعربية",
  },
  alternates: {
    canonical: "https://arabie.ai/ai-tools-comparison",
  }
}

const aiToolsComparison = [
  {
    name: "ChatGPT",
    company: "OpenAI",
    category: "محادثة ونصوص",
    price: "مجاني + 20$/شهر",
    rating: 4.5,
    strengths: ["سرعة الاستجابة", "واجهة سهلة", "دعم واسع"],
    weaknesses: ["قد يعطي معلومات خاطئة", "انقطاع أحياناً"],
    bestFor: "المحادثة العامة والكتابة",
    link: "https://chat.openai.com",
    color: "bg-green-50 border-green-200"
  },
  {
    name: "Claude",
    company: "Anthropic",
    category: "محادثة ونصوص",
    price: "مجاني + 20$/شهر",
    rating: 4.7,
    strengths: ["أمان عالي", "دقة أكبر", "تحليل معمق"],
    weaknesses: ["أبطأ قليلاً", "أقل شعبية"],
    bestFor: "التحليل والمهام المعقدة",
    link: "https://claude.ai",
    color: "bg-blue-50 border-blue-200"
  },
  {
    name: "Midjourney",
    company: "Midjourney Inc",
    category: "إنشاء الصور",
    price: "10$/شهر",
    rating: 4.8,
    strengths: ["جودة صور عالية", "أساليب متنوعة", "سهولة الاستخدام"],
    weaknesses: ["مدفوع فقط", "يحتاج Discord"],
    bestFor: "إنشاء الصور الفنية",
    link: "https://midjourney.com",
    color: "bg-purple-50 border-purple-200"
  },
  {
    name: "GitHub Copilot",
    company: "GitHub/OpenAI",
    category: "البرمجة",
    price: "10$/شهر",
    rating: 4.6,
    strengths: ["ممتاز للبرمجة", "تكامل مع IDEs", "دعم لغات متعددة"],
    weaknesses: ["مدفوع", "للمبرمجين فقط"],
    bestFor: "البرمجة وتطوير البرمجيات",
    link: "https://github.com/features/copilot",
    color: "bg-gray-50 border-gray-200"
  }
]

export default function AIToolsComparisonPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateComparisonJsonLd()),
        }}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            مقارنة أدوات الذكاء الاصطناعي
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            مقارنة شاملة بين أفضل أدوات الذكاء الاصطناعي لتساعدك في اختيار الأداة المناسبة لاحتياجاتك
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="default" className="text-sm px-4 py-2">
              <Award className="ml-2 h-4 w-4" />
              مقارنة محدثة 2024
            </Badge>
            <Badge variant="success" className="text-sm px-4 py-2">
              <CheckCircle className="ml-2 h-4 w-4" />
              تجربة شخصية
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">
              <Star className="ml-2 h-4 w-4" />
              تقييم موضوعي
            </Badge>
          </div>
        </div>

        {/* Quick Comparison Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {aiToolsComparison.map((tool, index) => (
            <Card key={index} className={`hover:shadow-lg transition-shadow ${tool.color}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  {tool.name}
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm">{tool.rating}</span>
                  </div>
                </CardTitle>
                <CardDescription className="text-sm">
                  {tool.company} • {tool.category}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">السعر:</span>
                    <span className="text-sm text-muted-foreground">{tool.price}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">الأفضل لـ:</span>
                    <p className="text-sm text-muted-foreground">{tool.bestFor}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={tool.link} target="_blank" rel="noopener noreferrer">
                      جرب الآن
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Comparison Table */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">مقارنة تفصيلية</CardTitle>
            <CardDescription>
              مقارنة شاملة للمميزات والعيوب لكل أداة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">الأداة</TableHead>
                    <TableHead>المميزات</TableHead>
                    <TableHead>العيوب</TableHead>
                    <TableHead>الأفضل لـ</TableHead>
                    <TableHead>التقييم</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aiToolsComparison.map((tool, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{tool.name}</div>
                          <div className="text-sm text-muted-foreground">{tool.company}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {tool.strengths.map((strength, i) => (
                            <div key={i} className="flex items-center text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                              {strength}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {tool.weaknesses.map((weakness, i) => (
                            <div key={i} className="flex items-center text-sm">
                              <X className="h-3 w-3 text-red-500 mr-2" />
                              {weakness}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{tool.bestFor}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-medium">{tool.rating}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Use Cases Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-6 w-6 text-blue-500 mr-2" />
                للمحادثة والكتابة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">الأفضل: ChatGPT</span>
                  <Badge variant="default">موصى به</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  سريع، سهل الاستخدام، ومناسب لمعظم المهام اليومية
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-medium">البديل: Claude</span>
                  <Badge variant="outline">أكثر دقة</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  للمهام المعقدة والتحليل المتقدم
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="h-6 w-6 text-purple-500 mr-2" />
                لإنشاء الصور
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">الأفضل: Midjourney</span>
                  <Badge variant="default">موصى به</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  أعلى جودة وأساليب فنية متنوعة
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-medium">البديل: DALL-E</span>
                  <Badge variant="outline">أسهل</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  متكامل مع ChatGPT وأسهل في الاستخدام
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">الأسئلة الشائعة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                ما هي أفضل أداة ذكاء اصطناعي؟
              </h3>
              <p className="text-muted-foreground">
                يعتمد على الاستخدام: ChatGPT للمحادثة العامة، Claude للأمان والدقة، Midjourney لإنشاء الصور، وGitHub Copilot للبرمجة.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                أيهما أفضل ChatGPT أم Claude؟
              </h3>
              <p className="text-muted-foreground">
                ChatGPT أسرع وأكثر شعبية، بينما Claude أكثر أماناً ودقة. الاختيار يعتمد على أولوياتك: السرعة أم الدقة.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                هل هناك أدوات مجانية؟
              </h3>
              <p className="text-muted-foreground">
                نعم، ChatGPT وClaude متاحان مجاناً مع قيود. Midjourney يقدم تجربة مجانية محدودة. معظم الأدوات تقدم خطط مدفوعة للاستخدام الأوسع.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">اختر الأداة المناسبة لك</h2>
              <p className="text-muted-foreground mb-6">
                استكشف جميع أدوات الذكاء الاصطناعي المتاحة واختر ما يناسب احتياجاتك
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
                    تعلم الاستخدام
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}