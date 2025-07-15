import { MetadataRoute } from 'next'
import { getProducts } from '@/app/actions/product'
import { getTutorials } from '@/app/actions/tutorials'
import { getLatestNews } from '@/app/actions/news'
import { getBlogArticles } from '@/app/actions/blog'

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.arabie.ai'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all dynamic content
  const [products, tutorials, news, blogArticles] = await Promise.all([
    getProducts(), // Get all products
    getTutorials(),
    getLatestNews(1000), // Get all news
    getBlogArticles(undefined, undefined, undefined, 1000), // Get all blog articles
  ])

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/tutorials`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    // SEO Landing Pages
    {
      url: `${BASE_URL}/chatgpt-arabic`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/ai-tools-arabic`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/midjourney-arabic`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/claude-arabic`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/ai-tools-comparison`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // Product pages
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Tutorial pages
  const tutorialPages: MetadataRoute.Sitemap = tutorials.map((tutorial) => ({
    url: `${BASE_URL}/tutorials/${tutorial.id}`,
    lastModified: tutorial.updated_at ? new Date(tutorial.updated_at) : tutorial.created_at ? new Date(tutorial.created_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  // News pages
  const newsPages: MetadataRoute.Sitemap = news.map((article) => ({
    url: `${BASE_URL}/news/${article.id}`,
    lastModified: article.updated_at ? new Date(article.updated_at) : new Date(article.published_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  // Blog pages
  const blogPages: MetadataRoute.Sitemap = blogArticles.map((article) => ({
    url: `${BASE_URL}/blog/${article.slug}`,
    lastModified: article.updated_at ? new Date(article.updated_at) : new Date(article.published_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticPages, ...productPages, ...tutorialPages, ...newsPages, ...blogPages]
}