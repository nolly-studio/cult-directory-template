"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/db/supabase/client"

import { ChangePassword } from "./form"

export default function ChangePasswordPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const session = (await supabase.auth.getSession()).data.session

      if (!session) {
        router.push("/login")
      } else {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return null
  }

  return <ChangePassword />
}
