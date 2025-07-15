import { NextResponse } from 'next/server'
import { getCourses } from '@/app/actions/courses'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.arabie.ai'

export async function GET() {
  try {
    const courses = await getCourses()
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${courses.map(course => `
  <url>
    <loc>${BASE_URL}/learn/${course.id}</loc>
    <lastmod>${course.updated_at ? new Date(course.updated_at).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    ${course.thumbnail_url ? `
    <image:image>
      <image:loc>${course.thumbnail_url}</image:loc>
      <image:title>${course.title_ar}</image:title>
      <image:caption>${course.description_ar}</image:caption>
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
    console.error('Error generating courses sitemap:', error)
    return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    })
  }
}