import { NextResponse } from 'next/server'
import { getProducts } from '@/app/actions/product'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.arabie.ai'

export async function GET() {
  const tools = await getProducts()
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${tools.map(tool => `
  <url>
    <loc>${BASE_URL}/tools/${tool.id}</loc>
    <lastmod>${tool.updated_at ? new Date(tool.updated_at).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    ${tool.logo_src ? `
    <image:image>
      <image:loc>${tool.logo_src}</image:loc>
      <image:title>${tool.codename}</image:title>
      <image:caption>${tool.description}</image:caption>
    </image:image>` : ''}
  </url>`).join('')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}