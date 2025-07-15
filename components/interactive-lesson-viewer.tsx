"use client"

import { useState, useEffect, useRef } from "react"
import { CheckCircle, Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { trackLessonAccess, markLessonCompleted } from "@/app/actions/courses"

interface InteractiveLessonViewerProps {
  lesson: {
    id: string
    title_ar: string
    content_ar: string
    lesson_type: string
    video_url?: string
    video_duration_seconds?: number
    estimated_reading_time?: number
  }
  courseId: string
  isCompleted: boolean
  progress: number
}

export default function InteractiveLessonViewer({ 
  lesson, 
  courseId, 
  isCompleted: initialCompleted,
  progress: initialProgress
}: InteractiveLessonViewerProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted)
  const [progress, setProgress] = useState(initialProgress)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [startTime, setStartTime] = useState(Date.now())
  const [hasStarted, setHasStarted] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Track lesson access when component mounts
    if (!hasStarted) {
      trackLessonAccess(lesson.id)
      setHasStarted(true)
    }

    // Start tracking time
    const trackingInterval = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      if (timeSpent > 0 && timeSpent % 30 === 0) { // Track every 30 seconds
        trackLessonAccess(lesson.id, 30, progress)
      }
    }, 30000)

    return () => {
      clearInterval(trackingInterval)
    }
  }, [lesson.id, startTime, progress, hasStarted])

  useEffect(() => {
    if (lesson.lesson_type === 'video' && videoRef.current) {
      const video = videoRef.current
      
      const handleLoadedMetadata = () => {
        setDuration(video.duration)
      }
      
      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime)
        
        // Calculate progress for video
        const videoProgress = (video.currentTime / video.duration) * 100
        setProgress(videoProgress)
        
        // Auto-complete when video reaches 90%
        if (videoProgress >= 90 && !isCompleted) {
          handleMarkCompleted()
        }
      }
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata)
      video.addEventListener('timeupdate', handleTimeUpdate)
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
        video.removeEventListener('timeupdate', handleTimeUpdate)
      }
    }
  }, [lesson.lesson_type, isCompleted])

  const handleMarkCompleted = async () => {
    if (isCompleted) return

    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    const result = await markLessonCompleted(lesson.id, timeSpent)
    
    if (result.success) {
      setIsCompleted(true)
      setProgress(100)
    }
  }

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleReadingProgress = () => {
    // For text lessons, user can mark as complete manually
    if (lesson.lesson_type !== 'video') {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      if (timeSpent >= (lesson.estimated_reading_time || 5) * 60 * 0.7) { // 70% of estimated time
        setProgress(100)
      }
    }
  }

  // Auto-track reading progress for text lessons
  useEffect(() => {
    if (lesson.lesson_type !== 'video' && !isCompleted) {
      const estimatedSeconds = (lesson.estimated_reading_time || 5) * 60
      const progressInterval = setInterval(() => {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000)
        const newProgress = Math.min((timeSpent / estimatedSeconds) * 100, 95)
        setProgress(newProgress)
      }, 1000)

      return () => clearInterval(progressInterval)
    }
  }, [lesson.lesson_type, lesson.estimated_reading_time, startTime, isCompleted])

  return (
    <div className="space-y-6" dir="rtl">
      {/* Video Player */}
      {lesson.lesson_type === 'video' && lesson.video_url && (
        <Card>
          <CardContent className="p-0">
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full aspect-video bg-black rounded-t-lg"
                src={lesson.video_url}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />
              
              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleVideoToggle}
                    className="bg-white/20 hover:bg-white/30"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleMuteToggle}
                    className="bg-white/20 hover:bg-white/30"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  
                  <div className="flex-1 flex items-center gap-2 text-white text-sm">
                    <span>{formatTime(currentTime)}</span>
                    <Progress value={(currentTime / duration) * 100} className="flex-1" />
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">تقدم الدرس</span>
              {isCompleted && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  مكتمل
                </Badge>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Lesson Content */}
      <Card>
        <CardContent className="pt-6">
          <div 
            className="prose prose-slate max-w-none text-right"
            onScroll={handleReadingProgress}
          >
            <MarkdownRenderer content={lesson.content_ar} />
          </div>
        </CardContent>
      </Card>

      {/* Completion Button */}
      {!isCompleted && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Button 
                onClick={handleMarkCompleted}
                disabled={lesson.lesson_type === 'video' && progress < 90}
                className="w-full sm:w-auto"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                تم إكمال الدرس
              </Button>
              {lesson.lesson_type === 'video' && progress < 90 && (
                <p className="text-sm text-muted-foreground mt-2">
                  شاهد 90% من الفيديو لإكمال الدرس
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Celebration */}
      {isCompleted && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
              <h3 className="font-semibold text-green-800">تم إكمال الدرس بنجاح!</h3>
              <p className="text-sm text-green-600">
                أحسنت! يمكنك الآن الانتقال إلى الدرس التالي
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}