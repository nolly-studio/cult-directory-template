-- Create course_lessons table for individual learning units
CREATE TABLE IF NOT EXISTS public.course_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    chapter_id UUID REFERENCES public.course_chapters(id) ON DELETE CASCADE NOT NULL,
    title_ar TEXT NOT NULL,
    title_en TEXT,
    content_ar TEXT NOT NULL,
    content_en TEXT,
    lesson_order INTEGER NOT NULL,
    lesson_type TEXT CHECK (lesson_type IN ('text', 'video', 'quiz', 'exercise', 'project')) DEFAULT 'text',
    
    -- Video-specific fields
    video_url TEXT,
    video_duration_seconds INTEGER,
    video_thumbnail_url TEXT,
    
    -- Content metadata
    estimated_reading_time INTEGER DEFAULT 5, -- in minutes
    difficulty_level TEXT CHECK (difficulty_level IN ('مبتدئ', 'متوسط', 'متقدم')),
    
    -- Interactive content
    quiz_data JSONB, -- Quiz questions and answers
    exercise_data JSONB, -- Exercise instructions and solutions
    resources JSONB, -- Additional resources: [{"title": "Resource Name", "url": "...", "type": "link|download"}]
    
    -- Access control
    is_preview BOOLEAN DEFAULT false, -- Free preview lesson
    is_published BOOLEAN DEFAULT false,
    requires_enrollment BOOLEAN DEFAULT true,
    
    -- Analytics
    completion_count INTEGER DEFAULT 0,
    average_completion_time INTEGER DEFAULT 0, -- in minutes
    view_count INTEGER DEFAULT 0,
    
    -- AI Tools integration
    tools_used UUID[], -- References to products table (AI tools used in this lesson)
    
    -- SEO and metadata
    meta_description_ar TEXT,
    meta_description_en TEXT,
    keywords TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique ordering within each chapter
    UNIQUE(chapter_id, lesson_order)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_course_lessons_course_id ON public.course_lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_chapter_id ON public.course_lessons(chapter_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_order ON public.course_lessons(chapter_id, lesson_order);
CREATE INDEX IF NOT EXISTS idx_course_lessons_published ON public.course_lessons(is_published);
CREATE INDEX IF NOT EXISTS idx_course_lessons_preview ON public.course_lessons(is_preview, is_published);
CREATE INDEX IF NOT EXISTS idx_course_lessons_type ON public.course_lessons(lesson_type);
CREATE INDEX IF NOT EXISTS idx_course_lessons_tools ON public.course_lessons USING GIN(tools_used);
CREATE INDEX IF NOT EXISTS idx_course_lessons_keywords ON public.course_lessons USING GIN(keywords);

-- Enable RLS
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Published preview lessons are viewable by everyone" ON public.course_lessons
    FOR SELECT USING (
        is_published = true 
        AND is_preview = true 
        AND EXISTS (
            SELECT 1 FROM public.courses 
            WHERE courses.id = course_lessons.course_id 
            AND courses.is_published = true
        )
    );

CREATE POLICY "Enrolled users can view course lessons" ON public.course_lessons
    FOR SELECT USING (
        is_published = true 
        AND EXISTS (
            SELECT 1 FROM public.courses 
            WHERE courses.id = course_lessons.course_id 
            AND courses.is_published = true
            AND (
                courses.is_free = true 
                OR EXISTS (
                    SELECT 1 FROM public.user_enrollments 
                    WHERE user_enrollments.course_id = courses.id 
                    AND user_enrollments.user_id = auth.uid()
                    AND user_enrollments.is_active = true
                )
            )
        )
    );

CREATE POLICY "Admins can manage all lessons" ON public.course_lessons
    FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Instructors can manage lessons of their own courses" ON public.course_lessons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.courses 
            WHERE courses.id = course_lessons.course_id 
            AND courses.instructor_id = auth.uid()
        )
    );

