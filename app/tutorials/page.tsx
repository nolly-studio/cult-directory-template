import { Brain, BookOpen, ArrowLeft, Eye, Clock } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/cult/page-header"
import { PageGrid } from "@/components/cult/page-grid"
import { getTutorials, getTutorialFilters } from "../actions/tutorials"
import { getCourses, getCourseCategories, getCourseDifficulties } from "../actions/courses"
import { CourseCard } from "@/components/course-card"
import { NavSidebar } from "@/components/nav"
import { AdaptiveLayout } from "@/components/adaptive-layout"
import { FadeIn } from "@/components/cult/fade-in"

export const dynamic = "force-dynamic"

export default async function TutorialsPage({
  searchParams,
}: {
  searchParams: {
    category?: string
    difficulty?: string
  }
}) {
  const { category, difficulty } = searchParams
  const [tutorials, filters, courses, courseCategories, courseDifficulties] = await Promise.all([
    getTutorials(category, difficulty),
    getTutorialFilters(),
    getCourses(category, difficulty),
    getCourseCategories(),
    getCourseDifficulties()
  ])

  // Combine filters for sidebar
  const combinedFilters = {
    categories: [...new Set([...filters.categories, ...courseCategories])],
    difficulties: [...new Set([...filters.difficulties, ...courseDifficulties])]
  }

  const getDurationFromContent = (content: string) => {
    // Better Arabic word counting - handle both Arabic and English content
    const arabicWords = content.match(/[\u0600-\u06FF]+/g) || []
    const englishWords = content.match(/[a-zA-Z]+/g) || []
    const totalWords = arabicWords.length + englishWords.length
    // Arabic reading speed is typically 180-200 wpm, adjust accordingly
    const minutes = Math.ceil(totalWords / 180)
    return `${Math.max(1, minutes)} دقيقة`
  }

  const getContentExcerpt = (content: string) => {
    // Extract first meaningful paragraph, skip markdown headers
    const cleanContent = content
      .replace(/^#+ .+$/gm, '') // Remove headers
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold formatting
      .replace(/\*(.+?)\*/g, '$1') // Remove italic formatting
      .trim()
    
    // Get first 200 characters but try to end at a complete sentence
    const excerpt = cleanContent.substring(0, 200)
    const lastSentence = excerpt.lastIndexOf('.')
    const lastQuestion = excerpt.lastIndexOf('؟')
    const lastExclamation = excerpt.lastIndexOf('!')
    
    const cutoff = Math.max(lastSentence, lastQuestion, lastExclamation)
    return cutoff > 100 ? excerpt.substring(0, cutoff + 1) : excerpt + '...'
  }

  return (
    <>
      <NavSidebar
        categories={combinedFilters.categories}
        labels={combinedFilters.difficulties}
        tags={[]}
      />
      
      <AdaptiveLayout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <FadeIn>
            <PageHeader
              title="مركز التعلم"
              description="دورات وتعليمية شاملة لتعلم استخدام أدوات الذكاء الاصطناعي بالعربية"
              icon={BookOpen}
              backHref="/"
              stats={[
                { label: "دورات متاحة", value: courses.length },
                { label: "دروس تعليمية", value: tutorials.length },
                { label: "باللغة العربية", value: "100%" }
              ]}
            />

            {/* Courses Section */}
            {courses.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">الدورات المتاحة</h2>
                  <Badge variant="outline">{courses.length} دورة</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {courses.map((course) => (
                    <CourseCard 
                      key={course.id} 
                      course={course}
                      variant="default"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Tutorials Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">الدروس التعليمية</h2>
                <Badge variant="outline">{tutorials.length} درس</Badge>
              </div>
            </div>

            <PageGrid columns="3" className="mb-12">
        {tutorials.map((tutorial) => (
          <Card key={tutorial.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-3">
                <Badge 
                  variant={
                    tutorial.difficulty === 'مبتدئ' ? 'default' : 
                    tutorial.difficulty === 'متوسط' ? 'secondary' : 'destructive'
                  }
                  className="transition-all duration-300 hover:scale-105 text-xs"
                >
                  {tutorial.difficulty || 'مبتدئ'}
                </Badge>
                <Brain className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              </div>
              <CardTitle className="text-xl leading-tight text-right group-hover:text-primary transition-colors duration-300 mb-3 font-bold">
                {tutorial.title_ar}
              </CardTitle>
              <CardDescription className="text-base leading-relaxed line-clamp-3 text-justify text-muted-foreground/80">
                {getContentExcerpt(tutorial.content)}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary/60" />
                    <span className="font-medium">{getDurationFromContent(tutorial.content)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4 text-primary/60" />
                    <span className="font-medium">{tutorial.view_count || 0}</span>
                  </div>
                  <Badge variant="outline" className="text-xs font-medium border-primary/20 text-primary/80">
                    {tutorial.category}
                  </Badge>
                </div>
                <Button 
                  variant="default" 
                  size="sm" 
                  asChild 
                  className="transition-all duration-300 hover:scale-105 shadow-sm bg-primary hover:bg-primary/90"
                >
                  <Link href={`/tutorials/${tutorial.id}`} className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    ابدأ التعلم
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </PageGrid>

      {/* Call to Action */}
      <div className="text-center">
        <Card className="max-w-2xl mx-auto transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>المزيد قريباً!</CardTitle>
            <CardDescription>
              نعمل على إضافة المزيد من الدروس التعليمية المتقدمة. 
              اشترك ليصلك كل جديد.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="transition-all duration-300 hover:scale-105">
              <Link href="/submit">
                شارك اقتراحاتك للدروس
              </Link>
            </Button>
          </CardContent>
            </Card>
          </div>
          </FadeIn>
        </div>
      </AdaptiveLayout>
    </>
  )
}