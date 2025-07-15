-- Create user_enrollments table for tracking course subscriptions
CREATE TABLE IF NOT EXISTS public.user_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    
    -- Enrollment details
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completion_date TIMESTAMP WITH TIME ZONE,
    start_date TIMESTAMP WITH TIME ZONE, -- When user first accessed a lesson
    
    -- Progress tracking
    progress_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    current_lesson_id UUID REFERENCES public.course_lessons(id),
    current_chapter_id UUID REFERENCES public.course_chapters(id),
    completed_lessons_count INTEGER DEFAULT 0,
    completed_chapters_count INTEGER DEFAULT 0,
    
    -- Time tracking
    total_study_time_minutes INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    streak_days INTEGER DEFAULT 0, -- Consecutive days of study
    longest_streak INTEGER DEFAULT 0,
    last_streak_date DATE,
    
    -- Enrollment status
    is_active BOOLEAN DEFAULT true,
    enrollment_source TEXT, -- 'direct', 'invitation', 'promotion', etc.
    
    -- Certificate and completion
    certificate_issued BOOLEAN DEFAULT false,
    certificate_url TEXT,
    certificate_issued_at TIMESTAMP WITH TIME ZONE,
    
    -- Payment and access (for future paid courses)
    payment_status TEXT CHECK (payment_status IN ('free', 'paid', 'scholarship', 'pending')) DEFAULT 'free',
    expires_at TIMESTAMP WITH TIME ZONE, -- For time-limited access
    
    -- Preferences
    notification_preferences JSONB DEFAULT '{"lesson_reminders": true, "progress_updates": true, "new_content": true}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one enrollment per user per course
    UNIQUE(user_id, course_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_enrollments_user_id ON public.user_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_enrollments_course_id ON public.user_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_user_enrollments_active ON public.user_enrollments(is_active);
CREATE INDEX IF NOT EXISTS idx_user_enrollments_progress ON public.user_enrollments(user_id, progress_percentage);
CREATE INDEX IF NOT EXISTS idx_user_enrollments_last_accessed ON public.user_enrollments(last_accessed_at);
CREATE INDEX IF NOT EXISTS idx_user_enrollments_current_lesson ON public.user_enrollments(current_lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_enrollments_payment_status ON public.user_enrollments(payment_status);

-- Enable RLS
ALTER TABLE public.user_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own enrollments" ON public.user_enrollments
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can enroll themselves in courses" ON public.user_enrollments
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own enrollment progress" ON public.user_enrollments
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view and manage all enrollments" ON public.user_enrollments
    FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Instructors can view enrollments for their courses" ON public.user_enrollments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.courses 
            WHERE courses.id = user_enrollments.course_id 
            AND courses.instructor_id = auth.uid()
        )
    );

-- Function to update enrollment progress
CREATE OR REPLACE FUNCTION update_enrollment_progress(enrollment_id UUID)
RETURNS VOID AS $$
DECLARE
    enrollment_record public.user_enrollments%ROWTYPE;
    total_lessons INTEGER;
    completed_lessons INTEGER;
    total_chapters INTEGER;
    completed_chapters INTEGER;
    new_progress DECIMAL(5,2);
BEGIN
    -- Get enrollment record
    SELECT * INTO enrollment_record FROM public.user_enrollments WHERE id = enrollment_id;
    
    IF NOT FOUND THEN
        RETURN;
    END IF;
    
    -- Get total lessons and chapters in the course
    SELECT 
        courses.total_lessons,
        courses.total_chapters
    INTO 
        total_lessons,
        total_chapters
    FROM public.courses 
    WHERE id = enrollment_record.course_id;
    
    -- Count completed lessons
    SELECT COUNT(*) INTO completed_lessons
    FROM public.learning_progress
    WHERE user_id = enrollment_record.user_id
    AND course_id = enrollment_record.course_id
    AND is_completed = true;
    
    -- Count completed chapters (all lessons in chapter completed)
    SELECT COUNT(*) INTO completed_chapters
    FROM public.course_chapters cc
    WHERE cc.course_id = enrollment_record.course_id
    AND NOT EXISTS (
        SELECT 1 FROM public.course_lessons cl
        WHERE cl.chapter_id = cc.id
        AND cl.is_published = true
        AND NOT EXISTS (
            SELECT 1 FROM public.learning_progress lp
            WHERE lp.lesson_id = cl.id
            AND lp.user_id = enrollment_record.user_id
            AND lp.is_completed = true
        )
    );
    
    -- Calculate progress percentage
    IF total_lessons > 0 THEN
        new_progress := (completed_lessons::DECIMAL / total_lessons::DECIMAL) * 100;
    ELSE
        new_progress := 0;
    END IF;
    
    -- Update enrollment record
    UPDATE public.user_enrollments
    SET 
        progress_percentage = new_progress,
        completed_lessons_count = completed_lessons,
        completed_chapters_count = completed_chapters,
        completion_date = CASE 
            WHEN new_progress = 100 AND completion_date IS NULL THEN NOW()
            WHEN new_progress < 100 THEN NULL
            ELSE completion_date
        END,
        updated_at = NOW()
    WHERE id = enrollment_id;
    
    -- Update course enrollment and completion counts
    UPDATE public.courses
    SET 
        enrollment_count = (
            SELECT COUNT(*) FROM public.user_enrollments 
            WHERE course_id = enrollment_record.course_id AND is_active = true
        ),
        completion_count = (
            SELECT COUNT(*) FROM public.user_enrollments 
            WHERE course_id = enrollment_record.course_id 
            AND progress_percentage = 100 
            AND is_active = true
        )
    WHERE id = enrollment_record.course_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update study streak
