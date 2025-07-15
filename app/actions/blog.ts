import { createClient } from "@/db/supabase/server"

export interface BlogArticle {
  id: string
  title_ar: string
  title_en?: string
  slug: string
  content_ar: string
  content_en?: string
  excerpt_ar?: string
  excerpt_en?: string
  meta_description_ar?: string
  meta_description_en?: string
  keywords: string[]
  author_id?: string
  author_name: string
  author_bio?: string
  author_avatar_url?: string
  category: string
  subcategory?: string
  tags: string[]
  series_name?: string
  series_part?: number
  difficulty_level?: string
  estimated_reading_time: number
  featured_image_url?: string
  table_of_contents?: any
  related_articles: string[]
  related_products: string[]
  view_count: number
  like_count: number
  share_count: number
  is_featured: boolean
  is_published: boolean
  is_series_complete: boolean
  published_at: string
  created_at: string
  updated_at?: string
}

export interface BlogAuthor {
  id: string
  user_id?: string
  name_ar: string
  name_en?: string
  bio_ar?: string
  bio_en?: string
  avatar_url?: string
  expertise_areas: string[]
  social_links?: any
  article_count: number
  total_views: number
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface BlogCategory {
  id: string
  name_ar: string
  name_en?: string
  slug: string
  description_ar?: string
  description_en?: string
  parent_id?: string
  article_count: number
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface BlogSeries {
  id: string
  title_ar: string
  title_en?: string
  slug: string
  description_ar?: string
  description_en?: string
  cover_image_url?: string
  total_parts: number
  completed_parts: number
  is_complete: boolean
  difficulty_level?: string
  estimated_total_time: number
  created_at: string
  updated_at?: string
}

// Blog Articles functions
export async function getBlogArticles(
  category?: string,
  tag?: string,
  series?: string,
  limit?: number,
  offset?: number
): Promise<BlogArticle[]> {
  const supabase = createClient()
  
  let query = supabase
    .from('blog_articles')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }
  
  if (tag) {
    query = query.contains('tags', [tag])
  }
  
  if (series) {
    query = query.eq('series_name', series)
  }
  
  if (limit) {
    query = query.limit(limit)
  }
  
  if (offset) {
    query = query.range(offset, offset + (limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching blog articles:', error)
    return []
  }

  return data || []
}

export async function getBlogArticleBySlug(slug: string): Promise<BlogArticle | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('blog_articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) {
    console.error('Error fetching blog article:', error)
    return null
  }

  return data
}

export async function getFeaturedBlogArticles(limit: number = 3): Promise<BlogArticle[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('blog_articles')
    .select('*')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured blog articles:', error)
    return []
  }

  return data || []
}

export async function getLatestBlogArticles(limit: number = 5): Promise<BlogArticle[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('blog_articles')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching latest blog articles:', error)
    return []
  }

  return data || []
}

export async function getRelatedBlogArticles(
  articleId: string,
  category: string,
  tags: string[],
  limit: number = 3
): Promise<BlogArticle[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('blog_articles')
    .select('*')
    .eq('is_published', true)
    .neq('id', articleId)
    .or(`category.eq.${category},tags.ov.{${tags.join(',')}}`)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching related blog articles:', error)
    return []
  }

  return data || []
}

export async function getBlogArticlesBySeries(seriesName: string): Promise<BlogArticle[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('blog_articles')
    .select('*')
    .eq('is_published', true)
    .eq('series_name', seriesName)
    .order('series_part', { ascending: true })

  if (error) {
    console.error('Error fetching blog articles by series:', error)
    return []
  }

  return data || []
}

// Blog Authors functions
export async function getBlogAuthors(): Promise<BlogAuthor[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('blog_authors')
    .select('*')
    .eq('is_active', true)
    .order('total_views', { ascending: false })

  if (error) {
    console.error('Error fetching blog authors:', error)
    return []
  }

  return data || []
}

export async function getBlogAuthorByUserId(userId: string): Promise<BlogAuthor | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('blog_authors')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching blog author:', error)
    return null
  }

  return data
}

// Blog Categories functions
export async function getBlogCategories(): Promise<BlogCategory[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching blog categories:', error)
    return []
  }

  return data || []
}

export async function getBlogCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching blog category:', error)
    return null
  }

  return data
}

// Blog Series functions
export async function getBlogSeries(): Promise<BlogSeries[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('blog_series')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching blog series:', error)
    return []
  }

  return data || []
}

export async function getBlogSeriesBySlug(slug: string): Promise<BlogSeries | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('blog_series')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching blog series:', error)
    return null
  }

  return data
}

// Interaction functions
export async function incrementBlogViewCount(articleId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.rpc('increment_blog_view_count', {
    article_id: articleId
  })

  if (error) {
    console.error('Error incrementing blog view count:', error)
  }
}

export async function incrementBlogLikeCount(articleId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.rpc('increment_blog_like_count', {
    article_id: articleId
  })

  if (error) {
    console.error('Error incrementing blog like count:', error)
  }
}

export async function incrementBlogShareCount(articleId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.rpc('increment_blog_share_count', {
    article_id: articleId
  })

  if (error) {
    console.error('Error incrementing blog share count:', error)
  }
}

// Search and filter functions
export async function searchBlogArticles(
  query: string,
  category?: string,
  limit?: number
): Promise<BlogArticle[]> {
  const supabase = createClient()

  let dbQuery = supabase
    .from('blog_articles')
    .select('*')
    .eq('is_published', true)
    .or(`title_ar.ilike.%${query}%,content_ar.ilike.%${query}%,keywords.cs.{${query}}`)

  if (category) {
    dbQuery = dbQuery.eq('category', category)
  }

  if (limit) {
    dbQuery = dbQuery.limit(limit)
  }

  dbQuery = dbQuery.order('published_at', { ascending: false })

  const { data, error } = await dbQuery

  if (error) {
    console.error('Error searching blog articles:', error)
    return []
  }

  return data || []
}

export async function getBlogStats(): Promise<{
  totalArticles: number
  totalViews: number
  totalAuthors: number
  totalCategories: number
}> {
  const supabase = createClient()

  const [
    { count: totalArticles },
    { data: viewsData },
    { count: totalAuthors },
    { count: totalCategories }
  ] = await Promise.all([
    supabase
      .from('blog_articles')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true),
    supabase
      .from('blog_articles')
      .select('view_count')
      .eq('is_published', true),
    supabase
      .from('blog_authors')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true),
    supabase
      .from('blog_categories')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
  ])

  const totalViews = viewsData?.reduce((sum, article) => sum + (article.view_count || 0), 0) || 0

  return {
    totalArticles: totalArticles || 0,
    totalViews,
    totalAuthors: totalAuthors || 0,
    totalCategories: totalCategories || 0
  }
}