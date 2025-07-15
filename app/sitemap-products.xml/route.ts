import { NextResponse } from 'next/server'
import { getProducts } from '@/app/actions/product'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.arabie.ai'

export async function GET() {
  const products = await getProducts()
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${products.map(product => `
  <url>
    <loc>${BASE_URL}/products/${product.slug}</loc>
    <lastmod>${product.updated_at ? new Date(product.updated_at).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    ${product.logo_url ? `
    <image:image>
      <image:loc>${product.logo_url}</image:loc>
      <image:title>${product.name_ar}</image:title>
      <image:caption>${product.description_ar}</image:caption>
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