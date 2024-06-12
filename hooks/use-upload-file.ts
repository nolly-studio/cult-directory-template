import * as React from "react"
import { createClient } from "@/db/supabase/client"
import { toast } from "sonner"

import { getErrorMessage } from "@/lib/error"

interface UseUploadFileProps {
  defaultUploadedFiles?: any[]
}

export function useUploadFile(
  bucket: string,
  { defaultUploadedFiles = [] }: UseUploadFileProps = {}
) {
  const supabase = createClient()
  const [uploadedFiles, setUploadedFiles] =
    React.useState<any[]>(defaultUploadedFiles)
  const [progresses, setProgresses] = React.useState<Record<string, number>>({})
  const [isUploading, setIsUploading] = React.useState(false)

  async function uploadFiles(files: File[]) {
    setIsUploading(true)
    try {
      const uploadPromises = files.map(async (file) => {
        console.log("uploadPromises", file.name)
        // console.log(file.name)
        const { data, error } = await supabase.storage
          .from("product-logos")
          .upload(`${file.name}`, file, {
            cacheControl: "3600",
            upsert: false,
          })

        if (error) {
          throw error
        }

        if (data) {
          return {
            name: file.name,
            url: `${
              supabase.storage.from("product-logos").getPublicUrl(data.path)
                .data.publicUrl
            }`,
          }
        }
      })

      const results = await Promise.all(uploadPromises)
      setUploadedFiles((prev) => (prev ? [...prev, ...results] : results))
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setProgresses({})
      setIsUploading(false)
    }
  }

  return {
    uploadedFiles,
    progresses,
    uploadFiles,
    isUploading,
  }
}
