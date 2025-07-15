-- Create courses table for learning platform
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_ar TEXT NOT NULL,
    title_en TEXT,
    slug TEXT NOT NULL UNIQUE,
    description_ar TEXT NOT NULL,
    description_en TEXT,
    short_description_ar TEXT,
    short_description_en TEXT,
    thumbnail_url TEXT,
    banner_url TEXT,
    instructor_id UUID REFERENCES auth.users(id),
    instructor_name TEXT NOT NULL,
    instructor_bio TEXT,
    instructor_avatar_url TEXT,
    category TEXT NOT NULL,
    difficulty_level TEXT CHECK (difficulty_level IN ('مبتدئ', 'متوسط', 'متقدم')) DEFAULT 'مبتدئ',
    estimated_duration_hours INTEGER DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    total_chapters INTEGER DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0.00,
    is_free BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    enrollment_count INTEGER DEFAULT 0,
    completion_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    prerequisites TEXT[], -- Array of prerequisite descriptions
    learning_outcomes TEXT[], -- Array of learning outcomes
    tools_covered UUID[], -- References to products table (AI tools)
    tags TEXT[], -- Course tags for search/filtering
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_difficulty ON public.courses(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_published ON public.courses(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_courses_featured ON public.courses(is_featured, is_published);
CREATE INDEX IF NOT EXISTS idx_courses_free ON public.courses(is_free, is_published);
CREATE INDEX IF NOT EXISTS idx_courses_tags ON public.courses USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_courses_tools ON public.courses USING GIN(tools_covered);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Published courses are viewable by everyone" ON public.courses
    FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage all courses" ON public.courses
    FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Instructors can manage their own courses" ON public.courses
    FOR ALL USING (instructor_id = auth.uid());

-- Function to update course stats
CREATE OR REPLACE FUNCTION update_course_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total lessons and chapters count
    UPDATE public.courses
    SET 
        total_chapters = (
            SELECT COUNT(*) 
            FROM public.course_chapters 
            WHERE course_id = NEW.course_id AND is_published = true
        ),
        total_lessons = (
            SELECT COUNT(*) 
            FROM public.course_lessons 
            WHERE course_id = NEW.course_id AND is_published = true
        ),
        updated_at = NOW()
    WHERE id = NEW.course_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to increment course view count
CREATE OR REPLACE FUNCTION increment_course_view_count(course_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.courses
    SET view_count = COALESCE(view_count, 0) + 1,
        updated_at = NOW()
    WHERE id = course_id AND is_published = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update course rating
CREATE OR REPLACE FUNCTION update_course_rating(course_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.courses
    SET 
        rating = COALESCE((
            SELECT AVG(rating)::DECIMAL(3,2)
            FROM public.course_reviews
            WHERE course_reviews.course_id = courses.id
        ), 0),
        review_count = COALESCE((
            SELECT COUNT(*)
            FROM public.course_reviews
            WHERE course_reviews.course_id = courses.id
        ), 0),
        updated_at = NOW()
    WHERE id = course_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT ON public.courses TO anon;
GRANT ALL ON public.courses TO authenticated;

GRANT EXECUTE ON FUNCTION increment_course_view_count(UUID) TO anon;
GRANT EXECUTE ON FUNCTION increment_course_view_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_course_rating(UUID) TO authenticated;