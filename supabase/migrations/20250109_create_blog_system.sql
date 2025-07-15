-- Create blog_articles table for enhanced SEO content
CREATE TABLE IF NOT EXISTS public.blog_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_ar TEXT NOT NULL,
    title_en TEXT,
    slug TEXT NOT NULL UNIQUE,
    content_ar TEXT NOT NULL,
    content_en TEXT,
    excerpt_ar TEXT,
    excerpt_en TEXT,
    meta_description_ar TEXT,
    meta_description_en TEXT,
    keywords TEXT[], -- Array of keywords for SEO
    author_id UUID REFERENCES auth.users(id),
    author_name TEXT NOT NULL,
    author_bio TEXT,
    author_avatar_url TEXT,
    category TEXT NOT NULL,
    subcategory TEXT,
    tags TEXT[], -- Array of tags
    series_name TEXT, -- For article series
    series_part INTEGER, -- Part number in series
    difficulty_level TEXT CHECK (difficulty_level IN ('مبتدئ', 'متوسط', 'متقدم')),
    estimated_reading_time INTEGER DEFAULT 5, -- in minutes
    featured_image_url TEXT,
    table_of_contents JSONB, -- Structured TOC data
    related_articles UUID[], -- Array of related article IDs
    related_products UUID[], -- Array of related product IDs
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    is_series_complete BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_authors table for author profiles
CREATE TABLE IF NOT EXISTS public.blog_authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    name_ar TEXT NOT NULL,
    name_en TEXT,
    bio_ar TEXT,
    bio_en TEXT,
    avatar_url TEXT,
    expertise_areas TEXT[], -- Array of expertise areas
    social_links JSONB, -- Social media links
    article_count INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_categories table for better organization
CREATE TABLE IF NOT EXISTS public.blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_ar TEXT NOT NULL,
    name_en TEXT,
    slug TEXT NOT NULL UNIQUE,
    description_ar TEXT,
    description_en TEXT,
    parent_id UUID REFERENCES public.blog_categories(id),
    article_count INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_series table for article series
