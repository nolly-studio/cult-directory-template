-- Create learning_progress table for tracking individual lesson completion
CREATE TABLE IF NOT EXISTS public.learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE NOT NULL,
    chapter_id UUID REFERENCES public.course_chapters(id) ON DELETE CASCADE NOT NULL,
    
    -- Completion tracking
    is_completed BOOLEAN DEFAULT false NOT NULL,
    completion_date TIMESTAMP WITH TIME ZONE,
    first_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Time tracking
    time_spent_seconds INTEGER DEFAULT 0,
    access_count INTEGER DEFAULT 1,
    
    -- Progress details
    progress_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    current_position INTEGER DEFAULT 0, -- For video lessons, track where user left off
    
    -- Interaction data
    interactions_data JSONB DEFAULT '{}', -- Store quiz answers, notes, etc.
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one progress record per user per lesson
    UNIQUE(user_id, lesson_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_learning_progress_user_id ON public.learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_course_id ON public.learning_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_lesson_id ON public.learning_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_chapter_id ON public.learning_progress(chapter_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_completion ON public.learning_progress(user_id, course_id, is_completed);
CREATE INDEX IF NOT EXISTS idx_learning_progress_last_accessed ON public.learning_progress(user_id, last_accessed_at);
CREATE INDEX IF NOT EXISTS idx_learning_progress_user_course ON public.learning_progress(user_id, course_id);

-- Enable RLS
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own learning progress" ON public.learning_progress
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own learning progress" ON public.learning_progress
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own learning progress" ON public.learning_progress
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view and manage all learning progress" ON public.learning_progress
    FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Instructors can view progress for their courses" ON public.learning_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.courses 
            WHERE courses.id = learning_progress.course_id 
            AND courses.instructor_id = auth.uid()
        )
    );

-- Function to mark lesson as completed
CREATE OR REPLACE FUNCTION mark_lesson_completed(
    lesson_id_param UUID,
    time_spent_param INTEGER DEFAULT 0
)
RETURNS VOID AS $$
DECLARE
    lesson_record public.course_lessons%ROWTYPE;
    enrollment_id UUID;
