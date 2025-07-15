import { NewsArticle } from '@/app/actions/news'

interface ProductStructuredData {
  id: string
  name_ar: string
  name_en?: string
  description_ar: string
  description_en?: string
  logo_url?: string
  website_url?: string
  pricing_type?: string
  category?: string
  view_count?: number
  created_at: string
  updated_at?: string
}

interface CourseStructuredData {
  id: string
  title_ar: string
  title_en?: string
  description_ar: string
  description_en?: string
  difficulty_level?: string
  total_duration_minutes?: number
  lesson_count?: number
  price?: number
  currency?: string
  thumbnail_url?: string
  created_at: string
  updated_at?: string
}

export function ProductStructuredData({ product }: { product: ProductStructuredData }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": product.name_ar,
    "alternateName": product.name_en,
    "description": product.description_ar,
    "url": product.website_url,
    "image": product.logo_url,
    "applicationCategory": "AI Tool",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": product.pricing_type === 'free' ? "0" : "varies",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": product.view_count && product.view_count > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": Math.min(5, Math.max(3, (product.view_count / 1000) + 3)),
      "reviewCount": Math.max(1, Math.floor(product.view_count / 100)),
      "bestRating": 5,
      "worstRating": 1
    } : undefined,
    "datePublished": product.created_at,
    "dateModified": product.updated_at || product.created_at,
    "author": {
      "@type": "Organization",
      "name": "العربي للذكاء الاصطناعي",
      "url": "https://arabie.ai"
    },
    "publisher": {
      "@type": "Organization",
      "name": "العربي للذكاء الاصطناعي",
      "url": "https://arabie.ai",
      "logo": {
        "@type": "ImageObject",
        "url": "https://arabie.ai/assets/logo-black-1200x1200.png"
      }
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function NewsStructuredData({ article }: { article: NewsArticle }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title_ar,
    "alternativeHeadline": article.title_en,
    "description": article.summary_ar || article.summary,
    "image": article.image_url ? [article.image_url] : undefined,
    "datePublished": article.published_at,
    "dateModified": article.updated_at || article.published_at,
    "author": {
      "@type": "Person",
      "name": article.author || "فريق العربي للذكاء الاصطناعي"
    },
    "publisher": {
      "@type": "Organization",
      "name": "العربي للذكاء الاصطناعي",
      "url": "https://arabie.ai",
      "logo": {
        "@type": "ImageObject",
        "url": "https://arabie.ai/assets/logo-black-1200x1200.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://arabie.ai/news/${article.id}`
    },
    "articleSection": article.category,
    "keywords": article.category,
    "wordCount": article.content_ar ? article.content_ar.split(' ').length : undefined,
    "inLanguage": "ar"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function CourseStructuredData({ course }: { course: CourseStructuredData }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title_ar,
    "alternateName": course.title_en,
    "description": course.description_ar,
    "image": course.thumbnail_url,
    "provider": {
      "@type": "Organization",
      "name": "العربي للذكاء الاصطناعي",
      "url": "https://arabie.ai"
    },
    "offers": {
      "@type": "Offer",
      "price": course.price || 0,
      "priceCurrency": course.currency || "USD",
      "availability": "https://schema.org/InStock"
    },
    "educationalLevel": course.difficulty_level,
    "timeRequired": course.total_duration_minutes ? `PT${course.total_duration_minutes}M` : undefined,
    "numberOfLessons": course.lesson_count,
    "inLanguage": "ar",
    "datePublished": course.created_at,
    "dateModified": course.updated_at || course.created_at,
    "publisher": {
      "@type": "Organization",
      "name": "العربي للذكاء الاصطناعي",
      "url": "https://arabie.ai",
      "logo": {
        "@type": "ImageObject",
        "url": "https://arabie.ai/assets/logo-black-1200x1200.png"
      }
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function BreadcrumbStructuredData({ items }: { items: { name: string; url: string }[] }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function FAQStructuredData({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}