"use server"

import { createClient } from "@/db/supabase/server"

export interface Course {
  id: string
  title_ar: string
  title_en?: string
  slug: string
  description_ar: string
  description_en?: string
  difficulty_level: 'مبتدئ' | 'متوسط' | 'متقدم'
  duration_weeks: number
  price: number
  currency: string
  instructor_name: string
  instructor_bio?: string
  instructor_avatar?: string
  is_published: boolean
  featured: boolean
  category: string
  tags: string[]
  thumbnail_url?: string
  video_intro_url?: string
  prerequisites?: string[]
  learning_outcomes: string[]
  tools_covered: string[]
  created_at: string
  updated_at: string
  enrollment_count?: number
  rating?: number
  chapter_count?: number
  lesson_count?: number
}

export interface CourseWithStats extends Course {
  enrollment_count: number
  chapter_count: number
  lesson_count: number
  total_duration_minutes: number
  chapters?: Array<{
    id: string
    title_ar: string
    description_ar?: string
    chapter_order: number
    lessons?: Array<{
      id: string
      title_ar: string
      content_ar: string
      lesson_order: number
      estimated_reading_time: number
      video_duration_seconds?: number
      lesson_type: string
      video_url?: string
    }>
  }>
}

export async function getCourses(
  category?: string,
  difficulty?: string,
  featured_only = false
): Promise<CourseWithStats[]> {
  try {
    const supabase = await createClient()
    
    let query = supabase
      .from('courses')
      .select(`
        *,
        enrollment_count:user_enrollments(count),
        chapters:course_chapters(
          id,
          lessons:course_lessons(id, estimated_reading_time, video_duration_seconds)
        )
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
    
    if (category) {
      query = query.eq('category', category)
    }
    
    if (difficulty) {
      query = query.eq('difficulty_level', difficulty)
    }
    
    if (featured_only) {
      query = query.eq('featured', true)
    }
    
    const { data: courses, error } = await query
    
    if (error) {
      console.error('Error fetching courses:', error)
      return []
    }
    
    // Calculate stats for each course
    const coursesWithStats: CourseWithStats[] = courses?.map(course => {
      const chapters = course.chapters || []
      const chapter_count = chapters.length
      
      let lesson_count = 0
      let total_duration_minutes = 0
      
      chapters.forEach((chapter: any) => {
        const lessons = chapter.lessons || []
        lesson_count += lessons.length
        lessons.forEach((lesson: any) => {
          // Use estimated_reading_time for text content or convert video_duration_seconds to minutes
          const duration = lesson.video_duration_seconds 
            ? Math.ceil(lesson.video_duration_seconds / 60) 
            : (lesson.estimated_reading_time || 5)
          total_duration_minutes += duration
        })
      })
      
      return {
        ...course,
        instructor_name: course.instructor_name_ar || course.instructor_name_en || 'مدرس غير محدد',
        instructor_bio: course.instructor_bio_ar || course.instructor_bio_en,
        duration_weeks: Math.ceil((course.duration_hours || 0) / 40), // Convert hours to weeks
        enrollment_count: Array.isArray(course.enrollment_count) ? course.enrollment_count.length : 0,
        chapter_count,
        lesson_count,
        total_duration_minutes,
        learning_outcomes: course.learning_outcomes ?? [],
        tools_covered: course.tools_covered ?? []
      }
    }) || []
    
    return coursesWithStats
  } catch (error) {
    console.error('Error in getCourses:', error)
    return []
  }
}

export async function getFeaturedCourses(): Promise<CourseWithStats[]> {
  return getCourses(undefined, undefined, true)
}

export async function getCourseCategories(): Promise<string[]> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('courses')
      .select('category')
      .eq('is_published', true)
    
    if (error) {
      console.error('Error fetching course categories:', error)
      return []
    }
    
    const categories = [...new Set(data?.map(course => course.category).filter(Boolean))]
    return categories
  } catch (error) {
    console.error('Error in getCourseCategories:', error)
    return []
  }
}

export async function getCourseDifficulties(): Promise<string[]> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('courses')
      .select('difficulty_level')
      .eq('is_published', true)
    
    if (error) {
      console.error('Error fetching course difficulties:', error)
      return []
    }
    
    const difficulties = [...new Set(data?.map(course => course.difficulty_level).filter(Boolean))]
    return difficulties
  } catch (error) {
    console.error('Error in getCourseDifficulties:', error)
    return []
  }
}

export async function getCourseBySlugWithProgress(slug: string): Promise<CourseWithStats | null> {
  try {
    const supabase = await createClient()
    
    const { data: course, error } = await supabase
      .from('courses')
      .select(`
        id,
        title_ar,
        title_en,
        slug,
        description_ar,
        description_en,
        difficulty_level,
        duration_hours,
        price,
        currency,
        instructor_name_ar,
        instructor_name_en,
        instructor_bio_ar,
        instructor_bio_en,
        is_published,
        featured,
        is_featured,
        category,
        tags,
        thumbnail_url,
        trailer_video_url,
        enrollment_count,
        rating,
        review_count,
        status,
        is_free,
        language_support,
        meta_description_ar,
        meta_description_en,
        created_at,
        updated_at,
        published_at,
        learning_outcomes,
        tools_covered,
        chapters:course_chapters(
          id,
          title_ar,
          description_ar,
          chapter_order,
          duration_minutes,
          is_published,
          lessons:course_lessons(
            id,
            title_ar,
            content_ar,
            lesson_order,
            estimated_reading_time,
            video_duration_seconds,
            lesson_type,
            video_url,
            is_published,
            is_free
          )
        )
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
    
    if (error) {
      console.error('Error fetching course:', error)
      return null
    }
    
    if (!course) return null
    
    // Calculate stats
    const chapters = course.chapters || []
    const chapter_count = chapters.length
    
    let lesson_count = 0
    let total_duration_minutes = 0
    
    chapters.forEach((chapter: any) => {
      const lessons = chapter.lessons || []
      lesson_count += lessons.length
      lessons.forEach((lesson: any) => {
        // Use estimated_reading_time for text content or convert video_duration_seconds to minutes
        const duration = lesson.video_duration_seconds 
          ? Math.ceil(lesson.video_duration_seconds / 60) 
          : (lesson.estimated_reading_time || 5)
        total_duration_minutes += duration
      })
    })
    
    return {
      ...course,
      instructor_name: course.instructor_name_ar || course.instructor_name_en || 'غير محدد',
      instructor_bio: course.instructor_bio_ar || course.instructor_bio_en,
      duration_weeks: Math.ceil((course.duration_hours || 0) / 40), // Convert hours to weeks (40 hours per week)
      enrollment_count: course.enrollment_count || 0,
      chapter_count,
      lesson_count,
      total_duration_minutes,
      learning_outcomes: course.learning_outcomes ?? [],
      tools_covered: course.tools_covered ?? []
    }
  } catch (error) {
    console.error('Error in getCourseBySlug:', error)
    return null
  }
}

// Lesson Progress Tracking Functions

export interface LessonProgress {
  lesson_id: string
  chapter_id: string
  is_completed: boolean
  progress_percentage: number
  completion_date: string | null
  time_spent_seconds: number
  last_accessed_at: string
}

export interface UserEnrollment {
  id: string
  user_id: string
  course_id: string
  progress_percentage: number
  is_active: boolean
  enrollment_date: string
  completion_date: string | null
  current_lesson_id: string | null
  total_study_time_minutes: number
}

// Simple getCourseBySlug function (redirects to the more detailed version)
export async function getCourseBySlug(slug: string): Promise<CourseWithStats | null> {
  return getCourseBySlugWithProgress(slug)
}

export async function getCourseWithUserProgress(slug: string): Promise<CourseWithStats & { 
  userEnrollment: UserEnrollment | null,
  userProgress: LessonProgress[]
} | null> {
  try {
    const supabase = await createClient()
    
    // Get course data
    const course = await getCourseBySlug(slug)
    if (!course) return null
    
    // Get user enrollment
    const { data: enrollment } = await supabase
      .from('user_enrollments')
      .select('*')
      .eq('course_id', course.id)
      .eq('status', 'active')
      .single()
    
    // Get user progress for all lessons using our new function
    const { data: progressData } = await supabase
      .rpc('get_user_lesson_progress', { p_course_id: course.id })
    
    // Convert to expected format
    const userProgress: LessonProgress[] = (progressData || []).map((item: any) => ({
      lesson_id: item.lesson_id,
      chapter_id: item.chapter_id,
      is_completed: item.is_completed,
      progress_percentage: item.is_completed ? 100 : 0,
      completion_date: item.completed_at,
      time_spent_seconds: item.time_spent_seconds,
      last_accessed_at: item.completed_at || null
    }))
    
    return {
      ...course,
      userEnrollment: enrollment,
      userProgress
    }
  } catch (error) {
    console.error('Error in getCourseWithUserProgress:', error)
    return null
  }
}

export async function enrollInCourse(courseId: string): Promise<{ success: boolean; enrollmentId?: string; error?: string }> {
  try {
    const supabase = await createClient()
    
    // Use our new auto-enrollment function
    const { data, error } = await supabase
      .rpc('auto_enroll_free_course', { p_course_id: courseId })
    
    if (error) {
      console.error('Error enrolling in course:', error)
      return { success: false, error: error.message }
    }
    
    // Check if enrollment was successful
    if (data?.success) {
      return { success: true, enrollmentId: courseId }
    } else {
      return { success: false, error: data?.message || 'Course requires payment' }
    }
  } catch (error) {
    console.error('Error in enrollInCourse:', error)
    return { success: false, error: 'Failed to enroll in course' }
  }
}

export async function markLessonCompleted(lessonId: string, timeSpent: number = 0): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    
    // First get the course_id for this lesson
    const { data: lessonData } = await supabase
      .from('course_lessons')
      .select('chapter_id, course_chapters!inner(course_id)')
      .eq('id', lessonId)
      .single()
    
    if (!lessonData) {
      return { success: false, error: 'Lesson not found' }
    }
    
    const courseId = (lessonData.course_chapters as any).course_id
    
    // Use our new mark lesson complete function
    const { data, error } = await supabase
      .rpc('mark_lesson_complete', { 
        p_course_id: courseId,
        p_lesson_id: lessonId,
        p_time_spent: timeSpent
      })
    
    if (error) {
      console.error('Error marking lesson as completed:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error in markLessonCompleted:', error)
    return { success: false, error: 'Failed to mark lesson as completed' }
  }
}

