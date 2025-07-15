import { Suspense } from "react"
import Link from "next/link"
import { Search, Package, Newspaper, BookOpen, Calendar, Eye, PenTool } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FadeIn } from "@/components/cult/fade-in"
import { NavSidebar } from "@/components/nav"
import { AdaptiveLayout } from "@/components/adaptive-layout"
import { PageLoading } from "@/components/ui/loading"
import { getProducts } from "../actions/product"
import { getNews } from "../actions/news"
import { getTutorials } from "../actions/tutorials"
import { searchBlogArticles } from "../actions/blog"
import { getCachedFilters } from "../actions/cached_actions"

export const dynamic = "force-dynamic"

async function searchContent(query: string) {
  if (!query) {
    return { products: [], news: [], tutorials: [], blog: [] }
  }

  try {
    const [products, news, tutorials, blog] = await Promise.all([
      getProducts(query),
      getNews(),
      getTutorials(),
      searchBlogArticles(query, undefined, 6)
    ])

    // Filter news and tutorials by search query
    const filteredNews = news.filter(article => 
      article.title_ar.toLowerCase().includes(query.toLowerCase()) ||
      article.title_en?.toLowerCase().includes(query.toLowerCase()) ||
      article.summary_ar?.toLowerCase().includes(query.toLowerCase()) ||
      article.category.toLowerCase().includes(query.toLowerCase())
    )

    const filteredTutorials = tutorials.filter(tutorial =>
      tutorial.title_ar.toLowerCase().includes(query.toLowerCase()) ||
      tutorial.title_en?.toLowerCase().includes(query.toLowerCase()) ||
      tutorial.category.toLowerCase().includes(query.toLowerCase()) ||
      tutorial.difficulty?.toLowerCase().includes(query.toLowerCase())
    )

    return {
      products: products || [],
      news: filteredNews,
      tutorials: filteredTutorials,
      blog: blog || []
    }
  } catch (error) {
    console.error('Search error:', error)
    return { products: [], news: [], tutorials: [], blog: [] }
  }
}

async function SearchResults({ query }: { query: string }) {
  const searchResults = await searchContent(query)
  const filters = await getCachedFilters()

  const totalResults = searchResults.products.length + 
                      searchResults.news.length + 
                      searchResults.tutorials.length + 
                      searchResults.blog.length

  return (
    <>
      <NavSidebar
        categories={filters.categories}
        labels={filters.labels}
        tags={filters.tags}
      />

      <AdaptiveLayout className="py-6">
        <FadeIn>
          <div className="space-y-8">
            {/* Search Header */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Search className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold">نتائج البحث</h1>
              </div>
              
              {query ? (
                <div className="space-y-2">
                  <p className="text-xl text-muted-foreground">
                    البحث عن: <span className="font-semibold text-foreground">"{query}"</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    تم العثور على {totalResults} نتيجة
                  </p>
                </div>
              ) : (
                <p className="text-xl text-muted-foreground">
                  أدخل كلمة البحث للعثور على الأدوات والمقالات والدروس
                </p>
              )}
            </div>

            {query && totalResults === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">لم يتم العثور على نتائج</h3>
                  <p className="text-muted-foreground">
                    جرب استخدام كلمات مختلفة أو تحقق من الإملاء
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Products Results */}
            {searchResults.products.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <Package className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">الأدوات ({searchResults.products.length})</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.products.slice(0, 6).map((product) => (
                    <Card key={product.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <CardTitle className="text-lg leading-tight">
                              {product.arabic_name || product.codename}
                            </CardTitle>
                            <CardDescription>{product.punchline}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{product.categories}</Badge>
                          <Link
                            href={`/tools/${product.codename.toLowerCase().replace(/\./g, '-').replace(/\s+/g, '-')}`}
                            className="text-primary hover:underline text-sm"
                          >
                            عرض التفاصيل ←
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {searchResults.products.length > 6 && (
                  <div className="text-center">
                    <Link href={`/tools?search=${encodeURIComponent(query)}`}>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        عرض جميع النتائج ({searchResults.products.length})
                      </Badge>
                    </Link>
                  </div>
                )}
              </section>
            )}

            {/* News Results */}
            {searchResults.news.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <Newspaper className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">الأخبار ({searchResults.news.length})</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.news.slice(0, 4).map((article) => (
                    <Card key={article.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg leading-tight">
                          {article.title_ar}
                        </CardTitle>
                        <CardDescription>
                          {article.summary_ar?.substring(0, 150)}...
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <Badge variant="outline">{article.category}</Badge>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {article.view_count || 0}
                            </div>
                          </div>
                          <Link
                            href={`/news/${article.id}`}
                            className="text-primary hover:underline text-sm"
                          >
                            قراءة المقال ←
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {searchResults.news.length > 4 && (
                  <div className="text-center">
                    <Link href="/news">
                      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        عرض جميع الأخبار
                      </Badge>
                    </Link>
                  </div>
                )}
              </section>
            )}

            {/* Tutorials Results */}
            {searchResults.tutorials.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">الدروس ({searchResults.tutorials.length})</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.tutorials.slice(0, 4).map((tutorial) => (
                    <Card key={tutorial.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg leading-tight">
                          {tutorial.title_ar}
                        </CardTitle>
                        <CardDescription>
                          {tutorial.content?.substring(0, 150)}...
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <Badge variant="outline">{tutorial.difficulty}</Badge>
                            <Badge variant="outline">{tutorial.category}</Badge>
                          </div>
                          <Link
                            href={`/tutorials/${tutorial.id}`}
                            className="text-primary hover:underline text-sm"
                          >
                            بدء الدرس ←
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {searchResults.tutorials.length > 4 && (
                  <div className="text-center">
                    <Link href="/tutorials">
                      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        عرض جميع الدروس
                      </Badge>
                    </Link>
                  </div>
                )}
              </section>
            )}

            {/* Blog Results */}
            {searchResults.blog.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <PenTool className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">المدونة ({searchResults.blog.length})</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.blog.slice(0, 4).map((article) => (
                    <Card key={article.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg leading-tight">
                          {article.title_ar}
                        </CardTitle>
                        <CardDescription>
                          {article.excerpt_ar?.substring(0, 150) || article.content_ar?.substring(0, 150)}...
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <Badge variant="outline">{article.category}</Badge>
                            {article.difficulty_level && (
                              <Badge variant="secondary">{article.difficulty_level}</Badge>
                            )}
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {article.view_count || 0}
                            </div>
                          </div>
                          <Link
                            href={`/blog/${article.slug}`}
                            className="text-primary hover:underline text-sm"
                          >
                            قراءة المقال ←
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {searchResults.blog.length > 4 && (
                  <div className="text-center">
                    <Link href="/blog">
                      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        عرض جميع مقالات المدونة
                      </Badge>
                    </Link>
                  </div>
                )}
              </section>
            )}
          </div>
        </FadeIn>
      </AdaptiveLayout>
    </>
  )
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ""

  return (
    <Suspense fallback={<PageLoading />}>
      <SearchResults query={query} />
    </Suspense>
  )
}