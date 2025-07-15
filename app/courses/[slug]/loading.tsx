import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header Navigation Skeleton */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          
          {/* Header Content Skeleton */}
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl" dir="rtl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Skeleton - Position for RTL */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24 space-y-6">
              {/* Enrollment Card Skeleton */}
              <Card>
                <CardContent className="pt-6" dir="rtl">
                  <Skeleton className="h-12 w-full mb-4" />
                  <Skeleton className="h-4 w-32 mx-auto" />
                </CardContent>
              </Card>

              {/* Course Info Skeleton */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent dir="rtl">
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {/* Course Hero Skeleton */}
            <Card className="mb-8">
              <CardContent className="p-0">
                <Skeleton className="aspect-video w-full" />
                <div className="p-6">
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  
                  {/* Stats Grid Skeleton */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="bg-muted/50 rounded-lg p-3 text-center">
                        <Skeleton className="h-5 w-5 mx-auto mb-1" />
                        <Skeleton className="h-4 w-12 mx-auto mb-1" />
                        <Skeleton className="h-3 w-8 mx-auto" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center">
                    <Skeleton className="h-12 w-48" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Skeleton */}
            <Card>
              <CardHeader>
                <div className="flex space-x-1 justify-start" dir="rtl">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </CardHeader>
              <CardContent dir="rtl">
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <Skeleton className="h-6 w-48 mb-2" />
                      <div className="space-y-2">
                        {Array.from({ length: 2 }).map((_, j) => (
                          <div key={j} className="flex items-center justify-between p-3" dir="rtl">
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-4 w-16" />
                            </div>
                            <div className="flex items-center gap-3">
                              <div>
                                <Skeleton className="h-4 w-32 mb-1" />
                                <Skeleton className="h-3 w-24" />
                              </div>
                              <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}