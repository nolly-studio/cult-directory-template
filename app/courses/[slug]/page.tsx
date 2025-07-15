import { Suspense } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  BookOpen, 
  CheckCircle, 
  Play,
  Star,
  Download,
  Share2,
  Calendar,
  Award,
  Globe,
  Target,
  AlertCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FadeIn } from "@/components/cult/fade-in"
import CourseEnrollmentButton from "@/components/course-enrollment-button"
import CourseThumbnail from "@/components/course-thumbnail"
import Breadcrumbs from "@/components/breadcrumbs"
import ShareButton from "@/components/share-button"

import { getCourseBySlug, getCourseWithUserProgress, enrollInCourse, getNextLesson } from "@/app/actions/courses"
import { getDisplayTitle } from "@/lib/format-title"

export const dynamic = "force-dynamic"

interface CoursePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CoursePageProps) {
  const course = await getCourseBySlug(params.slug)
  
  if (!course) {
    return {
      title: 'دورة غير موجودة',
      description: 'الدورة المطلوبة غير موجودة'
    }
  }

  const displayTitle = getDisplayTitle(course)
  
  return {
    title: `${displayTitle.primary} | دورات الذكاء الاصطناعي العربية`,
    description: course.description_ar,
    keywords: course.tags?.join(', ') || 'ذكاء اصطناعي, دورات, تعلم, عربي',
    authors: [{ name: course.instructor_name }],
    openGraph: {
      title: displayTitle.primary,
      description: course.description_ar,
      type: 'website',
      images: course.thumbnail_url ? [
        {
          url: course.thumbnail_url,
          width: 1200,
          height: 630,
          alt: course.title_ar,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: displayTitle.primary,
      description: course.description_ar,
      images: course.thumbnail_url ? [course.thumbnail_url] : [],
    },
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const courseData = await getCourseWithUserProgress(params.slug)
  
  if (!courseData) {
    notFound()
  }

  const { userEnrollment, userProgress, ...course } = courseData
  
  const difficultyConfig = {
    'مبتدئ': { color: 'bg-green-100 text-green-800', gradient: 'from-green-50 to-green-100' },
    'متوسط': { color: 'bg-blue-100 text-blue-800', gradient: 'from-blue-50 to-blue-100' },
    'متقدم': { color: 'bg-purple-100 text-purple-800', gradient: 'from-purple-50 to-purple-100' }
  }

  const config = difficultyConfig[course.difficulty_level]
  const durationHours = Math.round(course.total_duration_minutes / 60)
  
  // Real enrollment and progress data
  const isEnrolled = !!userEnrollment
  const progress = userEnrollment?.progress_percentage || 0
  
  // Get next lesson for the continue button
  const nextLessonId = await getNextLesson(course.id)
  
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
                current: true 
              }
            ]}
            className="mb-3"
          />
          
