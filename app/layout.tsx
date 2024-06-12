import "./globals.css"
import { ReactNode } from "react"
import localFont from "next/font/local"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

import { ThemeProvider } from "./providers"

export const fontSans = localFont({
  src: "../fonts/haskoy.ttf",
  variable: "--font-sans",
})

const defaultUrl = process.env.VERCEL_URL
  ? `https://www.nextjs.design`
  : "http://localhost:3000"

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Design x Engineering Directory - Discover Top Web Dev Tools",
  description:
    "Explore a curated directory of free web development tools for designers and engineers. Find resources for JavaScript, Tailwind CSS, and more!",
  keywords:
    "Design, Engineering, Web Development, JavaScript, Tailwind CSS, Supabase, Free Tools, Design Engineering",
  structuredData: {
    "@context": "http://schema.org",
    "@type": "WebSite",
    name: "Design x Engineering Directory",
    url: "https://www.nextjs.design/",
    description:
      "A free directory of awesome web development tools for design and engineering professionals.",
  },
  socialMediaTags: {
    "og:title": "Design x Engineering Directory - Discover Top Web Dev Tools",
    "og:description":
      "Explore a curated directory of free web development tools for designers and engineers. Find resources for JavaScript, Tailwind CSS, and more!",
    "twitter:card": "summary_large_image",
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fontSans.variable} font-sans  `}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <main className="bg-[#FAFAFA] dark:bg-background  text-foreground flex flex-col justify-center items-center w-full pt-13">
              <div className=" w-full ">{children}</div>
            </main>
          </TooltipProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
