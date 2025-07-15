import "./globals.css"
import { ReactNode } from "react"
import localFont from "next/font/local"
import Script from "next/script"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { TopNavbar } from "@/components/top-navbar"
import { SmartBreadcrumb } from "@/components/smart-breadcrumb"
import { SidebarProvider } from "@/contexts/sidebar-context"
import { GoogleAnalytics } from "@/components/analytics"
import { Analytics } from "@vercel/analytics/next"

import { ThemeProvider } from "./providers"

export const fontSans = localFont({
  src: "../fonts/haskoy.ttf",
  variable: "--font-sans",
})

const defaultUrl = process.env.VERCEL_URL
  ? `https://arabie.ai`
  : "http://localhost:3000"

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "العربي للذكاء الاصطناعي - مركزك الشامل لأدوات الذكاء الاصطناعي",
  description:
    "اكتشف أفضل أدوات الذكاء الاصطناعي مع شروحات باللغة العربية. ChatGPT، Midjourney، وأكثر. دروس، أخبار، ومصادر تعليمية للمجتمع العربي.",
  keywords:
    "ذكاء اصطناعي، أدوات AI، ChatGPT عربي، Midjourney، تعلم الذكاء الاصطناعي، دروس عربية، AI tools Arabic",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32", type: "image/x-icon" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-touch-icon.png",
        sizes: "180x180",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/icon-192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        url: "/icon-512.png",
      },
    ],
  },
  structuredData: [
    {
      "@context": "http://schema.org",
      "@type": "WebSite",
      name: "العربي للذكاء الاصطناعي",
      url: "https://arabie.ai/",
      description:
        "المنصة العربية الشاملة لأدوات وموارد الذكاء الاصطناعي للمجتمع العربي.",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://arabie.ai/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "http://schema.org",
      "@type": "Organization",
      name: "العربي للذكاء الاصطناعي",
      url: "https://arabie.ai/",
      logo: "https://arabie.ai/arabieailogo.png",
      description:
        "المنصة العربية الشاملة لأدوات وموارد الذكاء الاصطناعي للمجتمع العربي.",
      foundingDate: "2024",
      areaServed: "عالمي",
      sameAs: [
        "https://twitter.com/arabie_ai",
        "https://linkedin.com/company/arabie-ai",
        "https://github.com/arabie-ai",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "contact@arabie.ai",
        availableLanguage: ["ar", "en"],
      },
    },
  ],
  socialMediaTags: {
    "og:title": "العربي للذكاء الاصطناعي - مركزك الشامل لأدوات AI",
    "og:description":
      "اكتشف أفضل أدوات الذكاء الاصطناعي مع شروحات باللغة العربية. دروس، أخبار، ومصادر تعليمية.",
    "twitter:card": "summary_large_image",
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${fontSans.variable} font-sans`} suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
      </head>
      <body className="arabic-font" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <SidebarProvider>
              <TopNavbar />
              <SmartBreadcrumb />
              <main className="bg-[#FAFAFA] dark:bg-background text-foreground w-full min-h-screen">
                {children}
              </main>
            </SidebarProvider>
          </TooltipProvider>
          <Toaster richColors />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
