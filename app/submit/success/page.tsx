import { CheckCircle, ArrowRight, Plus, Home, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FadeIn } from "@/components/cult/fade-in"

export default function SubmitSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <FadeIn>
          <Card className="text-center">
            <CardHeader className="pb-6">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-green-800 dark:text-green-400 mb-2">
                تم إرسال اقتراحك بنجاح! 🎉
              </CardTitle>
              <CardDescription className="text-lg leading-relaxed">
                شكراً لك على مساهمتك في بناء أكبر دليل عربي للذكاء الاصطناعي
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* What happens next */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-right">
                <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
                  ما الذي سيحدث الآن؟
                </h3>
                <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>• سيقوم فريقنا بمراجعة الأداة خلال 24-48 ساعة</p>
                  <p>• سنرسل لك إشعاراً عبر البريد الإلكتروني عند قبول الأداة</p>
                  <p>• ستظهر الأداة في الدليل مع رابط مجاني لموقعك</p>
                  <p>• ستصل الأداة لأكثر من 10,000 مستخدم عربي شهرياً</p>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-accent/50 rounded-lg p-4 text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">وصول واسع</h4>
                  <p className="text-xs text-muted-foreground">+10,000 مستخدم شهرياً</p>
                </div>
                <div className="bg-accent/50 rounded-lg p-4 text-center">
                  <ArrowRight className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">رابط مجاني</h4>
                  <p className="text-xs text-muted-foreground">باك لينك لموقعك</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild className="flex-1 sm:flex-none">
                    <Link href="/submit" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      اقترح أداة أخرى
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="flex-1 sm:flex-none">
                    <Link href="/" className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      العودة للرئيسية
                    </Link>
                  </Button>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    شارك الدليل مع أصدقائك
                  </p>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/blog" className="text-primary hover:text-primary/80">
                      اقرأ مقالاتنا عن الذكاء الاصطناعي
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Newsletter CTA */}
              <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">
                  هل تريد البقاء على اطلاع؟
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  اشترك في نشرتنا الأسبوعية للحصول على أحدث أدوات الذكاء الاصطناعي
                </p>
                <Button size="sm" className="w-full">
                  اشترك في النشرة الأسبوعية
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  )
}