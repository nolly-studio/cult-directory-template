"use client"

import { useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { InputButton } from "@/components/ui/input"

import { IconSpinner } from "./ui/icons"

export function DirectorySearch() {
  let router = useRouter()
  let pathname = usePathname()

  let [isPending, startTransition] = useTransition()

  let handleSearch = (term: string) => {
    let params = new URLSearchParams(window.location.search)
    if (term) {
      params.set("search", term)
    } else {
      params.delete("search")
    }
    params.delete("page")
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value)
  }

  return (
    <div className="relative max-w-[90%] md:min-w-[4rem] w-full md:max-w-[42ch] md:mr-auto ">
      <InputButton
        hasIcon
        id="search"
        className={cn("relative pr-10 pl-12 shadow-sm md:py-5 w-full")}
        tabIndex={0}
        onChange={handleInputChange}
        placeholder="Search all resources"
        spellCheck={false}
        enterKeyHint="go"
      >
        <div className="relative -ml-10 hidden items-center justify-center md:flex">
          <div className="absolute ml-4 w-14 rounded-r-full">
            <AnimatePresence>
              {isPending ? (
                <IconSpinner className="-ml-0.5 h-7 w-7 animate-spin stroke-teal-500/80 group-hover:text-teal-500 dark:stroke-teal-400 dark:group-hover:text-teal-300" />
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </InputButton>
    </div>
  )
}
