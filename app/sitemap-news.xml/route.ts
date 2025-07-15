import { NextResponse } from 'next/server'
import { getNews } from '@/app/actions/news'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.arabie.ai'

export async function GET() {
  const news = await getNews(undefined, 1000)
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${news.map(article => `
  <url>
    <loc>${BASE_URL}/news/${article.id}</loc>
    <lastmod>${article.updated_at ? new Date(article.updated_at).toISOString() : new Date(article.published_at).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <news:news>
      <news:publication>
        <news:name>الذكاء الاصطناعي العربي</news:name>
        <news:language>ar</news:language>
      </news:publication>
      <news:publication_date>${new Date(article.published_at).toISOString()}</news:publication_date>
      <news:title>${article.title_ar}</news:title>
      <news:keywords>${article.category}</news:keywords>
    </news:news>
  </url>`).join('')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}