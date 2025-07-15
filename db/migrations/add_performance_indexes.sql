-- Performance optimization indexes for better query performance
-- Run this SQL in your Supabase SQL editor or via migration

-- Products table indexes
CREATE INDEX IF NOT EXISTS idx_products_categories ON products(categories);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_products_labels ON products USING GIN(labels);
CREATE INDEX IF NOT EXISTS idx_products_approved ON products(approved);
CREATE INDEX IF NOT EXISTS idx_products_view_count ON products(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_updated_at ON products(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN(
  to_tsvector('english', coalesce(name_ar, '') || ' ' || coalesce(name_en, '') || ' ' || coalesce(description_ar, '') || ' ' || coalesce(description_en, ''))
);

-- News table indexes  
CREATE INDEX IF NOT EXISTS idx_news_category ON ai_news(category);
CREATE INDEX IF NOT EXISTS idx_news_is_published ON ai_news(is_published);
CREATE INDEX IF NOT EXISTS idx_news_is_featured ON ai_news(is_featured);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON ai_news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_updated_at ON ai_news(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_view_count ON ai_news(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_news_search ON ai_news USING GIN(
  to_tsvector('arabic', coalesce(title_ar, '') || ' ' || coalesce(content_ar, '') || ' ' || coalesce(summary_ar, ''))
);

-- Courses table indexes
CREATE INDEX IF NOT EXISTS idx_courses_difficulty ON courses(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_courses_price ON courses(price);
CREATE INDEX IF NOT EXISTS idx_courses_is_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_courses_updated_at ON courses(updated_at DESC);

-- Tools table indexes (if exists)
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_is_published ON tools(is_published);
CREATE INDEX IF NOT EXISTS idx_tools_created_at ON tools(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tools_updated_at ON tools(updated_at DESC);

-- User favorites indexes
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_product_id ON user_favorites(product_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_created_at ON user_favorites(created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_favorites_unique ON user_favorites(user_id, product_id);

-- Reviews table indexes (if exists)
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- Blog articles indexes (if exists)
CREATE INDEX IF NOT EXISTS idx_blog_category ON blog_articles(category);
CREATE INDEX IF NOT EXISTS idx_blog_is_published ON blog_articles(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_published_at ON blog_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_updated_at ON blog_articles(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_search ON blog_articles USING GIN(
  to_tsvector('arabic', coalesce(title_ar, '') || ' ' || coalesce(content_ar, '') || ' ' || coalesce(summary_ar, ''))
);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_products_approved_category ON products(approved, categories) WHERE approved = true;
CREATE INDEX IF NOT EXISTS idx_news_published_category ON ai_news(is_published, category) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_news_published_featured ON ai_news(is_published, is_featured) WHERE is_published = true;

-- Analyze tables to update statistics
ANALYZE products;
ANALYZE ai_news;
ANALYZE courses;
ANALYZE user_favorites;

-- Comments for documentation
COMMENT ON INDEX idx_products_categories IS 'Index for filtering products by category';
COMMENT ON INDEX idx_products_tags IS 'GIN index for searching products by tags array';
COMMENT ON INDEX idx_products_search IS 'Full-text search index for products';
COMMENT ON INDEX idx_news_search IS 'Full-text search index for news articles';
COMMENT ON INDEX idx_user_favorites_unique IS 'Unique constraint to prevent duplicate favorites';