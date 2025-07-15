"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Brain, 
  Search, 
  Menu, 
  X,
  Home,
  Package,
  BookOpen,
  Newspaper,
  GraduationCap,
  Heart,
  Settings,
  LogOut,
  User
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/app/providers"
import { createClient } from "@/db/supabase/client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu"

const navigation = [
  {
    name: "الرئيسية",
    href: "/",
    icon: Home
  },
  {
    name: "الأدوات", 
    href: "/tools",
    icon: Package
  },
  {
    name: "تعلم",
    href: "/tutorials", 
    icon: GraduationCap
  },
  {
    name: "أخبار",
    href: "/news",
    icon: Newspaper
  },
  {
    name: "المدونة",
    href: "/blog",
    icon: BookOpen
  }
]

export function MainNavigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const supabase = createClient()
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  const handleSearchClick = () => {
    const searchInput = document.getElementById('search') as HTMLInputElement
    if (searchInput) {
      searchInput.focus()
    } else {
      window.location.href = '/search'
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (!mounted) return null

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">الذكاء الاصطناعي العربي</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                    isActive(item.href) 
                      ? "text-primary bg-primary/10 rounded-md" 
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSearchClick}
              className="flex items-center space-x-2 rtl:space-x-reverse"
            >
              <Search className="h-4 w-4" />
              <span>بحث</span>
            </Button>
            
            <ModeToggle />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{user.email?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/favorites" className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Heart className="h-4 w-4" />
                      <span>المفضلة</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm">
                <Link href="/login" className="flex items-center space-x-2 rtl:space-x-reverse">
                  <User className="h-4 w-4" />
                  <span>تسجيل الدخول</span>
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">فتح القائمة</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-2 rtl:space-x-reverse">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                      <Brain className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="font-bold">الذكاء الاصطناعي العربي</span>
                  </Link>
                </div>

                {/* Mobile Navigation */}
                <div className="flex-1 overflow-y-auto">
                  <div className="space-y-2 p-4">
                    {navigation.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center space-x-3 rtl:space-x-reverse px-3 py-3 text-sm font-medium transition-colors hover:bg-accent rounded-md",
                            isActive(item.href) 
                              ? "bg-primary/10 text-primary" 
                              : "text-foreground"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>

                {/* Mobile Footer */}
                <div className="border-t p-4 space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSearchClick}
                    className="w-full justify-start"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    <span>بحث</span>
                  </Button>
                  
                  <div className="flex items-center justify-between">
                    <ModeToggle />
                    
                    {user ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{user.email?.[0]?.toUpperCase()}</AvatarFallback>
                            </Avatar>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link href="/favorites" onClick={() => setIsOpen(false)}>
                              <Heart className="h-4 w-4 mr-2" />
                              <span>المفضلة</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                            <LogOut className="h-4 w-4 mr-2" />
                            <span>تسجيل الخروج</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Button asChild size="sm">
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          <User className="h-4 w-4 mr-2" />
                          <span>دخول</span>
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}