export async function trackLessonAccess(lessonId: string, timeSpent: number = 0, progress: number = 0): Promise<{ success: boolean; error?: string }> {
  try {
    // For now, we'll just track lesson access as lesson completion if progress is 100%
    if (progress >= 100) {
      return await markLessonCompleted(lessonId, timeSpent)
    }
    
    // For partial progress, we could add a separate tracking mechanism later
    // For now, just return success without doing anything
    return { success: true }
  } catch (error) {
    console.error('Error in trackLessonAccess:', error)
    return { success: false, error: 'Failed to track lesson access' }
  }
}

// Get course progress for current user
export async function getCourseProgress(courseId: string): Promise<any> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .rpc('get_course_progress', { p_course_id: courseId })
    
    if (error) {
      console.error('Error getting course progress:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error in getCourseProgress:', error)
    return null
  }
}

export async function getNextLesson(courseId: string): Promise<string | null> {
  try {
    const supabase = await createClient()
    
    // Get user's completed lessons
    const { data: progressData } = await supabase
      .rpc('get_user_lesson_progress', { p_course_id: courseId })
    
    if (!progressData) return null
    
    // Find the first incomplete lesson
    const incompleteLessons = progressData.filter((lesson: any) => !lesson.is_completed)
    if (incompleteLessons.length > 0) {
      return incompleteLessons[0].lesson_id
    }
    
    // If all lessons are complete, return null
    return null
  } catch (error) {
    console.error('Error in getNextLesson:', error)
    return null
  }
}

