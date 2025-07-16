import { GraduationCap, Rocket, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function LaunchpadExplainer() {
  return (
    <div className="py-20">
      <div className="w-full">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ليس مجرد دورة، بل نظام متكامل للإتقان
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The Launchpad يأخذك من المبتدئ إلى بناء مشاريع حقيقية في 3 مراحل محكمة
          </p>
        </div>

        {/* Three Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Column 1: المنهج الأساسي */}
          <Card className="group glass glass-hover transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-primary/20 backdrop-blur rounded-full w-fit border border-primary/30">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-bold">🎓 المنهج الأساسي</CardTitle>
              <CardDescription className="text-base">
                الأساسيات التي تحتاجها لفهم الذكاء الاصطناعي
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>مقدمة شاملة للذكاء الاصطناعي وتطبيقاته</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>تعلم كيفية كتابة الـ Prompts الفعالة</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>فهم الأدوات الأساسية وكيفية استخدامها</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>استراتيجيات التعلم والتطبيق العملي</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Column 2: المشروع النهائي */}
          <Card className="group glass glass-hover transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-primary/20 backdrop-blur rounded-full w-fit border border-primary/30">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-bold">🚀 المشروع النهائي</CardTitle>
              <CardDescription className="text-base">
                مشروع حقيقي يمكنك استخدامه في عملك
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>بناء روبوت ذكي للمحادثة والمساعدة</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>تطبيق يحل مشكلة حقيقية في عملك</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>إنشاء نظام آلي لزيادة الإنتاجية</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>مشروع جاهز لإضافته إلى سيرتك الذاتية</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Column 3: الترسانة */}
          <Card className="group glass glass-hover transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-primary/20 backdrop-blur rounded-full w-fit border border-primary/30">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-bold">🛡️ الترسانة</CardTitle>
              <CardDescription className="text-base">
                أدوات مختارة بعناية لتسريع عملك
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>+40 أداة ذكاء اصطناعي مختارة بعناية</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>شروحات مفصلة لكل أداة باللغة العربية</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>أمثلة عملية وحالات استخدام واقعية</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>تحديثات دورية بأحدث الأدوات</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}