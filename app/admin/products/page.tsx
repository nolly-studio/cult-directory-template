import { Suspense } from "react"
import { 
  Package, 
  Search, 
  Filter, 
  Plus,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Star,
  Trash2
} from "lucide-react"
import Link from "next/link"

import { createClient } from "@/db/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProductRow } from "./product-row"

interface Product {
  id: string
  codename: string
  arabic_name?: string
  punchline: string
  arabic_description?: string
  categories: string
  approved: boolean
  view_count: number
  created_at: string
  logo_src?: string
  product_website?: string
  is_free?: boolean
  difficulty_level?: string
}

async function getProducts(
  searchTerm?: string,
  filter?: string,
  sortBy: string = 'created_at',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<Product[]> {
  const supabase = createClient()
  
  let query = supabase
    .from('products')
    .select('*')

  // Apply search filter
  if (searchTerm) {
    query = query.or(
      `codename.ilike.%${searchTerm}%,arabic_name.ilike.%${searchTerm}%,punchline.ilike.%${searchTerm}%`
    )
  }

  // Apply status filter
  if (filter === 'pending') {
    query = query.eq('approved', false)
  } else if (filter === 'approved') {
    query = query.eq('approved', true)
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data || []
}



export default async function ProductsManagement({
  searchParams,
}: {
  searchParams: {
    search?: string
    filter?: string
    sort?: string
    order?: 'asc' | 'desc'
  }
}) {
  const { search, filter, sort = 'created_at', order = 'desc' } = searchParams
  const products = await getProducts(search, filter, sort, order)

  const stats = {
    total: products.length,
    approved: products.filter(p => p.approved).length,
    pending: products.filter(p => !p.approved).length,
    totalViews: products.reduce((sum, p) => sum + (p.view_count || 0), 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">إدارة الأدوات</h1>
          <p className="text-muted-foreground">
            مراجعة وإدارة أدوات الذكاء الاصطناعي
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/add">
            <Plus className="mr-2 h-4 w-4" />
            إضافة أداة
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الأدوات</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معتمدة</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معلقة</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المشاهدات</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>تصفية البحث</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في الأدوات..."
                  defaultValue={search}
                  className="pr-10"
                />
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  تصفية ({filter || 'الكل'})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>حالة الأداة</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/products">جميع الأدوات</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/products?filter=approved">معتمدة فقط</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/products?filter=pending">معلقة فقط</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  ترتيب ({sort === 'created_at' ? 'التاريخ' : sort === 'view_count' ? 'المشاهدات' : 'الاسم'})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>ترتيب حسب</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/admin/products?${new URLSearchParams({ ...searchParams, sort: 'created_at', order: 'desc' })}`}>
                    الأحدث أولاً
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/products?${new URLSearchParams({ ...searchParams, sort: 'view_count', order: 'desc' })}`}>
                    الأكثر مشاهدة
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/products?${new URLSearchParams({ ...searchParams, sort: 'codename', order: 'asc' })}`}>
                    حسب الاسم
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الأدوات</CardTitle>
          <CardDescription>
            {products.length} أداة موجودة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الأداة</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>المشاهدات</TableHead>
                <TableHead>المستوى</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductRow key={product.id} product={product} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    لا توجد أدوات تطابق معايير البحث
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}