CREATE TABLE IF NOT EXISTS public.blog_series (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_ar TEXT NOT NULL,
    title_en TEXT,
    slug TEXT NOT NULL UNIQUE,
    description_ar TEXT,
    description_en TEXT,
    cover_image_url TEXT,
    total_parts INTEGER DEFAULT 0,
    completed_parts INTEGER DEFAULT 0,
    is_complete BOOLEAN DEFAULT false,
    difficulty_level TEXT CHECK (difficulty_level IN ('مبتدئ', 'متوسط', 'متقدم')),
    estimated_total_time INTEGER DEFAULT 0, -- Total reading time in minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_comments table for user engagement
CREATE TABLE IF NOT EXISTS public.blog_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES public.blog_articles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    parent_id UUID REFERENCES public.blog_comments(id), -- For nested comments
    content TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_email TEXT,
    is_approved BOOLEAN DEFAULT false,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_bookmarks table for user bookmarks
CREATE TABLE IF NOT EXISTS public.blog_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    article_id UUID REFERENCES public.blog_articles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, article_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_articles_slug ON public.blog_articles(slug);
CREATE INDEX IF NOT EXISTS idx_blog_articles_category ON public.blog_articles(category);
CREATE INDEX IF NOT EXISTS idx_blog_articles_author ON public.blog_articles(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_articles_published ON public.blog_articles(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_blog_articles_featured ON public.blog_articles(is_featured, published_at);
CREATE INDEX IF NOT EXISTS idx_blog_articles_series ON public.blog_articles(series_name, series_part);
CREATE INDEX IF NOT EXISTS idx_blog_articles_keywords ON public.blog_articles USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_blog_articles_tags ON public.blog_articles USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_comments_article ON public.blog_comments(article_id);
CREATE INDEX IF NOT EXISTS idx_blog_bookmarks_user ON public.blog_bookmarks(user_id);

-- Create RLS policies
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_bookmarks ENABLE ROW LEVEL SECURITY;

-- Blog articles policies
CREATE POLICY "Blog articles are viewable by everyone" ON public.blog_articles
    FOR SELECT USING (is_published = true);

CREATE POLICY "Blog articles can be managed by admins" ON public.blog_articles
    FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Authors can manage their own articles" ON public.blog_articles
    FOR ALL USING (author_id = auth.uid());

-- Blog authors policies
CREATE POLICY "Blog authors are viewable by everyone" ON public.blog_authors
    FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Blog authors can be managed by admins" ON public.blog_authors
    FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Users can manage their own author profile" ON public.blog_authors
    FOR ALL USING (user_id = auth.uid());

-- Blog categories policies
CREATE POLICY "Blog categories are viewable by everyone" ON public.blog_categories
    FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Blog categories can be managed by admins" ON public.blog_categories
    FOR ALL USING (is_admin(auth.uid()));

-- Blog series policies
CREATE POLICY "Blog series are viewable by everyone" ON public.blog_series
    FOR SELECT TO public USING (true);

CREATE POLICY "Blog series can be managed by admins" ON public.blog_series
    FOR ALL USING (is_admin(auth.uid()));

-- Blog comments policies
CREATE POLICY "Approved comments are viewable by everyone" ON public.blog_comments
    FOR SELECT TO public USING (is_approved = true);

CREATE POLICY "Users can create comments" ON public.blog_comments
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.blog_comments
    FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all comments" ON public.blog_comments
    FOR ALL USING (is_admin(auth.uid()));

-- Blog bookmarks policies
CREATE POLICY "Users can manage their own bookmarks" ON public.blog_bookmarks
    FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Create functions for blog functionality
CREATE OR REPLACE FUNCTION increment_blog_view_count(article_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.blog_articles
    SET view_count = COALESCE(view_count, 0) + 1,
        updated_at = NOW()
    WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_blog_like_count(article_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.blog_articles
    SET like_count = COALESCE(like_count, 0) + 1,
        updated_at = NOW()
    WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_blog_share_count(article_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.blog_articles
    SET share_count = COALESCE(share_count, 0) + 1,
        updated_at = NOW()
    WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_blog_author_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update author article count and total views
    UPDATE public.blog_authors
    SET article_count = (
        SELECT COUNT(*)
        FROM public.blog_articles
        WHERE author_id = NEW.author_id AND is_published = true
    ),
    total_views = (
        SELECT COALESCE(SUM(view_count), 0)
        FROM public.blog_articles
        WHERE author_id = NEW.author_id AND is_published = true
    )
    WHERE user_id = NEW.author_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_blog_category_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update category article count
    UPDATE public.blog_categories
    SET article_count = (
        SELECT COUNT(*)
        FROM public.blog_articles
        WHERE category = NEW.category AND is_published = true
    )
    WHERE slug = NEW.category;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_blog_articles_timestamp
    BEFORE UPDATE ON public.blog_articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_authors_timestamp
    BEFORE UPDATE ON public.blog_authors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_series_timestamp
    BEFORE UPDATE ON public.blog_series
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_comments_timestamp
    BEFORE UPDATE ON public.blog_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_author_stats_on_article_change
    AFTER INSERT OR UPDATE OR DELETE ON public.blog_articles
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_author_stats();

CREATE TRIGGER update_category_stats_on_article_change
    AFTER INSERT OR UPDATE OR DELETE ON public.blog_articles
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_category_stats();

-- Grant permissions
GRANT SELECT ON public.blog_articles TO anon;
GRANT SELECT ON public.blog_authors TO anon;
GRANT SELECT ON public.blog_categories TO anon;
GRANT SELECT ON public.blog_series TO anon;
GRANT SELECT ON public.blog_comments TO anon;

GRANT ALL ON public.blog_articles TO authenticated;
GRANT ALL ON public.blog_authors TO authenticated;
GRANT ALL ON public.blog_categories TO authenticated;
GRANT ALL ON public.blog_series TO authenticated;
GRANT ALL ON public.blog_comments TO authenticated;
GRANT ALL ON public.blog_bookmarks TO authenticated;

GRANT EXECUTE ON FUNCTION increment_blog_view_count(UUID) TO anon;
GRANT EXECUTE ON FUNCTION increment_blog_view_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_blog_like_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_blog_share_count(UUID) TO authenticated;