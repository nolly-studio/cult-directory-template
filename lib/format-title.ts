/**
 * Format a slug into a proper title
 * e.g., "chatgpt-basics" -> "ChatGPT Basics"
 */
export function formatSlugToTitle(slug: string): string {
  const specialCases: Record<string, string> = {
    'chatgpt': 'ChatGPT',
    'ai': 'AI',
    'api': 'API',
    'ui': 'UI',
    'ux': 'UX',
    'seo': 'SEO',
    'cms': 'CMS',
    'crm': 'CRM',
    'erp': 'ERP',
    'saas': 'SaaS',
    'paas': 'PaaS',
    'iaas': 'IaaS',
  }

  return slug
    .split('-')
    .map(word => {
      // Check if word is a special case (case-insensitive)
      const lowerWord = word.toLowerCase()
      if (specialCases[lowerWord]) {
        return specialCases[lowerWord]
      }
      
      // Otherwise, capitalize first letter
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}

/**
 * Get display title with fallback
 */
export function getDisplayTitle(course: {
  title_en?: string | null
  title_ar: string
  slug: string
}, preferEnglish = false): { primary: string; secondary?: string } {
  if (preferEnglish && course.title_en) {
    return {
      primary: course.title_en,
      secondary: course.title_ar
    }
  }
  
  return {
    primary: course.title_ar,
    secondary: course.title_en || formatSlugToTitle(course.slug)
  }
}