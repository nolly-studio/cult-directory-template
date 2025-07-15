"use client"

import { ReactNode, useState, useEffect } from "react"
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
  Search,
} from "lucide-react"

import { cn, truncateString } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/contexts/sidebar-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
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
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  
  // Use sidebar context with fallback
  let sidebarOpen = true
  try {
    const sidebar = useSidebar()
    sidebarOpen = sidebar.isOpen
  } catch (error) {
    console.warn("Sidebar context not available in NavSidebar")
  }

  // Check user authentication status
  useEffect(() => {
    const checkUser = async () => {
      const db = await createClient()
      const { data: { user } } = await db.auth.getUser()
      setUser(user)
    }
    checkUser()
  }, [])

  const handleLogout = async () => {
    const db = await createClient()
    const { error } = await db.auth.signOut()
    if (error) {
      console.error("Error logging out:", error.message)
    } else {
      router.push("/login")
    }
  }

  const handleLinkClick = () => {
    setSheetOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/tools?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  return (
    <>
      <aside
        className={cn(
          pathname.includes("admin")
            ? "w-16 border-l border-black/10 dark:border-white/10"
            : sidebarOpen
            ? "w-48"
            : "w-0 border-l-0",
          "fixed top-16 bottom-0 right-0 z-20 hidden sm:flex flex-col bg-[#FAFAFA] dark:bg-[#1E1E1E] border-l border-black/10 dark:border-white/10 transition-all duration-150 ease-in-out overflow-hidden"
        )}
      >
        {sidebarOpen && (
          <div className="border-b border-black/10 dark:border-white/10 p-2">
            <div className="text-sm font-medium text-muted-foreground text-center">
              التصفح والفلترة
            </div>
          </div>
        )}
        <nav className="flex-1 overflow-y-auto">
          {pathname.includes("admin") ? (
            <div className="flex flex-col items-center gap-4 px-2 py-5">
              <LogoAnimationLink />
              <AdminNav pathname={pathname} />
            </div>
          ) : (
            <ProductNav
              categories={categories}
              tags={tags}
              labels={labels}
              searchParams={searchParams}
              isCollapsed={!sidebarOpen}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
            />
          )}
        </nav>

        <div className="p-4 border-t border-black/10 dark:border-white/10">
          <div className="flex gap-2 items-center justify-between">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-r from-yellow-300 to-yellow-300 text-black text-xs">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  side="top"
                  className="mb-2"
                >
                  <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin">لوحة التحكم</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOutIcon className="ml-2 h-4 w-4" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-8 w-full justify-start"
              >
                <Link href="/login">
                  <LogIn className="h-4 w-4" />
                  <span className="mr-2 text-xs sm:text-sm">تسجيل الدخول</span>
                </Link>
              </Button>
            )}
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
                <PanelLeftIcon className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <div className="ml-auto mt-1 md:hidden">
              <LogoAnimationLink />
            </div>
            <SheetContent
              side="right"
              className="sm:max-w-[15rem] py-4 pr-1 border-l border-primary/10"
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
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      handleSearch={handleSearch}
                    >
                      <div className="my-4 space-y-3">
                        <Link
                          href="/"
                          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                          prefetch={false}
                          onClick={handleLinkClick}
                        >
                          <HomeIcon className="h-5 w-5" />
                          الرئيسية
                        </Link>
                        <Link
                          href="/submit"
                          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                          prefetch={false}
                          onClick={handleLinkClick}
                        >
                          <PlusIcon className="h-5 w-5" />
                          أضف أداة
                        </Link>
                      </div>
                    </ProductNav>
                  </>
                )}
              </nav>
              <div className="flex flex-col items-start pl-4">
                <nav className="mb-6 flex gap-4">
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-r from-yellow-300 to-yellow-300 text-black text-xs">
                            {user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin">لوحة التحكم</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOutIcon className="ml-2 h-4 w-4" />
                          تسجيل الخروج
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/login">
                        <LogIn className="h-4 w-4 ml-2" />
                        تسجيل الدخول
                      </Link>
                    </Button>
                  )}
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
  isCollapsed?: boolean
  searchQuery?: string
  setSearchQuery?: (query: string) => void
  handleSearch?: (e: React.FormEvent) => void
}

