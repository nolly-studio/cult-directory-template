import { Play, ArrowLeft, Sparkles, Bot, MessageSquare, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function CapstoneShowcase() {
  return (
    <div className="py-20">
      <div className="w-full">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4 mr-2" />
            المشروع النهائي
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            هذا ليس عرضاً توضيحياً
            <br />
            <span className="text-3xl md:text-4xl text-primary">هذا هو مشروعك النهائي</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            بعد انتهائك من The Launchpad، ستكون قد بنيت روبوت ذكي كامل يمكنك استخدامه في عملك أو شركتك فوراً
          </p>
        </div>

        {/* Project Showcase */}
        <div className="w-full max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Project Demo */}
            <div className="relative group cursor-pointer">
              <Card className="overflow-hidden border-2 border-primary/30 hover:border-primary/50 shadow-2xl transition-all duration-300 glass">
                <CardContent className="p-0">
                  {/* Mock Chat Interface */}
                  <div className="bg-primary text-primary-foreground p-4">
                    <div className="flex items-center gap-3">
                      <Bot className="h-6 w-6" />
                      <div>
                        <h3 className="font-bold">مساعد العملاء الذكي</h3>
                        <p className="text-sm opacity-90">متصل الآن</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-black/20 backdrop-blur min-h-[400px] flex flex-col justify-between">
                    {/* Chat Messages */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary/20 backdrop-blur rounded-full flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-lg p-3 max-w-xs">
                          <p className="text-sm">مرحباً! كيف يمكنني مساعدتك اليوم؟</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 justify-end">
                        <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-xs">
                          <p className="text-sm">أريد معرفة المزيد عن خدماتكم</p>
                        </div>
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">أ</span>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary/20 backdrop-blur rounded-full flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-lg p-3 max-w-xs">
                          <p className="text-sm">بالطبع! نحن نقدم حلول الذكاء الاصطناعي المتقدمة. هل تريد معرفة المزيد عن خدمة معينة؟</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Input Area */}
                    <div className="border-t border-white/10 pt-4 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/10 backdrop-blur rounded-full p-3">
                          <p className="text-sm text-muted-foreground">اكتب رسالتك هنا...</p>
                        </div>
                        <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90">
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Play Button Overlay - Shows on Hover */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="text-center">
                  <div className="bg-primary/20 backdrop-blur rounded-full p-6 mb-4 mx-auto w-fit">
                    <Play className="h-12 w-12 text-primary" />
                  </div>
                  <p className="text-lg font-bold text-white">شاهد المشروع بالتفصيل</p>
                </div>
              </div>
            </div>

            {/* Right Side - Project Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-4">ماذا ستبني؟</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">روبوت محادثة ذكي</h4>
                      <p className="text-sm text-muted-foreground">يفهم اللغة العربية ويجيب على أسئلة العملاء تلقائياً</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">أتمتة خدمة العملاء</h4>
                      <p className="text-sm text-muted-foreground">يعمل 24/7 ويقلل من عبء العمل على فريقك</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">قابل للتخصيص</h4>
                      <p className="text-sm text-muted-foreground">يمكن تعديله ليناسب أي نوع من الأعمال</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                <h4 className="font-bold text-primary mb-2">💡 القيمة الحقيقية</h4>
                <p className="text-sm text-primary/80">
                  هذا المشروع وحده يمكن أن يوفر على شركتك آلاف الدولارات شهرياً في تكاليف خدمة العملاء
                </p>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}