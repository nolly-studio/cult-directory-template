import { createClient } from "@/db/supabase/server"

export interface NewsArticle {
  id: string
  title_ar: string
  title_en?: string
  content_ar?: string
  content_en?: string
  summary_ar?: string
  summary_en?: string
  summary?: string
  author?: string
  category: string
  published_at: string
  view_count: number
  image_url?: string
  is_featured: boolean
  created_at: string
  updated_at?: string
}

export async function getNews(category?: string, limit?: number): Promise<NewsArticle[]> {
  const supabase = createClient()
  
  let query = supabase
    .from('ai_news')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }
  
  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching news:', error)
    }
    throw new Error('فشل في تحميل الأخبار. يرجى المحاولة مرة أخرى.')
  }

  return data || []
}

export async function getNewsById(id: string): Promise<NewsArticle | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('ai_news')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single()

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching news article:', error)
    }
    throw new Error('فشل في تحميل المقال. يرجى المحاولة مرة أخرى.')
  }

  return data
}

export async function getFeaturedNews(limit: number = 3): Promise<NewsArticle[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('ai_news')
    .select('*')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching featured news:', error)
    }
    throw new Error('فشل في تحميل الأخبار المميزة. يرجى المحاولة مرة أخرى.')
  }

  return data || []
}

export async function getNewsFilters(): Promise<{ categories: string[] }> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('ai_news')
    .select('category')
    .eq('is_published', true)

  if (error) {
    console.error('Error fetching news filters:', error)
    return { categories: [] }
  }

  // Extract unique categories
  const categories = [...new Set(data?.map(item => item.category).filter(Boolean))] || []

  return { categories }
}

export async function incrementNewsViews(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.rpc('increment_news_view_count', {
    news_id: id
  })

  if (error) {
    console.error('Error incrementing news view count:', error)
  }
}

export async function getNewsByCategory(): Promise<Record<string, NewsArticle[]>> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('ai_news')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(20) // Limit total to prevent too much data

  if (error) {
    console.error('Error fetching news by category:', error)
    return {}
  }

  // Group by category
  const grouped = (data || []).reduce((acc, article) => {
    const category = article.category || 'عام'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(article)
    return acc
  }, {} as Record<string, NewsArticle[]>)

  return grouped
}

export async function getLatestNews(limit: number = 5): Promise<NewsArticle[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('ai_news')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching latest news:', error)
    return []
  }

  return data || []
} 