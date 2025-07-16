import { ArrowRight, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function FinalCTA() {
  return (
    <div className="py-20">
      <div className="w-full">
        <div className="text-center max-w-4xl mx-auto">
          {/* Icon */}
          <div className="mx-auto mb-8 p-6 bg-primary/20 backdrop-blur rounded-full w-fit border border-primary/30">
            <Rocket className="h-12 w-12 text-primary" />
          </div>
          
          {/* Headline */}
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            حان الوقت لتبدأ رحلتك
          </h2>
          
          {/* Subheadline */}
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            انضم إلى آلاف المتعلمين العرب الذين يبنون مستقبلهم بالذكاء الاصطناعي.
            <br />
            <strong className="text-foreground">ابدأ مجاناً، بدون بطاقة ائتمان.</strong>
          </p>
          
          {/* CTA Button */}
          <Button 
            asChild 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-12 py-6 text-xl glow-teal glow-teal-hover transition-all duration-300"
          >
            <Link href="/tutorials">
              🚀 ابدأ العمل على مشروعك الأول الآن
              <ArrowRight className="h-6 w-6 mr-3" />
            </Link>
          </Button>
          
          {/* Trust Text */}
          <p className="text-sm text-muted-foreground mt-6">
            أكثر من 10,000 متعلم بدأوا رحلتهم معنا
          </p>
        </div>
      </div>
    </div>
  )
}