CREATE OR REPLACE FUNCTION update_study_streak(user_id_param UUID, course_id_param UUID)
RETURNS VOID AS $$
DECLARE
    enrollment_record public.user_enrollments%ROWTYPE;
    today_date DATE := CURRENT_DATE;
    yesterday_date DATE := CURRENT_DATE - INTERVAL '1 day';
BEGIN
    -- Get enrollment record
    SELECT * INTO enrollment_record 
    FROM public.user_enrollments 
    WHERE user_id = user_id_param AND course_id = course_id_param;
    
    IF NOT FOUND THEN
        RETURN;
    END IF;
    
    -- Update streak logic
    IF enrollment_record.last_streak_date IS NULL OR enrollment_record.last_streak_date < yesterday_date THEN
        -- Starting new streak
        UPDATE public.user_enrollments
        SET 
            streak_days = 1,
            last_streak_date = today_date,
            updated_at = NOW()
        WHERE user_id = user_id_param AND course_id = course_id_param;
    ELSIF enrollment_record.last_streak_date = yesterday_date THEN
        -- Continuing streak
        UPDATE public.user_enrollments
        SET 
            streak_days = streak_days + 1,
            longest_streak = GREATEST(longest_streak, streak_days + 1),
            last_streak_date = today_date,
            updated_at = NOW()
        WHERE user_id = user_id_param AND course_id = course_id_param;
    END IF;
    -- If last_streak_date = today_date, no update needed (already studied today)
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update last accessed and study time
CREATE OR REPLACE FUNCTION update_enrollment_activity(
    user_id_param UUID, 
    course_id_param UUID,
    study_time_minutes INTEGER DEFAULT 0,
    lesson_id_param UUID DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    UPDATE public.user_enrollments
    SET 
        last_accessed_at = NOW(),
        total_study_time_minutes = total_study_time_minutes + study_time_minutes,
        current_lesson_id = COALESCE(lesson_id_param, current_lesson_id),
        current_chapter_id = CASE 
            WHEN lesson_id_param IS NOT NULL THEN (
                SELECT chapter_id FROM public.course_lessons WHERE id = lesson_id_param
            )
            ELSE current_chapter_id
        END,
        start_date = COALESCE(start_date, NOW()),
        updated_at = NOW()
    WHERE user_id = user_id_param AND course_id = course_id_param;
    
    -- Update study streak if study time > 0
    IF study_time_minutes > 0 THEN
        PERFORM update_study_streak(user_id_param, course_id_param);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically enroll user in free courses
CREATE OR REPLACE FUNCTION auto_enroll_free_course(user_id_param UUID, course_id_param UUID)
RETURNS UUID AS $$
DECLARE
    course_record public.courses%ROWTYPE;
    enrollment_id UUID;
BEGIN
    -- Check if course is free and published
    SELECT * INTO course_record FROM public.courses WHERE id = course_id_param;
    
    IF NOT FOUND OR NOT course_record.is_published OR NOT course_record.is_free THEN
        RETURN NULL;
    END IF;
    
    -- Check if already enrolled
    SELECT id INTO enrollment_id 
    FROM public.user_enrollments 
    WHERE user_id = user_id_param AND course_id = course_id_param;
    
    IF FOUND THEN
        RETURN enrollment_id;
    END IF;
    
    -- Create enrollment
    INSERT INTO public.user_enrollments (user_id, course_id, enrollment_source, payment_status)
    VALUES (user_id_param, course_id_param, 'auto_free', 'free')
    RETURNING id INTO enrollment_id;
    
    RETURN enrollment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT ON public.user_enrollments TO authenticated;
GRANT INSERT ON public.user_enrollments TO authenticated;
GRANT UPDATE ON public.user_enrollments TO authenticated;

GRANT EXECUTE ON FUNCTION update_enrollment_progress(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_study_streak(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_enrollment_activity(UUID, UUID, INTEGER, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION auto_enroll_free_course(UUID, UUID) TO authenticated;