          {/* Header Content */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0 flex-1 text-right">
              <h1 className="text-xl sm:text-2xl font-bold leading-tight text-right">
                <span className="block">{displayTitle.primary}</span>
                {displayTitle.secondary && (
                  <span className="block text-base sm:text-lg text-muted-foreground font-normal mt-1">
                    {displayTitle.secondary}
                  </span>
                )}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 text-right">{course.instructor_name || 'مدرس غير محدد'}</p>
            </div>
            <div className="flex items-center gap-2 sm:flex-shrink-0">
              <ShareButton
                url={`/courses/${params.slug}`}
                title={displayTitle.primary}
                description={course.description_ar}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl" dir="rtl">
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar - Position for RTL */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="sticky top-24 space-y-6">
                {/* Enrollment Card */}
                <Card>
                  <CardContent className="pt-6" dir="rtl">
                    {isEnrolled && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2 text-right">
                          <span className="text-sm text-muted-foreground">{progress}%</span>
                          <span className="font-medium">التقدم</span>
                        </div>
                        <Progress value={progress} className="h-3" />
                        <p className="text-xs text-muted-foreground mt-1 text-right">
                          {Math.floor((userEnrollment?.total_study_time_minutes || 0))} دقيقة من الدراسة
                        </p>
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <CourseEnrollmentButton
                        courseId={course.id}
                        courseSlug={params.slug}
                        isEnrolled={isEnrolled}
                        nextLessonId={nextLessonId}
                        isLarge={true}
                      />
                    </div>
                    
                    <div className="space-y-2 text-center text-sm">
                      {course.price === 0 ? (
                        <div className="text-green-600 font-medium text-center">
                          دورة مجانية بالكامل
                        </div>
                      ) : (
                        <div className="text-muted-foreground text-center">
                          {course.price} {course.currency} فقط
                        </div>
                      )}
                      {isEnrolled && (
                        <div className="text-green-600 text-xs text-center">
                          ✓ مُسجل في الدورة
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Course Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-right">معلومات الدورة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4" dir="rtl">
                    <div className="flex justify-between items-center text-right">
                      <Badge className={config.color}>{course.difficulty_level}</Badge>
                      <span className="text-muted-foreground">المستوى</span>
                    </div>
                    <div className="flex justify-between items-center text-right">
                      <span className="font-medium">{course.category}</span>
                      <span className="text-muted-foreground">الفئة</span>
                    </div>
                    <div className="flex justify-between items-center text-right">
                      <span className="font-medium">
                        {durationHours > 0 ? `${durationHours} ساعة` : `${course.total_duration_minutes} دقيقة`}
                      </span>
                      <span className="text-muted-foreground">المدة</span>
                    </div>
                    <div className="flex justify-between items-center text-right">
                      <span className="font-medium">{course.lesson_count}</span>
                      <span className="text-muted-foreground">عدد الدروس</span>
                    </div>
                    <div className="flex justify-between items-center text-right">
                      <span className="font-medium">{course.enrollment_count}</span>
                      <span className="text-muted-foreground">الطلاب</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                {course.tags.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-right">المواضيع</CardTitle>
                    </CardHeader>
                    <CardContent dir="rtl">
                      <div className="flex flex-wrap gap-2 justify-start">
                        {course.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              {/* Course Hero */}
              <div className={`bg-gradient-to-r ${config.gradient} dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden mb-8`}>
                {/* Course Image */}
                <div className="aspect-video relative">
                  <CourseThumbnail 
                    src={course.thumbnail_url} 
                    alt={course.title_ar}
                    category={course.category}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 right-4">
                    <Badge className="bg-white/20 text-white border-white/30">
                      {course.price === 0 ? 'مجاني' : `${course.price} ${course.currency}`}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2 text-right">{course.title_ar}</h1>
                      <p className="text-lg text-muted-foreground leading-relaxed text-right">
                        {course.description_ar}
                      </p>
                    </div>
                  </div>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                      <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <div className="font-semibold text-sm">
                        {durationHours > 0 ? `${durationHours} ساعة` : `${course.total_duration_minutes} دقيقة`}
                      </div>
                      <div className="text-xs text-muted-foreground">المدة</div>
                    </div>
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                      <BookOpen className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <div className="font-semibold text-sm">{course.lesson_count}</div>
                      <div className="text-xs text-muted-foreground">درس</div>
                    </div>
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                      <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <div className="font-semibold text-sm">{course.enrollment_count}</div>
                      <div className="text-xs text-muted-foreground">طالب</div>
                    </div>
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                      <Star className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <div className="font-semibold text-sm">{course.difficulty_level}</div>
                      <div className="text-xs text-muted-foreground">المستوى</div>
                    </div>
                  </div>

                  {/* Additional Metadata */}
                  <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">آخر تحديث: {new Date(course.updated_at).toLocaleDateString('ar-SA')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4 flex-shrink-0" />
                      <span>اللغة: العربية</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 flex-shrink-0" />
                      <span>شهادة إتمام</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="flex justify-center">
                    <CourseEnrollmentButton
                      courseId={course.id}
                      courseSlug={params.slug}
                      isEnrolled={isEnrolled}
                      nextLessonId={nextLessonId}
                      isLarge={true}
                    />
                  </div>
                </div>
              </div>

              {/* Course Content Tabs */}
              <Tabs defaultValue="curriculum" className="w-full" dir="rtl">
                <TabsList className="flex w-full justify-start" dir="rtl" style={{ direction: 'rtl' }}>
                  <TabsTrigger value="curriculum" className="text-right">المنهج</TabsTrigger>
                  <TabsTrigger value="about" className="text-right">حول الدورة</TabsTrigger>
                  <TabsTrigger value="instructor" className="text-right">المدرس</TabsTrigger>
                </TabsList>

                <TabsContent value="curriculum" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-right">منهج الدورة</CardTitle>
                      <CardDescription className="text-right">
                        {course.chapter_count} فصول • {course.lesson_count} دروس
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4" dir="rtl">
                      {course.chapters?.map((chapter: any, chapterIndex: number) => {
                        const chapterId = `chapter-${chapter.id}`
                        return (
                          <details key={chapter.id} className="border rounded-lg" open>
                            <summary className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors list-none" dir="rtl">
                              <div className="flex items-center justify-between w-full">
                                <span className="text-sm text-muted-foreground">
                                  {chapter.lessons?.length || 0} دروس
                                </span>
                                <h4 className="font-bold text-lg text-primary mixed-content-rtl chapter-title-rtl" dir="rtl" style={{ direction: 'rtl', unicodeBidi: 'normal' }}>
                                  الفصل {chapterIndex + 1}: {chapter.title_ar}
                                </h4>
                              </div>
                              {chapter.description_ar && (
                                <p className="text-sm text-muted-foreground mt-2 arabic-text">
                                  {chapter.description_ar}
                                </p>
                              )}
                            </summary>
                            <div className="divide-y">
                              {chapter.lessons?.map((lesson: any, lessonIndex: number) => {
                                const lessonProgress = userProgress.find(p => p.lesson_id === lesson.id)
                                const isCompleted = lessonProgress?.is_completed || false
                                
                                const LessonItem = ({ children }: { children: React.ReactNode }) => {
                                  if (isEnrolled) {
                                    return (
                                      <Link 
                                        href={`/courses/${params.slug}/learn?lesson=${lesson.id}`}
                                        className="block p-4 hover:bg-muted/20 transition-colors cursor-pointer"
                                      >
                                        {children}
                                      </Link>
                                    )
                                  }
                                  return (
                                    <div className="p-4 hover:bg-muted/20 transition-colors">
                                      {children}
                                    </div>
                                  )
                                }
                                
                                return (
                                  <LessonItem key={lesson.id}>
                                    <div className="flex items-center justify-between w-full" dir="rtl">
                                      {/* Icon - Rightmost (first in RTL) */}
                                      <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        isCompleted 
                                          ? 'bg-green-100 text-green-600' 
                                          : lesson.lesson_type === 'video'
                                          ? 'bg-red-100 text-red-600'
                                          : 'bg-blue-100 text-blue-600'
                                      }`}>
                                        {isCompleted ? (
                                          <CheckCircle className="h-4 w-4" />
                                        ) : lesson.lesson_type === 'video' ? (
                                          <Play className="h-4 w-4" />
                                        ) : (
                                          <BookOpen className="h-4 w-4" />
                                        )}
                                      </div>
                                      
                                      {/* Content - Center */}
                                      <div className="flex-1 mx-3 arabic-text">
                                        <h5 className="font-medium arabic-text">{lesson.title_ar}</h5>
                                        {lesson.content_ar && (
                                          <p className="text-sm text-muted-foreground arabic-text">
                                            {lesson.content_ar.slice(0, 100)}...
                                          </p>
                                        )}
                                      </div>
                                      
                                      {/* Duration - Leftmost (last in RTL) */}
                                      <div className="text-sm text-muted-foreground flex-shrink-0">
                                        {lesson.video_duration_seconds 
                                          ? Math.ceil(lesson.video_duration_seconds / 60) 
                                          : (lesson.estimated_reading_time || 5)
                                        } دقيقة
                                      </div>
                                    </div>
                                  </LessonItem>
                                )
                              })}
                            </div>
                          </details>
                        )
                      })}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="about" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>حول هذه الدورة</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Target className="h-5 w-5 text-primary" />
                          ماذا ستتعلم
                        </h4>
                        <ul className="space-y-3">
                          {course.learning_outcomes.map((outcome: string, index: number) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="text-sm leading-relaxed">{outcome}</span>
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            </li>
                          ))}
                        </ul>
                      </div>

                      {course.prerequisites && course.prerequisites.length > 0 ? (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                            المتطلبات المسبقة
                          </h4>
                          <ul className="space-y-3">
                            {course.prerequisites.map((req: string, index: number) => (
                              <li key={index} className="flex items-start gap-3">
                                <span className="text-sm leading-relaxed">{req}</span>
                                <div className="h-2 w-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            المتطلبات
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            لا توجد متطلبات مسبقة - مناسب للمبتدئين
                          </p>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold mb-2 text-right">الأدوات المغطاة</h4>
                        <div className="flex flex-wrap gap-2 justify-start">
                          {course.tools_covered.map((tool: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="instructor" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-right">عن المدرس</CardTitle>
                    </CardHeader>
                    <CardContent dir="rtl">
                      <div className="flex items-start gap-4">
                        <div className="text-right flex-1">
                          <h4 className="font-semibold text-lg text-right">{course.instructor_name || 'مدرس غير محدد'}</h4>
                          {course.instructor_bio && (
                            <p className="text-muted-foreground mt-1 text-right">{course.instructor_bio}</p>
                          )}
                        </div>
                        {course.instructor_avatar ? (
                          <img 
                            src={course.instructor_avatar} 
                            alt={course.instructor_name || 'مدرس'}
                            className="h-16 w-16 rounded-full"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                            <span className="text-xl text-white font-bold">
                              {(course.instructor_name || 'مدرس').charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

          </div>
        </FadeIn>
      </div>
    </div>
  )
}