BEGIN
    -- Get lesson details
    SELECT * INTO lesson_record FROM public.course_lessons WHERE id = lesson_id_param;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Lesson not found';
    END IF;
    
    -- Ensure user is enrolled in the course
    SELECT id INTO enrollment_id 
    FROM public.user_enrollments 
    WHERE user_id = auth.uid() AND course_id = lesson_record.course_id AND is_active = true;
    
    IF NOT FOUND THEN
        -- Auto-enroll in free courses
        SELECT auto_enroll_free_course(auth.uid(), lesson_record.course_id) INTO enrollment_id;
        
        IF enrollment_id IS NULL THEN
            RAISE EXCEPTION 'User not enrolled in course';
        END IF;
    END IF;
    
    -- Insert or update learning progress
    INSERT INTO public.learning_progress (
        user_id, 
        course_id, 
        lesson_id, 
        chapter_id, 
        is_completed, 
        completion_date, 
        progress_percentage,
        time_spent_seconds,
        access_count,
        last_accessed_at
    )
    VALUES (
        auth.uid(),
        lesson_record.course_id,
        lesson_id_param,
        lesson_record.chapter_id,
        true,
        NOW(),
        100.00,
        time_spent_param,
        1,
        NOW()
    )
    ON CONFLICT (user_id, lesson_id) 
    DO UPDATE SET
        is_completed = true,
        completion_date = COALESCE(learning_progress.completion_date, NOW()),
        progress_percentage = 100.00,
        time_spent_seconds = learning_progress.time_spent_seconds + time_spent_param,
        access_count = learning_progress.access_count + 1,
        last_accessed_at = NOW(),
        updated_at = NOW();
    
    -- Update overall enrollment progress
    PERFORM update_enrollment_progress(enrollment_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track lesson access (without completion)
CREATE OR REPLACE FUNCTION track_lesson_access(
    lesson_id_param UUID,
    time_spent_param INTEGER DEFAULT 0,
    progress_param DECIMAL(5,2) DEFAULT 0.00
)
RETURNS VOID AS $$
DECLARE
    lesson_record public.course_lessons%ROWTYPE;
    enrollment_id UUID;
BEGIN
    -- Get lesson details
    SELECT * INTO lesson_record FROM public.course_lessons WHERE id = lesson_id_param;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Lesson not found';
    END IF;
    
    -- Ensure user is enrolled in the course
    SELECT id INTO enrollment_id 
    FROM public.user_enrollments 
    WHERE user_id = auth.uid() AND course_id = lesson_record.course_id AND is_active = true;
    
    IF NOT FOUND THEN
        -- Auto-enroll in free courses
        SELECT auto_enroll_free_course(auth.uid(), lesson_record.course_id) INTO enrollment_id;
        
        IF enrollment_id IS NULL THEN
            RAISE EXCEPTION 'User not enrolled in course';
        END IF;
    END IF;
    
    -- Insert or update learning progress
    INSERT INTO public.learning_progress (
        user_id, 
        course_id, 
        lesson_id, 
        chapter_id, 
        progress_percentage,
        time_spent_seconds,
        access_count,
        last_accessed_at
    )
    VALUES (
        auth.uid(),
        lesson_record.course_id,
        lesson_id_param,
        lesson_record.chapter_id,
        progress_param,
        time_spent_param,
        1,
        NOW()
    )
    ON CONFLICT (user_id, lesson_id) 
    DO UPDATE SET
        progress_percentage = GREATEST(learning_progress.progress_percentage, progress_param),
        time_spent_seconds = learning_progress.time_spent_seconds + time_spent_param,
        access_count = learning_progress.access_count + 1,
        last_accessed_at = NOW(),
        updated_at = NOW();
    
    -- Update study time and activity
    PERFORM update_enrollment_activity(auth.uid(), lesson_record.course_id, time_spent_param, lesson_id_param);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's course progress
CREATE OR REPLACE FUNCTION get_user_course_progress(course_id_param UUID)
RETURNS TABLE (
    lesson_id UUID,
    chapter_id UUID,
    is_completed BOOLEAN,
    progress_percentage DECIMAL(5,2),
    completion_date TIMESTAMP WITH TIME ZONE,
    time_spent_seconds INTEGER,
    last_accessed_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        lp.lesson_id,
        lp.chapter_id,
        lp.is_completed,
        lp.progress_percentage,
        lp.completion_date,
        lp.time_spent_seconds,
        lp.last_accessed_at
    FROM public.learning_progress lp
    WHERE lp.user_id = auth.uid() AND lp.course_id = course_id_param
    ORDER BY lp.last_accessed_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get next lesson to study
CREATE OR REPLACE FUNCTION get_next_lesson(course_id_param UUID)
RETURNS UUID AS $$
DECLARE
    next_lesson_id UUID;
BEGIN
    -- Find the first incomplete lesson in order
    SELECT cl.id INTO next_lesson_id
    FROM public.course_chapters cc
    JOIN public.course_lessons cl ON cl.chapter_id = cc.id
    LEFT JOIN public.learning_progress lp ON lp.lesson_id = cl.id AND lp.user_id = auth.uid()
    WHERE cc.course_id = course_id_param
    AND cc.is_published = true
    AND cl.is_published = true
    AND (lp.is_completed IS NULL OR lp.is_completed = false)
    ORDER BY cc.chapter_order ASC, cl.lesson_order ASC
    LIMIT 1;
    
    -- If all lessons are completed, return the first lesson
    IF next_lesson_id IS NULL THEN
        SELECT cl.id INTO next_lesson_id
        FROM public.course_chapters cc
        JOIN public.course_lessons cl ON cl.chapter_id = cc.id
        WHERE cc.course_id = course_id_param
        AND cc.is_published = true
        AND cl.is_published = true
        ORDER BY cc.chapter_order ASC, cl.lesson_order ASC
        LIMIT 1;
    END IF;
    
    RETURN next_lesson_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT ON public.learning_progress TO authenticated;
GRANT INSERT ON public.learning_progress TO authenticated;
GRANT UPDATE ON public.learning_progress TO authenticated;

GRANT EXECUTE ON FUNCTION mark_lesson_completed(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION track_lesson_access(UUID, INTEGER, DECIMAL) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_course_progress(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_next_lesson(UUID) TO authenticated;