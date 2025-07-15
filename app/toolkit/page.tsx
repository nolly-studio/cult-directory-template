import { Metadata } from "next"
import Link from "next/link"
import { Download, CheckCircle, Star, ArrowRight, Brain, Zap, Target } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeIn } from "@/components/cult/fade-in"
import { NavSidebar } from "@/components/nav"
import { AdaptiveLayout } from "@/components/adaptive-layout"
import { getCachedFilters } from "../actions/cached_actions"

export const metadata: Metadata = {
  title: "مجموعة أدوات الذكاء الاصطناعي للمسوقين العرب - تحميل مجاني",
  description: "احصل على ميزة غير عادلة. أدوات وقوالب ChatGPT باللغة العربية، دليل Midjourney، والأدوات السرية التي يستخدمها كبار المسوقين العرب.",
  keywords: "أدوات الذكاء الاصطناعي، تسويق رقمي، ChatGPT عربي، Midjourney، قوالب تسويقية، مسوقين عرب",
  openGraph: {
    title: "مجموعة أدوات الذكاء الاصطناعي للمسوقين العرب",
    description: "احصل على ميزة غير عادلة. أدوات وقوالب ChatGPT باللغة العربية مجاناً",
    type: "website",
    url: "https://arabie.ai/toolkit",
    siteName: "العربي للذكاء الاصطناعي",
    locale: "ar_SA",
  },
  alternates: {
    canonical: "https://arabie.ai/toolkit",
  }
}

// Force dynamic rendering for email capture
export const dynamic = 'force-dynamic'

export default async function ToolkitPage({
  searchParams,
}: {
  searchParams: { success?: string; error?: string }
}) {
  let filters: { categories: string[]; labels: string[]; tags: string[] } = { 
    categories: [], 
    labels: [], 
    tags: [] 
  }
  
  try {
    filters = await getCachedFilters()
  } catch (error) {
    console.error('Error fetching filters:', error)
  }

  return (
    <>
      <NavSidebar
        categories={filters.categories}
        labels={filters.labels}
        tags={filters.tags}
      />

      <AdaptiveLayout className="py-6">
        <FadeIn>
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Brain className="h-12 w-12 text-primary animate-pulse" />
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  مجاني 100%
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                احصل على <span className="text-primary">ميزة غير عادلة</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                أدوات الذكاء الاصطناعي والقوالب الجاهزة التي يستخدمها كبار المسوقين العرب
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Badge variant="outline" className="text-base px-4 py-2">
                  <Star className="ml-2 h-4 w-4 text-yellow-500" />
                  يوفر 10+ ساعات أسبوعياً
                </Badge>
                <Badge variant="outline" className="text-base px-4 py-2">
                  <Target className="ml-2 h-4 w-4 text-green-500" />
                  نتائج فورية في 5 دقائق
                </Badge>
                <Badge variant="outline" className="text-base px-4 py-2">
                  <Zap className="ml-2 h-4 w-4 text-blue-500" />
                  مُحدث لعام 2024
                </Badge>
              </div>
            </div>

            {/* What's Inside */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-full w-fit">
                    <Zap className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">ماكينة المحتوى السريع</CardTitle>
                  <CardDescription className="text-base">
                    5 قوالب ChatGPT جاهزة لإنشاء محتوى أسبوع كامل في 5 دقائق
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      قوالب منشورات انستغرام
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      نصوص تويتر جذابة
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      محتوى لينكد إن احترافي
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full w-fit">
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">مُنشئ الصور الفوري</CardTitle>
                  <CardDescription className="text-base">
                    دليل Midjourney المختصر لإنشاء 3 أنواع صور تسويقية أساسية
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-500" />
                      صور منتجات احترافية
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-500" />
                      رسوم بيانية جذابة
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-500" />
                      صور غلاف المدونة
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full w-fit">
                    <Star className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">الأدوات السرية</CardTitle>
                  <CardDescription className="text-base">
                    3 أدوات ذكاء اصطناعي قليلة المعرفة تحل مشاكل تسويقية كبيرة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      محرر فيديو ذكي
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      ملخص الاجتماعات
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      منشئ العروض التلقائي
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Email Capture Form */}
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-blue-500/5 border-primary/20">
              <CardContent className="pt-8 text-center">
                {searchParams.success ? (
                  <div className="space-y-4">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                    <h3 className="text-2xl font-bold text-green-600">
                      تم التسجيل بنجاح! 🎉
                    </h3>
                    <p className="text-muted-foreground">
                      ستصلك المجموعة على إيميلك خلال 5 دقائق. تأكد من مراجعة مجلد الرسائل المزعجة.
                    </p>
                    <Button asChild className="mt-4">
                      <Link href="/">
                        ابدأ استكشاف الأدوات
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold mb-4">
                      احصل على المجموعة الكاملة مجاناً
                    </h3>
                    
                    <p className="text-muted-foreground mb-6">
                      أدخل إيميلك وستصلك المجموعة خلال دقيقة واحدة
                    </p>

                    {searchParams.error && (
                      <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg text-sm">
                        {searchParams.error === 'invalid-email' && 'يرجى إدخال إيميل صحيح'}
                        {searchParams.error === 'subscription-failed' && 'حدث خطأ في التسجيل. يرجى المحاولة مرة أخرى'}
                        {searchParams.error === 'server-error' && 'خطأ في الخادم. يرجى المحاولة لاحقاً'}
                      </div>
                    )}

                    <form className="space-y-4" action="/api/subscribe" method="POST">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="email"
                          name="email"
                          placeholder="أدخل إيميلك هنا"
                          required
                          className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-lg"
                          dir="ltr"
                        />
                        <Button 
                          type="submit" 
                          size="lg" 
                          className="px-8 py-3 text-lg font-semibold"
                        >
                          <Download className="ml-2 h-5 w-5" />
                          تحميل مجاني
                        </Button>
                      </div>
                    </form>

                    <p className="text-xs text-muted-foreground mt-4">
                      لا رسائل مزعجة • إلغاء الاشتراك في أي وقت • أكثر من 2,000 مسوق حمّل المجموعة
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Social Proof */}
            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">
                انضم لأكثر من 2,000 مسوق عربي يستخدمون هذه الأدوات
              </p>
              
              <div className="flex justify-center items-center gap-8 opacity-60">
                <span className="text-sm">محمد الأحمد - مدير تسويق</span>
                <span className="text-sm">فاطمة العلي - رائدة أعمال</span>
                <span className="text-sm">أحمد خالد - مطور محتوى</span>
              </div>
            </div>

            {/* Back to tools */}
            <div className="text-center mt-12">
              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowRight className="ml-2 h-4 w-4" />
                  العودة لاستكشاف الأدوات
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </AdaptiveLayout>
    </>
  )
}