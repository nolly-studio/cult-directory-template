"use client"

import { ReactNode, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/db/supabase/client"
import {
  BarChartIcon,
  BoxIcon,
  FilterIcon,
  FolderOpenIcon,
  Hash,
  HomeIcon,
  LogIn,
  LogOutIcon,
  PanelLeftIcon,
  PlusIcon,
  TagIcon,
  UsersIcon,
} from "lucide-react"

import { cn, truncateString } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ModeToggle } from "@/app/providers"

export function NavSidebar({
  categories,
  tags,
  labels,
}: {
  categories?: string[]
  labels?: string[]
  tags?: string[]
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isSheetOpen, setSheetOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    const db = await createClient()
    const { error } = await db.auth.signOut()
    if (error) {
      console.error("Error logging out:", error.message)
    } else {
      router.push("/login") // Redirect to login page after logout
    }
  }

  const handleLinkClick = () => {
    setSheetOpen(false)
  }

  return (
    <>
      <aside
        className={cn(
          pathname.includes("admin")
            ? "w-16 border-r border-black/10 dark:border-white/10"
            : "w-42",
          "fixed inset-y-0 left-0 z-10 hidden sm:flex flex-col bg-[#FAFAFA] dark:bg-background"
        )}
      >
        <nav className="flex flex-col items-center gap-4 px-2 py-5">
          {pathname.includes("admin") ? (
            <>
              <LogoAnimationLink />
              <AdminNav pathname={pathname} />
            </>
          ) : (
            <ProductNav
              categories={categories}
              tags={tags}
              labels={labels}
              searchParams={searchParams}
            />
          )}
        </nav>

        <div
          className={
            pathname.includes("admin")
              ? "flex flex-col gap-4 items-center py-5 mt-auto px-2 mx-2"
              : "pl-3 flex flex-col justify-center gap-4 items-start pb-8"
          }
        >
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarFallback className="bg-gradient-to-r from-yellow-300 to-yellow-300" />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-gradient-to-t from-primary/70 to-primary/80 rounded-lg"
            >
              <div className="p-[1px] bg-background rounded-md">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-primary" />
                <DropdownMenuItem>
                  <Link href="/admin">Admin</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-primary" />
                <DropdownMenuItem>
                  <Button className="w-full" onClick={handleLogout}>
                    <LogOutIcon className="mr-1 size-4" /> Logout
                  </Button>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="">
            <ModeToggle />
          </div>
        </div>
      </aside>
      <div className="flex flex-col gap-4 pb-2 px-2">
        <header
          className={cn(
            "sticky top-0 z-30 flex h-14 mx-1 md:mx-0 rounded-b-lg items-center gap-4 bg-background dark:bg-[#1E1E1E] px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6",
            "shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)]",
            "dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]"
          )}
        >
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="sm:hidden bg-accent">
                <PanelLeftIcon />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <div className="ml-auto mt-1 md:hidden">
              <LogoAnimationLink />
            </div>
            <SheetContent
              side="left"
              className="sm:max-w-[15rem] py-4 pl-1 border-r border-primary/10"
            >
              <nav className="flex flex-col items-start gap-4 px-2 py-5">
                {pathname.includes("admin") ? (
                  <>
                    <LogoAnimationLink />
                    <AdminNav pathname={pathname} />
                  </>
                ) : (
                  <>
                    <ProductNav
                      tags={tags}
                      labels={labels}
                      categories={categories}
                      handleLinkClick={handleLinkClick}
                      searchParams={searchParams}
                    >
                      <div className="my-4 space-y-3">
                        <Link
                          href="/"
                          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                          prefetch={false}
                          onClick={handleLinkClick}
                        >
                          <HomeIcon className="h-5 w-5" />
                          Home
                        </Link>
                        <Link
                          href="/submit"
                          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                          prefetch={false}
                          onClick={handleLinkClick}
                        >
                          <PlusIcon className="h-5 w-5" />
                          Submit
                        </Link>

                        <Link
                          href="/login"
                          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                          prefetch={false}
                          onClick={handleLinkClick}
                        >
                          <LogIn className="h-5 w-5" />
                          Login
                        </Link>
                      </div>
                    </ProductNav>
                  </>
                )}
              </nav>
              <div className="flex flex-col items-start pl-4">
                <nav className="mb-6   flex gap-4 ">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-r from-yellow-300 to-yellow-300" />
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-gradient-to-t from-primary/70 to-primary/80 rounded-lg"
                    >
                      <div className="p-[1px] bg-background rounded-md">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-primary" />
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-primary" />
                        <DropdownMenuItem>
                          <Button className="w-full" onClick={handleLogout}>
                            <LogOutIcon className="mr-1 size-4" /> Logout
                          </Button>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <ModeToggle />
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </header>
      </div>
    </>
  )
}

