"use client"

import React, { useState, useEffect } from "react"
import { 
  Eye, 
  Download, 
  Copy, 
  Trash2, 
  Edit2, 
  Calendar,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Archive,
  ExternalLink
} from "lucide-react"
import { ImageWithFallback } from "@/components/cult/fallback-image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useMediaUpload } from "@/hooks/use-media-upload"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface MediaFile {
  id: string
  filename: string
  original_filename: string
  file_path: string
  bucket_name: string
  file_size: number
  mime_type: string
  width?: number
  height?: number
  alt_text?: string
  caption?: string
  tags?: string[]
  created_at: string
  public_url: string
}

interface MediaBrowserProps {
  bucket: 'news-images' | 'tutorial-images' | 'site-assets' | 'product-logos'
  search?: string
  type?: string
  view?: 'grid' | 'list'
}

export function MediaBrowser({ bucket, search, type, view = 'grid' }: MediaBrowserProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)
  const [editingFile, setEditingFile] = useState<MediaFile | null>(null)
  const [editForm, setEditForm] = useState({ alt_text: '', caption: '', tags: [] as string[] })

  const { getMediaFiles, deleteFile, isUploading } = useMediaUpload({ bucket })

  const loadFiles = async () => {
    setLoading(true)
    try {
      const mediaFiles = await getMediaFiles({
        mimeType: type === 'image' ? 'image' : type === 'video' ? 'video' : undefined,
        limit: 100
      })
      
      let filteredFiles = mediaFiles
      
      // Apply search filter
      if (search) {
        filteredFiles = filteredFiles.filter(file => 
          file.original_filename.toLowerCase().includes(search.toLowerCase()) ||
          file.alt_text?.toLowerCase().includes(search.toLowerCase()) ||
          file.caption?.toLowerCase().includes(search.toLowerCase()) ||
          file.tags?.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase()))
        )
      }
      
      setFiles(filteredFiles)
    } catch (error) {
      console.error('Error loading files:', error)
      toast.error('فشل في تحميل الملفات')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFiles()
  }, [bucket, search, type])

  const handleCopyUrl = async (url: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url)
        toast.success('تم نسخ الرابط')
      }
    } catch (error) {
      toast.error('فشل في نسخ الرابط')
    }
  }

  const handleDownload = (file: MediaFile) => {
    if (typeof document !== 'undefined') {
      const link = document.createElement('a')
      link.href = file.public_url
      link.download = file.original_filename
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleDelete = async (file: MediaFile) => {
    try {
      await deleteFile(file.filename, file.id)
      setFiles(prev => prev.filter(f => f.id !== file.id))
      toast.success('تم حذف الملف بنجاح')
    } catch (error) {
      toast.error('فشل في حذف الملف')
    }
  }

  const handleEdit = (file: MediaFile) => {
    setEditingFile(file)
    setEditForm({
      alt_text: file.alt_text || '',
      caption: file.caption || '',
      tags: file.tags || []
    })
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return ImageIcon
    if (mimeType.startsWith('video/')) return Video
    if (mimeType.startsWith('audio/')) return Music
    return FileText
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-medium text-muted-foreground">
          لا توجد ملفات
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {search ? 'لا توجد ملفات تطابق البحث' : 'لم يتم رفع أي ملفات بعد'}
        </p>
      </div>
    )
  }

  if (view === 'list') {
    return (
      <div className="space-y-2">
        {files.map((file) => {
          const FileIcon = getFileIcon(file.mime_type)
          return (
            <Card key={file.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileIcon className="h-8 w-8 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{file.original_filename}</span>
                      {file.tags && file.tags.length > 0 && (
                        <div className="flex gap-1">
                          {file.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {file.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{file.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatFileSize(file.file_size)}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(file.created_at)}
                      </span>
                      {file.width && file.height && (
                        <span>{file.width} × {file.height}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedFile(file)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopyUrl(file.public_url)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(file)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(file)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>حذف الملف</AlertDialogTitle>
                        <AlertDialogDescription>
                          هل أنت متأكد من حذف "{file.original_filename}"؟ لا يمكن التراجع عن هذا الإجراء.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(file)}>
                          حذف
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {files.map((file) => {
          const isImage = file.mime_type.startsWith('image/')
          const FileIcon = getFileIcon(file.mime_type)
          
          return (
            <Card key={file.id} className="group relative overflow-hidden">
              <CardContent className="p-2">
                <div className="aspect-square relative mb-2">
                  {isImage ? (
                    <ImageWithFallback
                      src={file.public_url}
                      alt={file.alt_text || file.original_filename}
                      className="w-full h-full object-cover rounded-md"
                      fallback="/placeholder.png"
                      width={200}
                      height={200}
                    />
                  ) : (
                    <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                      <FileIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Overlay actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setSelectedFile(file)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleCopyUrl(file.public_url)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDownload(file)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium truncate" title={file.original_filename}>
                    {file.original_filename}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatFileSize(file.file_size)}</span>
                    {file.width && file.height && (
                      <span>{file.width}×{file.height}</span>
                    )}
                  </div>
                  {file.tags && file.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {file.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* File Preview Dialog */}
      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedFile && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  {selectedFile.original_filename}
                </DialogTitle>
                <DialogDescription>
                  معاينة الملف وإدارة الخصائص
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* File Preview */}
                <div className="flex justify-center">
                  {selectedFile.mime_type.startsWith('image/') ? (
                    <ImageWithFallback
                      src={selectedFile.public_url}
                      alt={selectedFile.alt_text || selectedFile.original_filename}
                      className="max-w-full max-h-96 object-contain rounded-lg"
                      fallback="/placeholder.png"
                      width={selectedFile.width || 400}
                      height={selectedFile.height || 300}
                    />
                  ) : (
                    <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                      {React.createElement(getFileIcon(selectedFile.mime_type), { className: "h-16 w-16 text-muted-foreground" })}
                    </div>
                  )}
                </div>

                {/* File Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>اسم الملف</Label>
                    <p className="text-muted-foreground">{selectedFile.original_filename}</p>
                  </div>
                  <div>
                    <Label>الحجم</Label>
                    <p className="text-muted-foreground">{formatFileSize(selectedFile.file_size)}</p>
                  </div>
                  <div>
                    <Label>النوع</Label>
                    <p className="text-muted-foreground">{selectedFile.mime_type}</p>
                  </div>
                  <div>
                    <Label>تاريخ الرفع</Label>
                    <p className="text-muted-foreground">{formatDate(selectedFile.created_at)}</p>
                  </div>
                  {selectedFile.width && selectedFile.height && (
                    <div>
                      <Label>الأبعاد</Label>
                      <p className="text-muted-foreground">{selectedFile.width} × {selectedFile.height}</p>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {selectedFile.tags && selectedFile.tags.length > 0 && (
                  <div>
                    <Label>العلامات</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedFile.tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between pt-4 border-t">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleCopyUrl(selectedFile.public_url)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      نسخ الرابط
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDownload(selectedFile)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      تحميل
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open(selectedFile.public_url, '_blank')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      فتح في تبويب جديد
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(selectedFile)}
                    >
                      <Edit2 className="mr-2 h-4 w-4" />
                      تحرير
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          حذف
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>حذف الملف</AlertDialogTitle>
                          <AlertDialogDescription>
                            هل أنت متأكد من حذف "{selectedFile.original_filename}"؟ لا يمكن التراجع عن هذا الإجراء.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction onClick={() => {
                            handleDelete(selectedFile)
                            setSelectedFile(null)
                          }}>
                            حذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}