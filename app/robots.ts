import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.arabie.ai'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/_next/',
          '/static/',
          '/temp/',
          '/private/',
          '/*.json',
          '/*.xml',
          '/sitemap-*.xml',
        ],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'CCBot',
        allow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
      },
    ],
    sitemap: [
      `${BASE_URL}/sitemap.xml`,
      `${BASE_URL}/sitemap-news.xml`,
      `${BASE_URL}/sitemap-products.xml`,
      `${BASE_URL}/sitemap-tools.xml`,
      `${BASE_URL}/sitemap-courses.xml`,
      `${BASE_URL}/sitemap-blog.xml`,
    ],
    host: BASE_URL,
  }
}