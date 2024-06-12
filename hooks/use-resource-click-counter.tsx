"use client"

import { useCallback } from "react"
import { createClient } from "@/db/supabase/client"

const supabase = createClient()

const useResourceCounter = () => {
  const incrementViewCount = useCallback(async (id: string) => {
    const { data, error } = await supabase.rpc("increment_view_count", {
      resource_id: id,
    })

    if (error) {
      console.error("Error incrementing view count:", error)
    } else {
      console.log("View count incremented:", data)
    }
  }, [])

  const incrementClickCount = useCallback(async (id: string) => {
    const { data, error } = await supabase.rpc("increment_click_count", {
      resource_id: id,
    })

    if (error) {
      console.error("Error incrementing click count:", error)
    } else {
      console.log("Click count incremented:", data)
    }
  }, [])

  return {
    incrementViewCount,
    incrementClickCount,
  }
}

export default useResourceCounter
