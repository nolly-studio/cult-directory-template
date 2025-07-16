import { Star, Quote, ArrowRight, Briefcase, Award, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Testimonials() {
  const testimonials = [
    {
      name: "أحمد المنصوري",
      role: "مطور تطبيقات",
      company: "شركة تقنية، الإمارات",
      avatar: "أ",
      testimonial: "بعد إكمال The Launchpad، تمكنت من بناء روبوت خدمة عملاء لشركتي. النتائج فاقت التوقعات - انخفضت تكلفة الدعم بنسبة 60%!",
      achievement: "وفر 60% من تكلفة الدعم",
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    {
      name: "فاطمة الزهراني",
      role: "صاحبة أعمال",
      company: "متجر إلكتروني، السعودية",
      avatar: "ف",
      testimonial: "الشروحات واضحة جداً والأدوات مفيدة. تمكنت من أتمتة نصف عملياتي التسويقية باستخدام AI، مما زاد مبيعاتي 40%.",
      achievement: "زادت المبيعات 40%",
      color: "green",
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800"
    },
    {
      name: "محمد الخالدي",
      role: "مسوق رقمي",
      company: "وكالة تسويق، مصر",
      avatar: "م",
      testimonial: "المحتوى عملي جداً. أصبحت أستخدم AI في كل شيء: كتابة المحتوى، تحليل البيانات، والتصميم. إنتاجيتي زادت 300%!",
      achievement: "زادت الإنتاجية 300%",
      color: "purple",
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800"
    },
    {
      name: "نور الدين العلوي",
      role: "مدير مشاريع",
      company: "شركة استشارات، المغرب",
      avatar: "ن",
      testimonial: "بفضل هذا البرنامج، تمكنت من الحصول على ترقية وزيادة راتب 50%. المشروع النهائي أضافه إلى سيرتي الذاتية وأبهر به المدراء.",
      achievement: "زيادة راتب 50%",
      color: "orange",
      gradient: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800"
    },
    {
      name: "ريم الشمري",
      role: "مُعلمة",
      company: "مدرسة دولية، الكويت",
      avatar: "ر",
      testimonial: "كوني مُعلمة، أردت تعلم AI لتحسين التعليم. الآن أستخدم AI لإنشاء محتوى تعليمي مخصص لكل طالب. التحسن في الدرجات واضح!",
      achievement: "تحسن ملحوظ في تعلم الطلاب",
      color: "teal",
      gradient: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
      borderColor: "border-teal-200 dark:border-teal-800"
    },
    {
      name: "خالد الرشيد",
      role: "مؤسس شركة ناشئة",
      company: "تطبيق ذكي، الأردن",
      avatar: "خ",
      testimonial: "انطلقت من الصفر. بعد The Launchpad، أسست شركة ناشئة تقدم حلول AI للشركات. حصلت على استثمار أولي بقيمة 100 ألف دولار!",
      achievement: "استثمار 100 ألف دولار",
      color: "indigo",
      gradient: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      borderColor: "border-indigo-200 dark:border-indigo-800"
    }
  ]

  return (
    <div className="py-20">
      <div className="w-full">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary text-primary-foreground">
            قصص نجاح حقيقية
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            من الطلاب إلى خبراء الذكاء الاصطناعي
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            اكتشف كيف غيّر متعلمونا حياتهم المهنية وحققوا نتائج استثنائية
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="w-full max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.name}
                className="glass glass-hover hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              >
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <div className="absolute top-4 right-4 opacity-20">
                    <Quote className="h-8 w-8 text-muted-foreground" />
                  </div>

                  {/* Profile */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{testimonial.name}</h4>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed italic">
                    "{testimonial.testimonial}"
                  </p>

                  {/* Achievement Badge */}
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-primary">
                      {testimonial.achievement}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>


        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            جاهز لتكون القصة التالية؟
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            انضم إلى آلاف المتعلمين الذين حققوا تحولاً حقيقياً في حياتهم المهنية
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 glow-teal glow-teal-hover transition-all duration-300">
            <Link href="/tutorials">
              ابدأ بناء مشروعك الآن
              <ArrowRight className="h-5 w-5 mr-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}