"use client"

import { useState } from "react"
import { Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TableCell, TableRow } from "@/components/ui/table"
import { ProductActions } from "./product-actions"
import { ProductLogo } from "@/components/product-logo"
import { QuickLogoUpload } from "@/components/admin/quick-logo-upload"

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

interface ProductRowProps {
  product: Product
}

export function ProductRow({ product: initialProduct }: ProductRowProps) {
  const [product, setProduct] = useState(initialProduct)

  const handleLogoUpdated = (newLogoSrc: string) => {
    setProduct(prev => ({ ...prev, logo_src: newLogoSrc }))
  }

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ProductLogo 
              logo_src={product.logo_src}
              codename={product.codename}
              arabic_name={product.arabic_name}
              size="sm"
            />
            {/* Quick Upload Button - positioned over the logo */}
            <div className="absolute -top-1 -right-1">
              <QuickLogoUpload
                productId={product.id}
                productName={product.codename}
                currentLogoSrc={product.logo_src}
                onLogoUpdated={handleLogoUpdated}
              />
            </div>
          </div>
          <div>
            <p className="font-medium">
              {product.codename}
            </p>
            {product.arabic_name && (
              <p className="text-sm text-muted-foreground">
                {product.arabic_name}
              </p>
            )}
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <Badge variant="outline">
          {product.categories}
        </Badge>
      </TableCell>
      
      <TableCell>
        <Badge variant={product.approved ? "default" : "secondary"}>
          {product.approved ? "معتمد" : "معلق"}
        </Badge>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          {product.view_count || 0}
        </div>
      </TableCell>
      
      <TableCell>
        {product.difficulty_level && (
          <Badge 
            variant={
              product.difficulty_level === 'مبتدئ' ? 'default' :
              product.difficulty_level === 'متوسط' ? 'secondary' : 'destructive'
            }
          >
            {product.difficulty_level}
          </Badge>
        )}
      </TableCell>
      
      <TableCell>
        {new Date(product.created_at).toLocaleDateString('en-US')}
      </TableCell>
      
      <TableCell>
        <ProductActions product={product} />
      </TableCell>
    </TableRow>
  )
} 