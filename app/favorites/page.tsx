import { Suspense } from "react"
import { Heart, Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/db/supabase/server"
import { FavoriteButton } from "@/components/favorite-button"
import { NavSidebar } from "@/components/nav"
import { AdaptiveLayout } from "@/components/adaptive-layout"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

async function FavoritesContent() {
  const supabase = createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect('/login')
  }

  const { data: favorites, error } = await supabase
    .from('user_favorites')
    .select(`
      id,
      created_at,
      product:products(*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching favorites:', error)
    return <div>خطأ في تحميل المفضلة</div>
  }

  const favoriteProducts = favorites?.map(item => item.product).filter(Boolean) || []

  if (favoriteProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">لا توجد أدوات مفضلة بعد</h3>
        <p className="text-muted-foreground mb-6">
          ابدأ في استكشاف الأدوات وأضفها إلى مفضلتك لتجدها هنا بسهولة
        </p>
        <Button asChild>
          <Link href="/tools">
            استكشف الأدوات
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favoriteProducts.map((product: any) => (
        <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg leading-relaxed mb-2">
                  {product.name}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed line-clamp-2">
                  {product.description}
                </CardDescription>
              </div>
              <FavoriteButton 
                productId={product.id} 
                initialIsFavorited={true}
                size="sm"
                variant="ghost"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {product.category}
                </Badge>
                {product.pricing === 'free' && (
                  <Badge variant="outline" className="text-green-600">
                    مجاني
                  </Badge>
                )}
                {product.pricing === 'paid' && (
                  <Badge variant="outline" className="text-blue-600">
                    مدفوع
                  </Badge>
                )}
                {product.pricing === 'freemium' && (
                  <Badge variant="outline" className="text-purple-600">
                    فريميوم
                  </Badge>
                )}
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/tools/${product.slug}`}>
                  عرض التفاصيل
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-muted rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-muted rounded w-full animate-pulse" />
                <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
              </div>
              <div className="h-8 w-8 bg-muted rounded animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 bg-muted rounded-full w-16 animate-pulse" />
                <div className="h-6 bg-muted rounded-full w-12 animate-pulse" />
              </div>
              <div className="h-8 bg-muted rounded w-20 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function FavoritesPage() {
  return (
    <>
      <NavSidebar
        categories={[]}
        labels={[]}
        tags={[]}
      />
      
      <AdaptiveLayout>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" asChild>
              <Link href="/tools" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                العودة للأدوات
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold">أدواتي المفضلة</h1>
          </div>
          
          <p className="text-muted-foreground text-lg">
            احتفظ بأدواتك المفضلة في مكان واحد للوصول إليها بسرعة
          </p>
        </div>

        {/* Content */}
        <Suspense fallback={<LoadingSkeleton />}>
          <FavoritesContent />
        </Suspense>
          </div>
        </div>
      </AdaptiveLayout>
    </>
  )
} 