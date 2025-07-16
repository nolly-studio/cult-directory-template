import { ArrowRight, PlayCircle, Code, Trophy, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "تعلم الأساسيات",
      description: "ابدأ بالمنهج الأساسي لتفهم الذكاء الاصطناعي وكيفية كتابة الـ Prompts الفعالة",
      icon: PlayCircle
    },
    {
      number: "02", 
      title: "طبق عملياً",
      description: "استخدم أدوات الترسانة المختارة بعناية لتطبيق ما تعلمته في مشاريع حقيقية",
      icon: Code
    },
    {
      number: "03",
      title: "اكمل المشروع النهائي",
      description: "اعمل على مشروع متكامل (روبوت ذكي) يمكنك إضافته لسيرتك الذاتية أو استخدامه في عملك",
      icon: Trophy
    },
    {
      number: "04",
      title: "أثبت خبرتك",
      description: "شارك مشروعك واحصل على فرص حقيقية في سوق العمل والمشاريع الجديدة",
      icon: Users
    }
  ]

  return (
    <div className="py-20">
      <div className="w-full">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary text-primary-foreground">
            المسار التعليمي
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            كيف ستصبح خبيراً في الذكاء الاصطناعي؟
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            مسار واضح ومحدد من المبتدئ إلى الخبير في 4 خطوات بسيطة
          </p>
        </div>

        {/* Steps Grid */}
        <div className="w-full max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="relative">
                  <Card className="glass glass-hover hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                    <CardContent className="p-6">
                      {/* Step Number */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-2xl font-bold text-primary">
                          {step.number}
                        </div>
                        <div className="p-3 rounded-full bg-primary">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Arrow connector for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-8 w-8 text-primary/60" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}