// NEW: Chapter-aware next lesson function
export async function getNextLessonInChapter(courseId: string, chapterId: string): Promise<string | null> {
  try {
    const supabase = await createClient()
    
    // Get user's completed lessons for this specific chapter
    const { data: progressData } = await supabase
      .rpc('get_user_lesson_progress', { p_course_id: courseId })
    
    if (!progressData) return null
    
    // Filter for lessons in this chapter only
    const chapterLessons = progressData.filter((lesson: any) => lesson.chapter_id === chapterId)
    
    // Find the first incomplete lesson in this chapter
    const incompleteLessons = chapterLessons.filter((lesson: any) => !lesson.is_completed)
    if (incompleteLessons.length > 0) {
      return incompleteLessons[0].lesson_id
    }
    
    // If all lessons in this chapter are complete, return null (stay in chapter)
    return null
  } catch (error) {
    console.error('Error in getNextLessonInChapter:', error)
    return null
  }
}

// NEW: Get first lesson of a chapter
export async function getFirstLessonInChapter(chapterId: string): Promise<string | null> {
  try {
    const supabase = await createClient()
    
    const { data: lessons } = await supabase
      .from('course_lessons')
      .select('id')
      .eq('chapter_id', chapterId)
      .eq('is_published', true)
      .order('lesson_order', { ascending: true })
      .limit(1)
    
    return lessons && lessons.length > 0 ? lessons[0].id : null
  } catch (error) {
    console.error('Error in getFirstLessonInChapter:', error)
    return null
  }
}

// NEW: Get first lesson of entire course
export async function getFirstLesson(courseId: string): Promise<string | null> {
  try {
    const supabase = await createClient()
    
    const { data: lessons } = await supabase
      .from('course_lessons')
      .select('id, course_chapters!inner(course_id, chapter_order)')
      .eq('course_chapters.course_id', courseId)
      .eq('is_published', true)
      .eq('course_chapters.is_published', true)
      .order('course_chapters.chapter_order', { ascending: true })
      .order('lesson_order', { ascending: true })
      .limit(1)
    
    return lessons && lessons.length > 0 ? lessons[0].id : null
  } catch (error) {
    console.error('Error in getFirstLesson:', error)
    return null
  }
}