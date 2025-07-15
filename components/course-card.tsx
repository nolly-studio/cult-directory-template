"use client"

import Link from "next/link"
import { Clock, Users, BookOpen, Play, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface CourseCardProps {
  course: {
    id: string
    title_ar: string
    description_ar: string
    slug: string
    difficulty_level: 'مبتدئ' | 'متوسط' | 'متقدم'
    price: number
    currency: string
    instructor_name: string
    instructor_avatar?: string
    thumbnail_url?: string
    enrollment_count: number
    total_duration_minutes: number
    lesson_count: number
    category: string
    tags: string[]
  }
  progress?: number // 0-100 for enrolled users
  isEnrolled?: boolean
  variant?: 'default' | 'compact' | 'featured'
  showProgress?: boolean
}

export function CourseCard({ 
  course, 
  progress = 0, 
  isEnrolled = false, 
  variant = 'default',
  showProgress = false 
}: CourseCardProps) {
  const difficultyConfig = {
    'مبتدئ': { color: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
    'متوسط': { color: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500' },
    'متقدم': { color: 'bg-purple-100 text-purple-800', dot: 'bg-purple-500' }
  }

  const config = difficultyConfig[course.difficulty_level]
  const durationHours = Math.round(course.total_duration_minutes / 60)
  const isCompact = variant === 'compact'
  const isFeatured = variant === 'featured'

  return (
    <Card 
      className={cn(
        "group hover:shadow-xl transition-all duration-300 cursor-pointer",
        isFeatured && "border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent",
        isCompact && "hover:shadow-lg"
      )}
    >
      <Link href={`/courses/${course.slug}`}>
        {/* Thumbnail */}
        {course.thumbnail_url && !isCompact && (
          <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
            <img 
              src={course.thumbnail_url} 
              alt={course.title_ar}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute bottom-3 right-3">
              <div className="bg-black/60 backdrop-blur-sm rounded-full p-2">
                <Play className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        )}

        <CardHeader className={cn("pb-4", isCompact && "pb-2")}>
          <div className="flex items-center justify-between mb-2">
            <Badge className={`${config.color} text-xs`}>
              {course.price === 0 ? 'مجاني' : `${course.price} ${course.currency}`}
            </Badge>
            <div className="text-xs text-muted-foreground">{course.difficulty_level}</div>
          </div>
          
          {isFeatured && (
            <Badge variant="secondary" className="w-fit mb-2 bg-primary/10 text-primary">
              مميز
            </Badge>
          )}
          
          <CardTitle className={cn(
            "font-bold group-hover:text-primary transition-colors",
            isCompact ? "text-lg" : "text-xl"
          )}>
            {course.title_ar}
          </CardTitle>
          
          <CardDescription className={cn(
            "leading-relaxed",
            isCompact ? "text-sm line-clamp-2" : "text-base line-clamp-3"
          )}>
            {course.description_ar}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Progress bar for enrolled users */}
          {showProgress && isEnrolled && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">التقدم</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Course stats */}
          <div className={cn(
            "flex items-center gap-4 mb-4 text-sm text-muted-foreground",
            isCompact && "gap-3 text-xs"
          )}>
            <div className="flex items-center gap-1.5">
              <div className={`h-2 w-2 ${config.dot} rounded-full`}></div>
              <Clock className="h-4 w-4" />
              <span>
                {durationHours > 0 ? `${durationHours} ساعة` : `${course.total_duration_minutes} دقيقة`}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>{course.lesson_count} درس</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>{course.enrollment_count}</span>
            </div>
          </div>

          {/* Tags */}
          {!isCompact && course.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {course.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Instructor */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {course.instructor_avatar ? (
                <img 
                  src={course.instructor_avatar} 
                  alt={course.instructor_name}
                  className="h-6 w-6 rounded-full"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-xs text-white font-bold">
                    {(course.instructor_name || 'مدرس').charAt(0)}
                  </span>
                </div>
              )}
              <span className="text-sm text-muted-foreground">{course.instructor_name || 'مدرس غير محدد'}</span>
            </div>
            
            <Button 
              size={isCompact ? "sm" : "default"} 
              className="group-hover:scale-105 transition-transform"
            >
              {isEnrolled ? (
                <>
                  {progress === 100 ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      مكتمل
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      متابعة
                    </>
                  )}
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  ابدأ التعلم
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}