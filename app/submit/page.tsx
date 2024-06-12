import { ReactElement } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/db/supabase/server"

import { FadeIn } from "@/components/cult/fade-in"

import { NavSidebar } from "../../components/nav"
import { getCachedFilters } from "../actions/cached_actions"
import SubmitTool from "./form"

export default async function ProtectedSubmitPage(): Promise<ReactElement> {
  let filters = await getCachedFilters()
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  return (
    <>
      <NavSidebar
        categories={filters.categories}
        labels={filters.labels}
        tags={filters.tags}
      />

      <div className="flex flex-col md:flex-row items-start justify-center py-12 px-4 md:px-0">
        <div className="flex flex-col items-start justify-center gap-2 md:pl-48">
          <div className="flex items-center space-x-2">
            <h1 className="text-5xl font-black ">_submit</h1>
          </div>
          <div className="flex flex-col items-start mt-4">
            <div className="flex items-center mt-2">
              <span className="mx-2 text-xl font-bold">
                Submit your tool for approval
              </span>
            </div>
            <div className="flex  items-center gap-1 pl-3">
              <p className="mt-2 text-left text-gray-600  text-pretty">
                Submit products. Build backlinks. <br />
                Grow seo reach. Get paid.
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
