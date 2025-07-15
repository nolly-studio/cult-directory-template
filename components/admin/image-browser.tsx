"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Filter, Grid3X3, List, Download, Trash2, Copy, ExternalLink, Eye, Folder } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageFile, getImagesByCategory, deleteImage, copyImage, searchImages } from "@/app/actions/client-image-management"
import { ImageWithFallback } from "@/components/cult/fallback-image"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface ImageBrowserProps {
  onImageSelect?: (image: ImageFile) => void
  selectionMode?: boolean
  multiSelect?: boolean
  bucketFilter?: string
  className?: string
}

type ViewMode = 'grid' | 'list'
type SortBy = 'name' | 'date' | 'size' | 'bucket'

const BUCKET_LABELS: Record<string, string> = {
  'product-logos': 'شعارات الأدوات',
  'news-images': 'صور الأخبار',
  'tutorial-images': 'صور الدروس',
  'site-assets': 'ملفات الموقع'
}

export function ImageBrowser({
  onImageSelect,
  selectionMode = false,
  multiSelect = false,
  bucketFilter,
  className
}: ImageBrowserProps) {
  const [images, setImages] = useState<Record<string, ImageFile[]>>({})
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBucket, setSelectedBucket] = useState<string>(bucketFilter || 'all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortBy>('date')
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null)

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    setLoading(true)
    try {
      const imagesByCategory = await getImagesByCategory(bucketFilter)
      setImages(imagesByCategory)
    } catch (error) {
      console.error('Error loading images:', error)
      toast.error('فشل في تحميل الصور')
    } finally {
      setLoading(false)
    }
  }

  const filteredImages = useMemo(() => {
    let allImages: ImageFile[] = []
    
    // Flatten images from selected buckets
    if (selectedBucket === 'all') {
      allImages = Object.values(images).flat()
    } else {
      allImages = images[selectedBucket] || []
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      allImages = allImages.filter(image => 
        image.name.toLowerCase().includes(query) ||
        image.bucket_id.toLowerCase().includes(query)
      )
    }

    // Sort images
    allImages.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'bucket':
          return a.bucket_id.localeCompare(b.bucket_id)
        default:
          return 0
      }
    })

    return allImages
  }, [images, selectedBucket, searchQuery, sortBy])

  const handleImageSelect = (image: ImageFile) => {
    if (selectionMode) {
      if (multiSelect) {
        const newSelected = new Set(selectedImages)
        if (newSelected.has(image.id)) {
          newSelected.delete(image.id)
        } else {
          newSelected.add(image.id)
        }
        setSelectedImages(newSelected)
      } else {
        onImageSelect?.(image)
      }
    } else {
      setSelectedImage(image)
    }
  }

  const handleDeleteImage = async (image: ImageFile) => {
    if (confirm(`هل أنت متأكد من حذف الصورة "${image.name}"؟`)) {
      const success = await deleteImage(image.bucket_id, image.name)
      if (success) {
        toast.success('تم حذف الصورة بنجاح')
        loadImages()
      } else {
        toast.error('فشل في حذف الصورة')
      }
    }
  }

  const handleCopyImage = async (image: ImageFile, targetBucket: string) => {
    const result = await copyImage(image.bucket_id, targetBucket, image.name)
    if (result.success) {
      toast.success('تم نسخ الصورة بنجاح')
      loadImages()
    } else {
      toast.error(result.error || 'فشل في نسخ الصورة')
    }
  }

  const copyToClipboard = (url: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url)
      toast.success('تم نسخ الرابط إلى الحافظة')
    }
  }

  const bucketCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    Object.entries(images).forEach(([bucket, imgs]) => {
      counts[bucket] = imgs.length
    })
    return counts
  }, [images])

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>جاري تحميل الصور...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Folder className="h-5 w-5" />
          مدير الصور
          <Badge variant="outline">{filteredImages.length} صورة</Badge>
        </CardTitle>
        <CardDescription>
          إدارة جميع صور الموقع وتنظيمها حسب المجلدات
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في الصور..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Bucket Filter */}
          {!bucketFilter && (
            <Select value={selectedBucket} onValueChange={setSelectedBucket}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  جميع المجلدات ({Object.values(bucketCounts).reduce((a, b) => a + b, 0)})
                </SelectItem>
                {Object.entries(bucketCounts).map(([bucket, count]) => (
                  <SelectItem key={bucket} value={bucket}>
                    {BUCKET_LABELS[bucket] || bucket} ({count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Sort */}
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">الأحدث</SelectItem>
              <SelectItem value="name">الاسم</SelectItem>
              <SelectItem value="bucket">المجلد</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Image Grid/List */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              {searchQuery ? 'لا توجد صور تطابق البحث' : 'لا توجد صور في هذا المجلد'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className={cn(
                  "group relative aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all",
                  selectionMode && selectedImages.has(image.id) && "ring-2 ring-primary",
                  "hover:shadow-md"
                )}
                onClick={() => handleImageSelect(image)}
              >
                {selectionMode && multiSelect && (
                  <Checkbox
                    checked={selectedImages.has(image.id)}
                    className="absolute top-2 right-2 z-10 bg-white"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                
                <ImageWithFallback
                  src={image.public_url}
                  alt={image.name}
                  className="w-full h-full object-cover"
                  fallback="/placeholder.png"
                  fill
                />
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors" />
                
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-medium truncate">
                    {image.name}
                  </p>
                  <Badge 
                    variant="secondary" 
                    className="text-xs mt-1 bg-white/20 text-white border-white/20"
                  >
                    {BUCKET_LABELS[image.bucket_id] || image.bucket_id}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className={cn(
                  "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors",
                  selectionMode && selectedImages.has(image.id) && "bg-primary/5 border-primary",
                  "hover:bg-muted/50"
                )}
                onClick={() => handleImageSelect(image)}
              >
                {selectionMode && multiSelect && (
                  <Checkbox
                    checked={selectedImages.has(image.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                
                <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={image.public_url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                    fallback="/placeholder.png"
                    width={48}
                    height={48}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{image.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {BUCKET_LABELS[image.bucket_id] || image.bucket_id}
                    </Badge>
                    <span>{new Date(image.created_at).toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>
                
                {!selectionMode && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(image.public_url)
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(image.public_url, '_blank')
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteImage(image)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Image Details Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedImage?.name}</DialogTitle>
              <DialogDescription>
                {BUCKET_LABELS[selectedImage?.bucket_id || ''] || selectedImage?.bucket_id}
              </DialogDescription>
            </DialogHeader>
            
            {selectedImage && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <ImageWithFallback
                      src={selectedImage.public_url}
                      alt={selectedImage.name}
                      className="w-full h-full object-contain"
                      fallback="/placeholder.png"
                      fill
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(selectedImage.public_url)}
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      نسخ الرابط
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open(selectedImage.public_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">تفاصيل الملف</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>الاسم:</span>
                        <span className="text-left">{selectedImage.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>المجلد:</span>
                        <Badge variant="outline">
                          {BUCKET_LABELS[selectedImage.bucket_id] || selectedImage.bucket_id}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>تاريخ الإنشاء:</span>
                        <span>{new Date(selectedImage.created_at).toLocaleDateString('ar-SA')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>الرابط:</span>
                        <span className="text-left text-xs font-mono bg-muted px-2 py-1 rounded">
                          {selectedImage.public_url.split('/').pop()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2 text-red-600">منطقة الخطر</h4>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteImage(selectedImage)}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      حذف الصورة
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
} 