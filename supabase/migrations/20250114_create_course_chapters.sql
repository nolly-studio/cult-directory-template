-- Create course_chapters table for organizing lessons into chapters
CREATE TABLE IF NOT EXISTS public.course_chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    title_ar TEXT NOT NULL,
    title_en TEXT,
    description_ar TEXT,
    description_en TEXT,
    chapter_order INTEGER NOT NULL,
    lesson_count INTEGER DEFAULT 0,
    estimated_duration_minutes INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    is_free_preview BOOLEAN DEFAULT false, -- Allow free preview of this chapter
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique ordering within each course
    UNIQUE(course_id, chapter_order)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_course_chapters_course_id ON public.course_chapters(course_id);
CREATE INDEX IF NOT EXISTS idx_course_chapters_order ON public.course_chapters(course_id, chapter_order);
CREATE INDEX IF NOT EXISTS idx_course_chapters_published ON public.course_chapters(is_published);

-- Enable RLS
ALTER TABLE public.course_chapters ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Published chapters of published courses are viewable by everyone" ON public.course_chapters
    FOR SELECT USING (
        is_published = true AND 
        EXISTS (
            SELECT 1 FROM public.courses 
            WHERE courses.id = course_chapters.course_id 
            AND courses.is_published = true
        )
    );

CREATE POLICY "Admins can manage all chapters" ON public.course_chapters
    FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Instructors can manage chapters of their own courses" ON public.course_chapters
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.courses 
            WHERE courses.id = course_chapters.course_id 
            AND courses.instructor_id = auth.uid()
        )
    );

-- Function to update chapter stats
CREATE OR REPLACE FUNCTION update_chapter_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update lesson count and duration for the chapter
    UPDATE public.course_chapters
    SET 
        lesson_count = (
            SELECT COUNT(*) 
            FROM public.course_lessons 
            WHERE chapter_id = NEW.chapter_id AND is_published = true
        ),
        estimated_duration_minutes = (
            SELECT COALESCE(SUM(estimated_reading_time + COALESCE(video_duration_seconds/60, 0)), 0)
            FROM public.course_lessons 
            WHERE chapter_id = NEW.chapter_id AND is_published = true
        ),
        updated_at = NOW()
    WHERE id = NEW.chapter_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to reorder chapters when one is deleted
CREATE OR REPLACE FUNCTION reorder_chapters_after_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Reorder remaining chapters to fill the gap
    UPDATE public.course_chapters
    SET chapter_order = chapter_order - 1,
        updated_at = NOW()
    WHERE course_id = OLD.course_id 
    AND chapter_order > OLD.chapter_order;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Function to ensure chapter order is sequential
CREATE OR REPLACE FUNCTION ensure_chapter_order()
RETURNS TRIGGER AS $$
BEGIN
    -- If inserting and order already exists, shift others up
    IF TG_OP = 'INSERT' THEN
        IF EXISTS (
            SELECT 1 FROM public.course_chapters 
            WHERE course_id = NEW.course_id 
            AND chapter_order = NEW.chapter_order 
            AND id != NEW.id
        ) THEN
            -- Shift existing chapters up
            UPDATE public.course_chapters
            SET chapter_order = chapter_order + 1,
                updated_at = NOW()
            WHERE course_id = NEW.course_id 
            AND chapter_order >= NEW.chapter_order 
            AND id != NEW.id;
        END IF;
    END IF;
    
    -- If updating order, handle reordering
    IF TG_OP = 'UPDATE' AND OLD.chapter_order != NEW.chapter_order THEN
        -- Moving chapter to a new position
        IF NEW.chapter_order > OLD.chapter_order THEN
            -- Moving down: shift chapters between old and new position up
            UPDATE public.course_chapters
            SET chapter_order = chapter_order - 1,
                updated_at = NOW()
            WHERE course_id = NEW.course_id 
            AND chapter_order > OLD.chapter_order 
            AND chapter_order <= NEW.chapter_order 
            AND id != NEW.id;
        ELSE
            -- Moving up: shift chapters between new and old position down
            UPDATE public.course_chapters
            SET chapter_order = chapter_order + 1,
                updated_at = NOW()
            WHERE course_id = NEW.course_id 
            AND chapter_order >= NEW.chapter_order 
            AND chapter_order < OLD.chapter_order 
            AND id != NEW.id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER ensure_chapter_order_trigger
    BEFORE INSERT OR UPDATE ON public.course_chapters
    FOR EACH ROW
    EXECUTE FUNCTION ensure_chapter_order();

CREATE TRIGGER reorder_chapters_after_delete_trigger
    AFTER DELETE ON public.course_chapters
    FOR EACH ROW
    EXECUTE FUNCTION reorder_chapters_after_delete();

-- Grant permissions
GRANT SELECT ON public.course_chapters TO anon;
GRANT ALL ON public.course_chapters TO authenticated;