-- Function to update lesson order when inserting/updating
CREATE OR REPLACE FUNCTION ensure_lesson_order()
RETURNS TRIGGER AS $$
BEGIN
    -- If inserting and order already exists, shift others up
    IF TG_OP = 'INSERT' THEN
        IF EXISTS (
            SELECT 1 FROM public.course_lessons 
            WHERE chapter_id = NEW.chapter_id 
            AND lesson_order = NEW.lesson_order 
            AND id != NEW.id
        ) THEN
            -- Shift existing lessons up
            UPDATE public.course_lessons
            SET lesson_order = lesson_order + 1,
                updated_at = NOW()
            WHERE chapter_id = NEW.chapter_id 
            AND lesson_order >= NEW.lesson_order 
            AND id != NEW.id;
        END IF;
    END IF;
    
    -- If updating order, handle reordering
    IF TG_OP = 'UPDATE' AND OLD.lesson_order != NEW.lesson_order THEN
        -- Moving lesson to a new position
        IF NEW.lesson_order > OLD.lesson_order THEN
            -- Moving down: shift lessons between old and new position up
            UPDATE public.course_lessons
            SET lesson_order = lesson_order - 1,
                updated_at = NOW()
            WHERE chapter_id = NEW.chapter_id 
            AND lesson_order > OLD.lesson_order 
            AND lesson_order <= NEW.lesson_order 
            AND id != NEW.id;
        ELSE
            -- Moving up: shift lessons between new and old position down
            UPDATE public.course_lessons
            SET lesson_order = lesson_order + 1,
                updated_at = NOW()
            WHERE chapter_id = NEW.chapter_id 
            AND lesson_order >= NEW.lesson_order 
            AND lesson_order < OLD.lesson_order 
            AND id != NEW.id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to reorder lessons when one is deleted
CREATE OR REPLACE FUNCTION reorder_lessons_after_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Reorder remaining lessons to fill the gap
    UPDATE public.course_lessons
    SET lesson_order = lesson_order - 1,
        updated_at = NOW()
    WHERE chapter_id = OLD.chapter_id 
    AND lesson_order > OLD.lesson_order;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Function to increment lesson view count
CREATE OR REPLACE FUNCTION increment_lesson_view_count(lesson_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.course_lessons
    SET view_count = COALESCE(view_count, 0) + 1,
        updated_at = NOW()
    WHERE id = lesson_id AND is_published = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record lesson completion
CREATE OR REPLACE FUNCTION record_lesson_completion(lesson_id UUID, completion_time_minutes INTEGER DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
    UPDATE public.course_lessons
    SET 
        completion_count = COALESCE(completion_count, 0) + 1,
        average_completion_time = CASE 
            WHEN completion_time_minutes IS NOT NULL THEN
                CASE 
                    WHEN completion_count = 0 THEN completion_time_minutes
                    ELSE ((COALESCE(average_completion_time, 0) * completion_count) + completion_time_minutes) / (completion_count + 1)
                END
            ELSE average_completion_time
        END,
        updated_at = NOW()
    WHERE id = lesson_id AND is_published = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER ensure_lesson_order_trigger
    BEFORE INSERT OR UPDATE ON public.course_lessons
    FOR EACH ROW
    EXECUTE FUNCTION ensure_lesson_order();

CREATE TRIGGER reorder_lessons_after_delete_trigger
    AFTER DELETE ON public.course_lessons
    FOR EACH ROW
    EXECUTE FUNCTION reorder_lessons_after_delete();

CREATE TRIGGER update_chapter_stats_on_lesson_change
    AFTER INSERT OR UPDATE OR DELETE ON public.course_lessons
    FOR EACH ROW
    EXECUTE FUNCTION update_chapter_stats();

CREATE TRIGGER update_course_stats_on_lesson_change
    AFTER INSERT OR UPDATE OR DELETE ON public.course_lessons
    FOR EACH ROW
    EXECUTE FUNCTION update_course_stats();

-- Grant permissions
GRANT SELECT ON public.course_lessons TO anon;
GRANT ALL ON public.course_lessons TO authenticated;

GRANT EXECUTE ON FUNCTION increment_lesson_view_count(UUID) TO anon;
GRANT EXECUTE ON FUNCTION increment_lesson_view_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION record_lesson_completion(UUID, INTEGER) TO authenticated;