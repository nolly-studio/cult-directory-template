import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  // {
  "",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b dark:from-white dark:to-gray-50 dark:text-black/80 from-[#303030] to-gray-950 text-white/90 border-[1px] border-black/30 dark:hover:text-black hover:text-white",
        destructive:
          "bg-destructive text-destructive-foreground  hover:bg-destructive/90",
        outline: " bg-background  hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-gradient-to-b from-white to-gray-50 text-black/80 dark:from-[#303030] dark:to-gray-950 dark:text-white/90 dark:border-[1px] dark:border-black/30 hover:text-black dark:hover:text-white",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          "relative inline-flex items-center px-4 py-2 group",
          "text-base font-medium leading-6 rounded-[9px]",
          "shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)]",
          "dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]",
          "dark:hover:shadow-[0_0_0_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.4),0_1px_2px_rgba(0,0,0,0.5)]",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/20",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        style={{ backgroundClip: "padding-box" }}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
