import { ReactElement } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/db/supabase/server"

import { FadeIn } from "@/components/cult/fade-in"

import { NavSidebar } from "../../components/nav"
import { AdaptiveLayout } from "@/components/adaptive-layout"
import { getCachedFilters } from "../actions/cached_actions"
import SubmitTool from "./form"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function ProtectedSubmitPage(): Promise<ReactElement> {
  let filters: { categories: string[]; labels: string[]; tags: string[] } = { 
    categories: [], 
    labels: [], 
    tags: [] 
  }
  
  // Check if we have environment variables (build vs runtime)
  const hasEnvVars = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!hasEnvVars) {
    // During build time without env vars, return static version
    return (
      <>
        <NavSidebar
          categories={[]}
          labels={[]}
          tags={[]}
        />
        <div className="flex flex-col md:flex-row items-start justify-center py-12 px-4 md:px-0">
          <div className="flex flex-col items-start justify-center gap-2 md:pl-48">
            <div className="flex items-center space-x-2">
              <h1 className="text-5xl font-black text-right">اقترح أداة</h1>
            </div>
            <div className="flex flex-col items-start mt-4">
              <div className="flex items-center mt-2">
                <span className="mx-2 text-xl font-bold text-right">
                  ساعدنا في بناء أكبر دليل عربي للذكاء الاصطناعي
                </span>
              </div>
              <div className="flex items-center gap-1 pl-3">
                <p className="mt-2 text-right text-gray-600 text-pretty">
                  اقترح أدوات الذكاء الاصطناعي المفضلة لديك <br />
                  واحصل على رابط لموقعك ووصول لأكثر من 10,000 مستخدم
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full flex flex-col items-center ">
            <div className="flex-1 flex flex-col gap-6 py-4">
              <FadeIn>
                <SubmitTool />
              </FadeIn>
            </div>
          </div>
        </div>
      </>
    )
  }

  try {
    filters = await getCachedFilters()
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return redirect("/login?redirect=/submit")
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    // Continue with empty data
  }

  return (
    <>
      <NavSidebar
        categories={filters.categories}
        labels={filters.labels}
        tags={filters.tags}
      />

      <AdaptiveLayout className="flex flex-col md:flex-row items-start justify-center py-12 px-4 md:px-0">
        <div className="flex flex-col items-start justify-center gap-2 md:pl-48">
          <div className="flex items-center space-x-2">
            <h1 className="text-5xl font-black text-right">اقترح أداة</h1>
          </div>
          <div className="flex flex-col items-start mt-4">
            <div className="flex items-center mt-2">
              <span className="mx-2 text-xl font-bold text-right">
                ساعدنا في بناء أكبر دليل عربي للذكاء الاصطناعي
              </span>
            </div>
            <div className="flex items-center gap-1 pl-3">
              <p className="mt-2 text-right text-gray-600 text-pretty">
                اقترح أدوات الذكاء الاصطناعي المفضلة لديك <br />
                واحصل على رابط لموقعك ووصول لأكثر من 10,000 مستخدم
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 w-full flex flex-col items-center ">
          <div className="flex-1 flex flex-col gap-6 py-4">
            <FadeIn>
              <SubmitTool />
            </FadeIn>
          </div>
        </div>
      </AdaptiveLayout>
    </>
  )
}
