import { ListSkeleton } from "@/components/ui/loading"
import { AdaptiveLayout } from "@/components/adaptive-layout"

export default function ToolsLoading() {
  return (
    <AdaptiveLayout className="py-6">
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="text-center space-y-4 animate-pulse">
          <div className="h-10 bg-muted rounded w-48 mx-auto"></div>
          <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
        </div>
        
        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ListSkeleton count={6} />
        </div>
      </div>
    </AdaptiveLayout>
  )
} 