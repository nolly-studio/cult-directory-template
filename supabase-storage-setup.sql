-- Supabase Storage Setup for CMS
-- Run these commands in your Supabase SQL Editor

-- 1. Create additional storage buckets for the CMS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('news-images', 'news-images', true, 5242880, '{"image/jpeg","image/png","image/webp","image/gif"}'),
  ('tutorial-images', 'tutorial-images', true, 5242880, '{"image/jpeg","image/png","image/webp","image/gif"}'),
  ('blog-images', 'blog-images', true, 5242880, '{"image/jpeg","image/png","image/webp","image/gif"}'),
  ('site-assets', 'site-assets', true, 10485760, '{"image/jpeg","image/png","image/webp","image/gif","image/svg+xml"}')
ON CONFLICT (id) DO NOTHING;

-- 2. Create storage policies for news-images bucket
CREATE POLICY "News images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'news-images');

CREATE POLICY "Authenticated users can upload news images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'news-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own news images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'news-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own news images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'news-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. Create storage policies for tutorial-images bucket
CREATE POLICY "Tutorial images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'tutorial-images');

CREATE POLICY "Authenticated users can upload tutorial images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'tutorial-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own tutorial images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'tutorial-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own tutorial images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'tutorial-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Create storage policies for blog-images bucket
CREATE POLICY "Blog images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own blog images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'blog-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own blog images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'blog-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 5. Create storage policies for site-assets bucket
CREATE POLICY "Site assets are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-assets');

CREATE POLICY "Admin users can upload site assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'site-assets' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Admin users can update site assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'site-assets' 
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Admin users can delete site assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'site-assets' 
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- 6. Add additional fields to ai_news table for better CMS support
ALTER TABLE public.ai_news 
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS featured_image_url TEXT;

-- 7. Add additional fields to tutorials table
ALTER TABLE public.tutorials
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS featured_image_url TEXT,
ADD COLUMN IF NOT EXISTS estimated_reading_time INTEGER,
ADD COLUMN IF NOT EXISTS prerequisite_tutorials TEXT[],
ADD COLUMN IF NOT EXISTS learning_objectives TEXT[];

-- 8. Create site_settings table for global configuration
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Insert default site settings
INSERT INTO public.site_settings (key, value, description) VALUES
  ('site_name', '"العربي للذكاء الاصطناعي"', 'Site name'),
  ('site_description', '"اكتشف أفضل أدوات الذكاء الاصطناعي مع شروحات باللغة العربية"', 'Site description'),
  ('contact_email', '"info@arabie.ai"', 'Contact email'),
  ('social_links', '{"twitter": "", "linkedin": "", "github": ""}', 'Social media links'),
  ('homepage_featured_tools', '[]', 'Featured tools on homepage'),
  ('news_categories', '["أخبار عامة", "تحديثات", "تعليم", "أبحاث"]', 'News categories'),
  ('tutorial_categories', '["مبتدئ", "متوسط", "متقدم"]', 'Tutorial categories')
ON CONFLICT (key) DO NOTHING;

-- 9. Create RLS policies for site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site settings are viewable by everyone"
ON public.site_settings FOR SELECT
USING (true);

CREATE POLICY "Only admins can modify site settings"
ON public.site_settings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- 10. Create media_library table for centralized image management
CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  bucket_name TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  caption TEXT,
  tags TEXT[],
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for media_library
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Media library is viewable by authenticated users"
ON public.media_library FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can upload to media library"
ON public.media_library FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own uploads"
ON public.media_library FOR UPDATE
USING (uploaded_by = auth.uid());

CREATE POLICY "Admins can delete any media"
ON public.media_library FOR DELETE
USING (
  uploaded_by = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- 11. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_library_bucket ON public.media_library(bucket_name);
CREATE INDEX IF NOT EXISTS idx_media_library_tags ON public.media_library USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_media_library_uploaded_by ON public.media_library(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_ai_news_published ON public.ai_news(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_ai_news_featured ON public.ai_news(is_featured);
CREATE INDEX IF NOT EXISTS idx_tutorials_published ON public.tutorials(is_published);

-- 12. Update view count function for news
CREATE OR REPLACE FUNCTION increment_news_view_count(news_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.ai_news 
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = news_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Update view count function for tutorials  
CREATE OR REPLACE FUNCTION increment_tutorial_view_count(tutorial_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.tutorials 
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = tutorial_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;