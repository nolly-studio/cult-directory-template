import { TrendingUp, Users, Briefcase, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function SuccessStats() {
  const stats = [
    {
      percentage: "85%",
      description: "حصلوا على وظيفة أفضل",
      icon: Briefcase
    },
    {
      percentage: "92%",
      description: "زادت إنتاجيتهم",
      icon: TrendingUp
    },
    {
      percentage: "78%",
      description: "بدأوا مشاريعهم الخاصة",
      icon: Users
    },
    {
      percentage: "96%",
      description: "ينصحون بالبرنامج",
      icon: Star
    }
  ]

  return (
    <div className="py-20">
      <div className="w-full">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary text-primary-foreground">
            النتائج بالأرقام
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            التحول الذي نضمنه
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            أرقام حقيقية من متعلمين حقيقيين حققوا نجاحات استثنائية
          </p>
        </div>

        {/* Stats Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="text-center group"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {/* Icon */}
                  <div className="mx-auto mb-4 p-4 bg-primary/10 backdrop-blur rounded-full w-fit border border-primary/30 group-hover:bg-primary/20 transition-all duration-300">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  
                  {/* Percentage */}
                  <div className="text-5xl md:text-6xl font-bold text-primary mb-2 animate-pulse">
                    {stat.percentage}
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}