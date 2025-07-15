import { NextRequest, NextResponse } from 'next/server'
import { markLessonCompleted } from '@/app/actions/courses'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('lessonId')
    
    if (!lessonId) {
      return NextResponse.json(
        { error: 'Lesson ID is required' },
        { status: 400 }
      )
    }

    const result = await markLessonCompleted(lessonId, 60) // Default 1 minute spent

    if (result.success) {
      // Redirect back to the lesson page with success
      const referer = request.headers.get('referer')
      if (referer) {
        return NextResponse.redirect(referer)
      }
      
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to mark lesson as completed' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in mark-lesson-complete API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}