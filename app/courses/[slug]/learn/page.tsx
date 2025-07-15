import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, CheckCircle, Circle, Play, Book, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FadeIn } from "@/components/cult/fade-in"
import Breadcrumbs from "@/components/breadcrumbs"
import LessonCompletionButton from "@/components/lesson-completion-button"

import { getCourseWithUserProgress, getNextLesson, getNextLessonInChapter, getFirstLessonInChapter, getFirstLesson } from "@/app/actions/courses"
import { getDisplayTitle } from "@/lib/format-title"

export const dynamic = "force-dynamic"

interface LearnPageProps {
  params: {
    slug: string
  }
  searchParams: {
    lesson?: string
    chapter?: string
  }
}

export default async function LearnPage({ params, searchParams }: LearnPageProps) {
  const courseData = await getCourseWithUserProgress(params.slug)
  
  if (!courseData) {
    notFound()
  }

  const { userEnrollment, userProgress, chapters, ...course } = courseData

  // If user is not enrolled, redirect to course overview
  if (!userEnrollment) {
    redirect(`/courses/${params.slug}`)
  }

  // Get current lesson or find next lesson
  let currentLessonId = searchParams.lesson
  
  if (!currentLessonId) {
    // If chapter is specified, find first lesson in that chapter
    if (searchParams.chapter) {
      const firstLessonId = await getFirstLessonInChapter(searchParams.chapter)
      if (firstLessonId) {
        redirect(`/courses/${params.slug}/learn?lesson=${firstLessonId}`)
      }
    } else {
      // Otherwise, find next incomplete lesson globally (for initial entry)
      const nextLessonId = await getNextLesson(course.id)
      if (nextLessonId) {
        redirect(`/courses/${params.slug}/learn?lesson=${nextLessonId}`)
      } else {
        // If no next lesson found, redirect to first lesson in course
        const firstLessonId = await getFirstLesson(course.id)
        if (firstLessonId) {
          redirect(`/courses/${params.slug}/learn?lesson=${firstLessonId}`)
        }
      }
    }
    // If we still don't have a lesson, show not found
    notFound()
  }

  // Find current lesson details
  let currentLesson: any = null
  let currentChapter: any = null
  let lessonIndex = 0
  let totalLessons = 0

  for (const chapter of chapters || []) {
    for (const lesson of chapter.lessons || []) {
      totalLessons++
      if (lesson.id === currentLessonId) {
        currentLesson = lesson
        currentChapter = chapter
      }
      if (!currentLesson) {
        lessonIndex++
      }
    }
  }

  if (!currentLesson || !currentChapter) {
    notFound()
  }

  // Get lesson progress
  const lessonProgress = userProgress.find(p => p.lesson_id === currentLessonId)

  // Calculate overall progress
  const completedLessons = userProgress.filter(p => p.is_completed).length
  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  // Find previous and next lessons WITHIN THE CURRENT CHAPTER ONLY
  const currentChapterLessons = currentChapter.lessons || []
  const currentLessonChapterIndex = currentChapterLessons.findIndex((l: any) => l.id === currentLessonId)
  
  // Previous and next lessons stay within the same chapter
  const prevLesson = currentLessonChapterIndex > 0 ? {
    ...currentChapterLessons[currentLessonChapterIndex - 1],
    chapter: currentChapter
  } : null
  
  const nextLesson = currentLessonChapterIndex < currentChapterLessons.length - 1 ? {
    ...currentChapterLessons[currentLessonChapterIndex + 1], 
    chapter: currentChapter
  } : null

  // Calculate chapter progress
  const currentChapterProgress = currentChapterLessons.length > 0 
    ? userProgress.filter((p: any) => 
        currentChapterLessons.some((lesson: any) => lesson.id === p.lesson_id) && p.is_completed
      ).length / currentChapterLessons.length * 100
    : 0

  // Get display titles
  const displayTitle = getDisplayTitle(course)

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header Navigation */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { label: "الدورات", href: "/tutorials" },
              { 
                label: displayTitle.primary, 
                labelEn: displayTitle.secondary,
                href: `/courses/${params.slug}`
              },
              { 
                label: "التعلم",
                href: `/courses/${params.slug}/learn`
              },
              { 
                label: currentLesson.title_ar,
                current: true 
              }
            ]}
            className="mb-2"
          />
          
          <div className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">
                {currentChapter.title_ar} • الدرس {lessonIndex + 1} من {totalLessons}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Chapter Progress - Always visible */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground truncate">
                    الفصل: {Math.round(currentChapterProgress)}%
                  </span>
                  <Progress value={currentChapterProgress} className="w-12 sm:w-16" />
                </div>
                {/* Overall Progress - Hidden on very small screens */}
                <div className="hidden xs:flex items-center gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground truncate">
                    الإجمالي: {Math.round(overallProgress)}%
                  </span>
                  <Progress value={overallProgress} className="w-12 sm:w-16" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Move to right for RTL */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24 space-y-4">
              {/* Course Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">التقدم العام</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">الدروس المكتملة</span>
                      <span className="text-sm font-medium">{completedLessons} من {totalLessons}</span>
                    </div>
                    <Progress value={overallProgress} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">التقدم</span>
                      <span className="text-sm">
                        {Math.round(overallProgress)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Outline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">محتوى الدورة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {chapters?.map((chapter: any) => (
                    <div key={chapter.id} className="space-y-2">
                      <h4 className="font-medium text-sm">{chapter.title_ar}</h4>
                      <div className="space-y-1">
                        {chapter.lessons?.map((lesson: any) => {
                          const lessonProg = userProgress.find(p => p.lesson_id === lesson.id)
                          const isCurrentLesson = lesson.id === currentLessonId
                          
                          return (
                            <Link 
                              key={lesson.id}
                              href={`/courses/${params.slug}/learn?lesson=${lesson.id}`}
                              className={`flex items-center justify-between p-2 rounded-md transition-colors ${
                                isCurrentLesson 
                                  ? 'bg-primary/10 border border-primary/20' 
                                  : 'hover:bg-muted/50'
                              }`}
                            >
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span>
                                  {lesson.video_duration_seconds 
                                    ? Math.ceil(lesson.video_duration_seconds / 60) 
                                    : (lesson.estimated_reading_time || 5)
                                  }د
                                </span>
                                {lesson.lesson_type === 'video' ? (
                                  <Play className="h-3 w-3" />
                                ) : (
                                  <Book className="h-3 w-3" />
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{lesson.title_ar}</span>
                                <div className={`h-4 w-4 rounded-full flex items-center justify-center ${
                                  lessonProg?.is_completed 
                                    ? 'bg-green-100' 
                                    : 'bg-muted'
                                }`}>
                                  {lessonProg?.is_completed ? (
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                  ) : (
                                    <Circle className="h-3 w-3 text-muted-foreground" />
                                  )}
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <FadeIn>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{currentLesson.title_ar}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {currentChapter.title_ar}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {lessonProgress?.is_completed && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 ml-1" />
                          مكتمل
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {currentLesson.lesson_type === 'video' ? 'فيديو' : 'قراءة'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Simple Lesson Content */}
                  <div className="space-y-6">
                    {/* Video Player (if video lesson) */}
                    {currentLesson.lesson_type === 'video' && currentLesson.video_url && (
                      <Card>
                        <CardContent className="p-0">
                          <video
                            className="w-full aspect-video bg-black rounded-t-lg"
                            src={currentLesson.video_url}
                            controls
                          />
                        </CardContent>
                      </Card>
                    )}

                    {/* Progress Indicator */}
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">تقدم الدرس</span>
                            {lessonProgress?.is_completed && (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 ml-1" />
                                مكتمل
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {lessonProgress?.is_completed ? '100' : '0'}%
                          </span>
                        </div>
                        <Progress value={lessonProgress?.is_completed ? 100 : 0} className="h-2" />
                      </CardContent>
                    </Card>

                    {/* Lesson Content */}
                    <Card>
                      <CardContent className="pt-6">
                        <div className="prose prose-slate max-w-none">
                          <div dangerouslySetInnerHTML={{ __html: currentLesson.content_ar || 'محتوى الدرس' }} />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Lesson Completion */}
                    <Card>
                      <CardContent className="pt-6">
                        <LessonCompletionButton
                          lessonId={currentLesson.id}
                          isCompleted={lessonProgress?.is_completed || false}
                        />
                      </CardContent>
                    </Card>

                    {/* Chapter Completion Celebration */}
                    {currentChapterProgress === 100 && (
                      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                        <CardContent className="pt-6">
                          <div className="text-center space-y-4">
                            <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto flex items-center justify-center">
                              <span className="text-2xl">🎉</span>
                            </div>
                            <h3 className="text-xl font-bold text-blue-800">
                              تهانينا! أكملت الفصل "{currentChapter.title_ar}"
                            </h3>
                            <p className="text-blue-600">
                              لقد أنجزت جميع دروس هذا الفصل بنجاح. يمكنك الآن:
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                              <Button asChild>
                                <Link href={`/courses/${params.slug}`}>
                                  عودة إلى الدورة
                                </Link>
                              </Button>
                              <Button variant="outline" asChild>
                                <Link href={`/courses/${params.slug}/learn`}>
                                  الفصل التالي
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between mt-6 gap-3">
                <div className="flex justify-center sm:justify-start">
                  {prevLesson && (
                    <Button variant="outline" asChild className="w-full sm:w-auto">
                      <Link href={`/courses/${params.slug}/learn?lesson=${prevLesson.id}`}>
                        <ChevronRight className="h-4 w-4 ml-2" />
                        الدرس السابق
                      </Link>
                    </Button>
                  )}
                </div>
                <div className="flex justify-center sm:justify-end">
                  {nextLesson && (
                    <Button asChild size="lg" className="w-full sm:w-auto">
                      <Link href={`/courses/${params.slug}/learn?lesson=${nextLesson.id}`}>
                        الدرس التالي
                        <ChevronLeft className="h-4 w-4 mr-2" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  )
}