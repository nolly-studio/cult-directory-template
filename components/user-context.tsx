"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, Users, TrendingUp } from "lucide-react"
import { getViewerStats, getReturnVisitorMessage, isReturningVisitor } from "@/lib/user-interactions"

interface UserContextProps {
  toolName?: string
  showViewerStats?: boolean
  showReturnMessage?: boolean
}

export function UserContext({ toolName, showViewerStats = false, showReturnMessage = false }: UserContextProps) {
  const [isReturning, setIsReturning] = useState(false)
  const [viewerStats, setViewerStats] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    if (showReturnMessage) {
      setIsReturning(isReturningVisitor())
    }
    
    if (showViewerStats && toolName) {
      setViewerStats(getViewerStats(toolName))
    }
  }, [toolName, showViewerStats, showReturnMessage])

  if (!mounted) return null

  return (
    <div className="space-y-3">
      {/* Return Visitor Message */}
      {isReturning && showReturnMessage && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-blue-700 dark:text-blue-300 font-medium">
                {getReturnVisitorMessage()}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Viewer Stats */}
      {viewerStats && showViewerStats && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
            <Eye className="w-3 h-3 ml-1" />
            {viewerStats.todayViews} شخص شاهد اليوم
          </Badge>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
            <Users className="w-3 h-3 ml-1" />
            {viewerStats.thisWeekViews} هذا الأسبوع
          </Badge>
        </div>
      )}
    </div>
  )
}

// Separate component for similar tools suggestions
export function SimilarToolsSuggestion({ currentTool }: { currentTool: string }) {
  const [similarTools, setSimilarTools] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stats = getViewerStats(currentTool)
    setSimilarTools(stats.similarTools)
  }, [currentTool])

  if (!mounted || similarTools.length === 0) return null

  return (
    <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
      <CardContent className="pt-4">
        <h4 className="font-medium mb-2 text-orange-800 dark:text-orange-200">
          المستخدمون الذين شاهدوا {currentTool} شاهدوا أيضاً:
        </h4>
        <div className="flex flex-wrap gap-2">
          {similarTools.map((tool, index) => (
            <Badge key={index} variant="outline" className="text-orange-700 border-orange-300">
              {tool}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}