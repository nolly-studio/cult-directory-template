import Link from "next/link"
import { Brain, BookOpen, Package, Newspaper, DollarSign, Users, Building, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/40 mt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: المنصة */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">المنصة</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/tutorials" 
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  The Launchpad
                </Link>
              </li>
              <li>
                <Link 
                  href="/tools" 
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  الترسانة
                </Link>
              </li>
              <li>
                <Link 
                  href="/pricing" 
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <DollarSign className="h-4 w-4" />
                  الأسعار
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: المحتوى */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">المحتوى</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/blog" 
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Newspaper className="h-4 w-4" />
                  المقالات
                </Link>
              </li>
              <li>
                <Link 
                  href="/news" 
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Newspaper className="h-4 w-4" />
                  آخر الأخبار
                </Link>
              </li>
              <li>
                <Link 
                  href="/submit" 
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  أضف أداة
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: الشركة */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">الشركة</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/about" 
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  من نحن
                </Link>
              </li>
              <li>
                <Link 
                  href="/enterprise" 
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Building className="h-4 w-4" />
                  للمؤسسات
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: النشرة الأسبوعية */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">النشرة الأسبوعية</h3>
            <p className="text-sm text-muted-foreground">
              احصل على أهم أخبار وأدوات الذكاء الاصطناعي كل أسبوع
            </p>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="البريد الإلكتروني"
                className="bg-background border-input"
              />
              <Button size="sm" className="w-full">
                اشترك الآن
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              نرسل لك كل خميس. يمكنك إلغاء الاشتراك في أي وقت.
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <img 
                src="/arabieailogo.png" 
                alt="العربي للذكاء الاصطناعي" 
                className="h-6 w-6 object-contain rounded-sm"
              />
              <span className="font-bold text-foreground">العربي للذكاء الاصطناعي</span>
            </Link>
            <span className="text-sm text-muted-foreground">
              © 2024 جميع الحقوق محفوظة
            </span>
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-4 text-sm">
            <Link 
              href="/privacy" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              سياسة الخصوصية
            </Link>
            <Link 
              href="/terms" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              شروط الاستخدام
            </Link>
            <Link 
              href="/cookies" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              ملفات تعريف الارتباط
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}