type ProductNavProps = {
  categories?: string[]
  tags?: string[]
  labels?: string[]
  handleLinkClick?: () => void
  searchParams: URLSearchParams
  children?: ReactNode
}

function ProductNav({
  categories,
  tags,
  labels,
  searchParams,
  handleLinkClick,
  children,
}: ProductNavProps) {
  return (
    <div className="">
      <LogoAnimationLink />
      {children}
      <ScrollArea className="h-[calc(100vh-320px)] md:h-[calc(100vh-200px)] flex flex-col gap-4 pl-2">
        {categories && categories?.length > 0 && (
          <div className="flex items-center gap-2 mt-6 text-muted-foreground">
            <BoxIcon className="size-5 stroke-yellow-400" />
            <p className="text-sm md:hidden">Categories</p>
          </div>
        )}
        <ul className="mt-2 w-36 flex flex-col gap-2 items-start justify-center py-2">
          {categories?.map((category: string, index: number) => (
            <li key={`category-${index}-${category}`}>
              <Link
                href={`/products?category=${category}`}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-start space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 rounded-md px-2 py-0.5",
                  "shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)]",
                  "dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]",
                  "dark:hover:shadow-[0_0_0_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.4),0_1px_2px_rgba(0,0,0,0.5)]",
                  searchParams.get("category") === category
                    ? "bg-yellow-400 text-black dark:text-black"
                    : ""
                )}
                prefetch={false}
              >
                <span className="px-1">
                  {category && truncateString(category, 12)}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {tags && tags?.length > 0 && (
          <div className="flex items-center gap-2 mt-6 text-muted-foreground">
            <TagIcon className="size-5 stroke-pink-400" />
            <p className="text-sm md:hidden">Tags</p>
          </div>
        )}
        <ul className="mt-2 md:w-36 flex flex-col gap-2 items-start justify-center py-2">
          {tags?.map((tag: string, index: number) => (
            <li key={`tag-${index}-${tag}`}>
              <Link
                href={`/products?tag=${tag}`}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-start space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 rounded-md px-2 py-0.5",
                  "shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)]",
                  "dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]",
                  "dark:hover:shadow-[0_0_0_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.4),0_1px_2px_rgba(0,0,0,0.5)]",
                  searchParams.get("tag") === tag
                    ? "bg-pink-400 text-black dark:text-black"
                    : ""
                )}
                prefetch={false}
              >
                <span className="px-1 truncate">
                  {tag && truncateString(tag, 12)}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {labels && labels?.length > 0 && (
          <div className="flex items-center gap-2 mt-6 text-muted-foreground">
            <Hash className="size-5 stroke-cyan-400" />
            <p className="text-sm md:hidden">Labels</p>
          </div>
        )}
        <ul className="mt-2 w-36 flex flex-col gap-2 items-start justify-center py-2">
          {labels?.map((label: string, index: number) => (
            <li key={`label-${index}-${label}`}>
              <Link
                href={`/products?label=${label}`}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-start space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 rounded-md px-2 py-0.5",
                  "shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)]",
                  "dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]",
                  "dark:hover:shadow-[0_0_0_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.4),0_1px_2px_rgba(0,0,0,0.5)]",
                  searchParams.get("label") === label
                    ? "bg-cyan-400 text-black dark:text-black"
                    : ""
                )}
                prefetch={false}
              >
                <span className="text-ellipsis overflow-hidden">
                  {label && truncateString(label, 12)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  )
}

function AdminNav({ pathname }: { pathname: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/admin"
            className={cn(
              "flex gap-2 md:gap-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
              {
                "bg-accent text-accent-foreground": pathname === "/admin",
              }
            )}
            prefetch={false}
          >
            <BarChartIcon className="h-5 w-5" />
            <span className="md:sr-only">Overview</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">Dashboard</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/admin/products"
            className={cn(
              "flex gap-2 md:gap-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
              {
                "bg-accent text-accent-foreground":
                  pathname === "/admin/products",
              }
            )}
            prefetch={false}
          >
            <FolderOpenIcon className="h-5 w-5" />
            <span className="md:sr-only">Products</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">Products</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/admin/users"
            className={cn(
              "flex gap-2 md:gap-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
              {
                "bg-accent text-accent-foreground": pathname === "/admin/users",
              }
            )}
            prefetch={false}
          >
            <UsersIcon className="h-5 w-5" />
            <span className="md:sr-only">Users</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">Users</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/admin/filters"
            className={cn(
              "flex gap-2 md:gap-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
              {
                "bg-accent text-accent-foreground":
                  pathname === "/admin/filters",
              }
            )}
            prefetch={false}
          >
            <FilterIcon className="h-5 w-5" />
            <span className="md:sr-only">Filters</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">Filters</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function LogoAnimationLink() {
  return (
    <Button
      className="relative w-full size-9 rounded-full bg-black"
      variant="outline"
      asChild
    >
      <Link href="/" className="flex justify-center">
        <div className="absolute bg-yellow-300/90 h-[80%] w-[2px] rounded-bl-full rounded-br-full l-0 r-0 animate-[spin-scale_40s_linear_infinite]" />
        <div className="absolute bg-pink-300/90 h-[80%] w-[2px] rounded-bl-full rounded-br-full l-0 r-0 animate-[spin-scale_30s_linear_infinite]" />
        <div className="absolute bg-cyan-300/70 h-[80%] w-[2px] rounded-bl-full rounded-br-full l-0 r-0 animate-[spin-scale_20s_linear_infinite]" />
        <div className="absolute bg-yellow-300/90 h-[80%] w-[2px] rounded-bl-full rounded-br-full l-0 r-0 animate-[spin-scale_15s_linear_infinite]" />
        <div className="absolute bg-pink-300/70 h-[80%] w-[2px] rounded-bl-full rounded-br-full l-0 r-0 animate-[spin-scale_10s_linear_infinite]" />

        <div className="absolute bg-pink-300/90 h-[40%] w-[2px] rounded-bl-full rounded-br-full l-0 r-0 animate-[spin-scale_80s_linear_infinite]" />
        <div className="absolute bg-cyan-300/70 h-[40%] w-[2px] rounded-bl-full rounded-br-full l-0 r-0 animate-[spin-scale_60s_linear_infinite]" />
        <div className="absolute bg-yellow-300/90 h-[40%] w-[2px] rounded-bl-full rounded-br-full l-0 r-0 animate-[spin-scale_40s_linear_infinite]" />
        <div className="absolute bg-pink-300/90 h-[40%] w-[2px] rounded-bl-full rounded-br-full l-0 r-0 animate-[spin-scale_30s_linear_infinite]" />
        <div className="absolute bg-cyan-300/90 h-[40%] w-[2px] rounded-bl-full rounded-br-full l-0 r-0 animate-[spin-scale_20s_linear_infinite]" />
      </Link>
    </Button>
  )
}