function ProductNav({
  categories,
  tags,
  labels,
  searchParams,
  handleLinkClick,
  children,
  isCollapsed = false,
  searchQuery = "",
  setSearchQuery,
  handleSearch,
}: ProductNavProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const pathname = usePathname()

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center p-2">
        <LogoAnimationLink />
        <div className="mt-4 space-y-2 w-full">
          <TooltipProvider>
            {/* Home */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/" className="flex justify-center">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <HomeIcon className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="left">الرئيسية</TooltipContent>
            </Tooltip>
            
            {/* Submit Tool */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/submit" className="flex justify-center">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="left">أضف أداة</TooltipContent>
            </Tooltip>

            <Separator className="my-2" />
            
            {/* Categories */}
            {categories && categories.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 mx-auto"
                    onClick={() => setExpandedSection(expandedSection === 'categories' ? null : 'categories')}
                  >
                    <BoxIcon className="h-4 w-4 stroke-yellow-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">الفئات</TooltipContent>
              </Tooltip>
            )}
            
            {/* Tags */}
            {tags && tags.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 mx-auto"
                    onClick={() => setExpandedSection(expandedSection === 'tags' ? null : 'tags')}
                  >
                    <TagIcon className="h-4 w-4 stroke-pink-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">العلامات</TooltipContent>
              </Tooltip>
            )}
            
            {/* Labels */}
            {labels && labels.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 mx-auto"
                    onClick={() => setExpandedSection(expandedSection === 'labels' ? null : 'labels')}
                  >
                    <Hash className="h-4 w-4 stroke-cyan-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">التصنيفات</TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      </div>
    )
  }

  return (
    <div className="p-2">
      <LogoAnimationLink />
      {children}
      <ScrollArea className="h-[calc(100vh-280px)] flex flex-col gap-4 px-2">
        {!children && (
          <div className="space-y-2 mb-4">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={handleLinkClick}
            >
              <HomeIcon className="h-4 w-4" />
              <span>الرئيسية</span>
            </Link>
            <Link
              href="/submit"
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={handleLinkClick}
            >
              <PlusIcon className="h-4 w-4" />
              <span>أضف أداة</span>
            </Link>
          </div>
        )}

        {/* Search Box */}
        {handleSearch && setSearchQuery && (
          <div className="mb-4 px-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="ابحث في الأدوات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 text-sm pr-10 pl-3"
              />
            </form>
          </div>
        )}

        {categories && categories?.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground px-3">
              <BoxIcon className="h-4 w-4 stroke-yellow-400" />
              <p className="text-sm font-medium">الفئات</p>
            </div>
            <ul className="space-y-1">
              {categories?.map((category: string, index: number) => (
                <li key={`category-${index}-${category}`}>
                  <Link
                    href={
                      pathname.includes("/tutorials") ? `/tutorials?category=${category}` :
                      pathname.includes("/news") ? `/news?category=${category}` :
                      `/tools?category=${category}`
                    }
                    onClick={handleLinkClick}
                    className={cn(
                      "block text-xs px-2 py-1 rounded-md transition-colors leading-tight",
                      "hover:bg-accent hover:text-accent-foreground",
                      "overflow-hidden text-ellipsis whitespace-nowrap",
                      searchParams.get("category") === category
                        ? "bg-yellow-400 text-black hover:bg-yellow-500"
                        : "text-muted-foreground"
                    )}
                    prefetch={false}
                    title={category}
                  >
                    {category && truncateString(category, 16)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tags && tags?.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground px-3">
              <TagIcon className="h-4 w-4 stroke-pink-400" />
              <p className="text-sm font-medium">العلامات</p>
            </div>
            <ul className="space-y-1">
              {tags?.map((tag: string, index: number) => (
                <li key={`tag-${index}-${tag}`}>
                  <Link
                    href={`/tools?tag=${tag}`}
                    onClick={handleLinkClick}
                    className={cn(
                      "block text-xs px-2 py-1 rounded-md transition-colors leading-tight",
                      "hover:bg-accent hover:text-accent-foreground",
                      "overflow-hidden text-ellipsis whitespace-nowrap",
                      searchParams.get("tag") === tag
                        ? "bg-pink-400 text-black hover:bg-pink-500"
                        : "text-muted-foreground"
                    )}
                    prefetch={false}
                    title={tag}
                  >
                    {tag && truncateString(tag, 16)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {labels && labels?.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground px-3">
              <Hash className="h-4 w-4 stroke-cyan-400" />
              <p className="text-sm font-medium">التصنيفات</p>
            </div>
            <ul className="space-y-1">
              {labels?.map((label: string, index: number) => (
                <li key={`label-${index}-${label}`}>
                  <Link
                    href={pathname.includes("/tutorials") ? `/tutorials?difficulty=${label}` : `/tools?label=${label}`}
                    onClick={handleLinkClick}
                    className={cn(
                      "block text-xs px-2 py-1 rounded-md transition-colors leading-tight",
                      "hover:bg-accent hover:text-accent-foreground",
                      "overflow-hidden text-ellipsis whitespace-nowrap",
                      pathname.includes("/tutorials") 
                        ? searchParams.get("difficulty") === label
                          ? "bg-cyan-400 text-black hover:bg-cyan-500"
                          : "text-muted-foreground"
                        : searchParams.get("label") === label
                        ? "bg-cyan-400 text-black hover:bg-cyan-500"
                        : "text-muted-foreground"
                    )}
                    prefetch={false}
                    title={label}
                  >
                    {label && truncateString(label, 16)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
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
