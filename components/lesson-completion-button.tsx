"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { markLessonCompleted } from "@/app/actions/courses"

interface LessonCompletionButtonProps {
  lessonId: string
  isCompleted: boolean
  className?: string
}

export default function LessonCompletionButton({ 
  lessonId, 
  isCompleted, 
  className = "" 
}: LessonCompletionButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleMarkCompleted = async () => {
    if (isCompleted || isLoading) return

    setIsLoading(true)
    try {
      const result = await markLessonCompleted(lessonId, 60) // 1 minute default study time
      
      if (result.success) {
        // Refresh the page to update progress
        router.refresh()
      } else {
        console.error('Failed to mark lesson as completed:', result.error)
        alert('حدث خطأ في إكمال الدرس. يرجى المحاولة مرة أخرى.')
      }
    } catch (error) {
      console.error('Error marking lesson as completed:', error)
      alert('حدث خطأ في إكمال الدرس. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isCompleted) {
    return (
      <div className={`text-center ${className}`}>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <h3 className="font-semibold text-green-800 mb-1">تم إكمال الدرس بنجاح!</h3>
          <p className="text-sm text-green-600">
            أحسنت! يمكنك الآن الانتقال إلى الدرس التالي
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`text-center ${className}`}>
      <Button 
        onClick={handleMarkCompleted}
        disabled={isLoading}
        className="w-full sm:w-auto"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
            جاري الحفظ...
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4 ml-2" />
            تم إكمال الدرس
          </>
        )}
      </Button>
    </div>
  )
}