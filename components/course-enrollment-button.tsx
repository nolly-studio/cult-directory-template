"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Play, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { enrollInCourse } from "@/app/actions/courses"

interface CourseEnrollmentButtonProps {
  courseId: string
  courseSlug: string
  isEnrolled: boolean
  nextLessonId: string | null
  isLarge?: boolean
}

export default function CourseEnrollmentButton({
  courseId,
  courseSlug,
  isEnrolled,
  nextLessonId,
  isLarge = false
}: CourseEnrollmentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleEnrollment = async () => {
    if (isEnrolled) {
      // Navigate to learning page
      if (nextLessonId) {
        router.push(`/courses/${courseSlug}/learn?lesson=${nextLessonId}`)
      } else {
        router.push(`/courses/${courseSlug}/learn`)
      }
      return
    }

    // Enroll in course
    setIsLoading(true)
    try {
      const result = await enrollInCourse(courseId)
      
      if (result.success) {
        // Refresh the page to update enrollment status
        router.refresh()
        // Navigate to learning page
        router.push(`/courses/${courseSlug}/learn`)
      } else {
        console.error('Failed to enroll:', result.error)
      }
    } catch (error) {
      console.error('Error enrolling:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleEnrollment}
      disabled={isLoading}
      size={isLarge ? "lg" : "default"}
      className={isLarge ? "px-8" : ""}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 ml-2 animate-spin" />
          جاري التسجيل...
        </>
      ) : (
        <>
          <Play className="h-4 w-4 ml-2" />
          {isEnrolled ? 'متابعة التعلم' : 'ابدأ الدورة الآن'}
        </>
      )}
    </Button>
  )
}