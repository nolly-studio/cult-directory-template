import { ArrowRight, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ProductLogo } from "@/components/product-logo"
import { formatToolType } from "@/lib/format-category"

interface ArmoryLogosProps {
  featuredTools: any[]
}

export function ArmoryLogos({ featuredTools }: ArmoryLogosProps) {
  // Select top 18 tools, prioritizing those with logos
  const toolsToShow = featuredTools
    .sort((a, b) => {
      // Prioritize tools with logos
      if (a.logo_src && !b.logo_src) return -1
      if (!a.logo_src && b.logo_src) return 1
      return (b.view_count || 0) - (a.view_count || 0)
    })
    .slice(0, 18)
  return (
    <div className="py-20">
      <div className="w-full">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary text-primary-foreground">
            <Shield className="h-4 w-4 mr-2" />
            الترسانة
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            الترسانة: أدواتك المختارة من قبل الخبراء
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            تعلم كيفية استخدام أقوى أدوات الذكاء الاصطناعي في السوق. كل أداة مشروحة بالتفصيل باللغة العربية.
          </p>
        </div>

        {/* Premium Tools Grid */}
        <div className="w-full max-w-5xl mx-auto mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {toolsToShow.map((tool, index) => (
              <div
                key={tool.name}
                className="group relative glass rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 glass-hover"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Tool Logo */}
                <div className="w-full h-16 flex items-center justify-center mb-3">
                  <ProductLogo
                    logo_src={tool.logo_src}
                    codename={tool.codename}
                    tool_type={tool.tool_type}
                    arabic_name={tool.arabic_name}
                    size="lg"
                    className="object-contain"
                  />
                </div>
                
                {/* Tool Name */}
                <h3 className="font-semibold text-sm text-center text-foreground mb-1">
                  {tool.arabic_name}
                </h3>
                
                {/* Category */}
                <p className="text-xs text-muted-foreground text-center">
                  {formatToolType(tool.tool_type)}
                </p>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mb-12">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              <span>+40 أداة مختارة بعناية</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-primary/80 rounded-full"></div>
              <span>شروحات مفصلة بالعربية</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-primary/60 rounded-full"></div>
              <span>أمثلة عملية واقعية</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-primary/40 rounded-full"></div>
              <span>تحديثات دورية</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg glow-teal glow-teal-hover transition-all duration-300">
            <Link href="/tools">
              اكتشف الأدوات المتاحة في الترسانة (+40 أداة)
              <ArrowRight className="h-5 w-5 mr-2" />
            </Link>
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4">
            كل أداة مع شرح مفصل، أمثلة عملية، وحالات استخدام واقعية
          </p>
        </div>
      </div>
    </div>
  )
}