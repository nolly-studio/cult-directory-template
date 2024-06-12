import * as React from "react"

import { cn } from "@/lib/utils"

function SearchIcon(props: any) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className=" h-5 w-5"
    >
      <path
        {...props}
        d="M21 21l-4.35-4.35M19 11a8 8 0 11-16 0 8 8 0 0116 0z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasIcon?: boolean
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div>
        <input
          type={type}
          className={cn(
            "relative flex h-10 w-full rounded-[9px] ",
            "bg-gradient-to-b from-white to-gray-50 text-black dark:from-[#303030] dark:to-gray-950 dark:text-white",
            "shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)]",
            "dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]",
            "dark:hover:shadow-[0_0_0_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.4),0_1px_2px_rgba(0,0,0,0.5)]",
            "px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400/20 focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

const InputButton = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasIcon, children, ...props }, ref) => {
    return (
      <div className="mt-2 flex w-full rounded-md ">
        <div
          className={cn(
            "relative w-full before:pointer-events-none before:absolute before:-inset-1 before:rounded-[9991px] before:border before:border-accent/20 before:opacity-0 before:ring-2 before:ring-neutral-100/40 before:transition dark:before:border-yellow-400/40 dark:before:ring-2 dark:before:ring-yellow-900/40",
            "input-shadow-glow after:pointer-events-none after:absolute after:inset-px after:rounded-[9987px] after:shadow-white/5 after:transition",
            "focus-within:before:opacity-100 focus-within:after:shadow-neutral-100/20 dark:after:shadow-white/5 dark:focus-within:after:shadow-yellow-500/30"
          )}
        >
          <input
            type="search"
            autoComplete="false"
            className={cn(
              "w-full  text-lg font-semibold",
              "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-stone-100 dark:focus:ring-neutral-900 ",
              "disabled:cursor-not-allowed disabled:opacity-50 sm:leading-6 ",
              "dark:border dark:border-black/40 ",
              "input-shadow rounded-[9988px] !outline-none",
              "relative border border-black/5 bg-white/90 py-4 pl-12 pr-7  shadow-black/5 placeholder:text-stone-400 focus:bg-white ",
              // " dark:bg-stone-950/50 dark:text-stone-200 dark:shadow-black/10 dark:placeholder:text-stone-500",
              " text-stone-800 dark:bg-neutral-800/70 dark:text-neutral-100 dark:shadow-black/10 dark:placeholder:text-stone-500",
              // "dark:focus:bg-neutral-900",
              className
            )}
            ref={ref}
            {...props}
          />
          {hasIcon ? (
            <div className="pointer-events-none absolute inset-y-0 left-0  flex items-center  pl-5">
              <SearchIcon className="stroke-stone-500/70" />
            </div>
          ) : null}
        </div>
        {children}
      </div>
    )
  }
)
InputButton.displayName = "InputButton"

export { Input, InputButton }
