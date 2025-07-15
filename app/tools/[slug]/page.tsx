import { notFound, redirect } from "next/navigation"
import { Metadata } from "next"

import { FadeIn } from "@/components/cult/fade-in"
import { getProductById, getProductBySlug, incrementProductViews } from "@/app/actions/product"

import { ProductDetails } from "./details"

// Enhanced JSON-LD structured data for better SEO
function generateProductJsonLd(product: any) {
  const arabicName = product.arabic_name || product.codename
  const englishName = product.codename
  
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${arabicName} بالعربي`,
    alternateName: englishName,
    description: product.arabic_description || product.description || `${arabicName} - أداة ذكاء اصطناعي متقدمة مع شرح مفصل باللغة العربية`,
    image: product.logo_src,
    applicationCategory: product.categories || "AI Tool",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: product.is_free ? "0" : "N/A",
      priceCurrency: product.is_free ? "USD" : undefined,
      availability: "https://schema.org/InStock"
    },
    aggregateRating: product.averageRating ? {
      "@type": "AggregateRating",
      ratingValue: product.averageRating,
      reviewCount: product.reviewCount || 0,
      bestRating: 5,
      worstRating: 1
    } : undefined,
    author: {
      "@type": "Organization",
      name: "العربي للذكاء الاصطناعي",
      url: "https://arabie.ai",
      logo: "https://arabie.ai/logo.png"
    },
    publisher: {
      "@type": "Organization",
      name: "العربي للذكاء الاصطناعي",
      url: "https://arabie.ai"
    },
    inLanguage: ["ar", "en"],
    keywords: [
      `${arabicName} بالعربي`,
      `${englishName} شرح عربي`,
      `كيفية استخدام ${arabicName}`,
      "أدوات الذكاء الاصطناعي",
      product.categories,
      product.tags?.join(", ")
    ].filter(Boolean).join(", "),
    url: `https://theaiarab.com/tools/${product.codename.toLowerCase().replace(/\./g, '-').replace(/\s+/g, '-')}`,
    datePublished: product.created_at,
    dateModified: product.updated_at || product.created_at,
    isAccessibleForFree: product.is_free,
    educationalUse: "تعلم استخدام أدوات الذكاء الاصطناعي",
    audience: {
      "@type": "Audience",
      audienceType: "المستخدمين العرب المهتمين بالذكاء الاصطناعي"
    }
  }
}

export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const data = await getProductBySlug(params.slug)
  
  if (!data || data.length === 0) {
    return {
      title: "الأداة غير موجودة - العربي للذكاء الاصطناعي"
    }
  }

  const product = data[0]
  
  // Create SEO-optimized title and description
  const arabicName = product.arabic_name || product.codename
  const englishName = product.codename
  const seoTitle = `${arabicName} بالعربي - شرح مفصل وطريقة الاستخدام | العربي للذكاء الاصطناعي`
  const seoDescription = product.arabic_description || product.description || 
    `اكتشف ${arabicName} (${englishName}) - أداة ذكاء اصطناعي متقدمة مع شرح مفصل باللغة العربية. ابدأ الآن مجاناً ⚡`
  
  // Add relevant keywords
  const keywords = [
    `${arabicName} بالعربي`,
    `${englishName} شرح عربي`,
    `كيفية استخدام ${arabicName}`,
    `أدوات الذكاء الاصطناعي`,
    `${arabicName} مجاني`,
    `AI tools Arabic`,
    product.categories,
    product.difficulty_level
  ].filter(Boolean).join(', ')

  return {
    title: seoTitle,
    description: seoDescription,
    keywords,
    openGraph: {
      title: `${arabicName} بالعربي - شرح مفصل`,
      description: seoDescription,
      images: product.logo_src ? [product.logo_src] : undefined,
      type: 'website',
      url: `https://arabie.ai/tools/${product.codename.toLowerCase().replace(/\./g, '-').replace(/\s+/g, '-')}`,
      siteName: 'العربي للذكاء الاصطناعي',
      locale: 'ar_SA',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${arabicName} بالعربي`,
      description: seoDescription,
      images: product.logo_src ? [product.logo_src] : undefined,
    },
    alternates: {
      canonical: `https://arabie.ai/tools/${product.codename.toLowerCase().replace(/\./g, '-').replace(/\s+/g, '-')}`,
    }
  }
}

const ToolIdPage = async ({ 
  params, 
  searchParams 
}: { 
  params: { slug: string }
  searchParams: { from?: string; category?: string; tag?: string; label?: string }
}) => {
  let data = await getProductBySlug(params.slug)

  if (!data || data.length === 0) {
    notFound()
    // redirect("/")
  }

  const product = data[0]

  // Increment view count (fire and forget)
  incrementProductViews(product.id).catch(console.error)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateProductJsonLd(product)),
        }}
      />
      <div className="z-10">
        <div className=" py-4 w-full relative  mx-auto max-w-6xl">
          <FadeIn>{data ? <ProductDetails product={product} searchParams={searchParams} /> : null}</FadeIn>
        </div>
      </div>
    </>
  )
}

export default ToolIdPage 