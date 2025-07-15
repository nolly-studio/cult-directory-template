import { NextResponse } from 'next/server'
import { getBlogArticles } from '@/app/actions/blog'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.arabie.ai'

export async function GET() {
  try {
    const blogArticles = await getBlogArticles(undefined, undefined, undefined, 1000)
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${blogArticles.map(article => `
  <url>
    <loc>${BASE_URL}/blog/${article.slug}</loc>
    <lastmod>${article.updated_at ? new Date(article.updated_at).toISOString() : new Date(article.published_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    ${article.featured_image_url ? `
    <image:image>
      <image:loc>${article.featured_image_url}</image:loc>
      <image:title>${article.title_ar}</image:title>
      <image:caption>${article.excerpt_ar}</image:caption>
    </image:image>` : ''}
  </url>`).join('')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Error generating blog sitemap:', error)
    return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    })
  }
}