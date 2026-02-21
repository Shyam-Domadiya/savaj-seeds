// ... (keeping imports)
import { notFound } from "next/navigation"
import Link from "next/link"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Breadcrumb } from "@/components/shared/breadcrumb"
import { ProductImageGallery } from "@/components/features/product/product-image-gallery"
import { ExpandableSection } from "@/components/shared/expandable-section"
import { DownloadableResources } from "@/components/sections/resources/DownloadableResources"
import { StructuredData } from "@/components/providers/structured-data"
import PageTransition from "@/components/layout/page-transition"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { getProductById, getAllProducts } from "@/lib/actions/product"
import { generateMetadata as generateSEOMetadata, generateProductSchema, generateBreadcrumbSchema } from "@/lib/seo"
import { DownloadGuideButton } from "@/components/features/product/download-guide-button"
import { ProductQR } from "@/components/features/product/product-qr"
import { getCategoryVisuals } from "@/lib/utils/product-visuals"
import { Clock, Leaf, ArrowLeft, ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/features/product/products-content"
import { sanitizeImageUrl } from "@/lib/utils/image"

// Hard-coded ProductCard for Related Products (to avoid circular dependency or complex extraction)
// Alternatively, we can import it if we are careful about organization.
// Let's try importing a simplified version or just the real one if products-content doesn't import page.tsx.
// Product Card is now imported from products-content
// We need the Card component for related products


interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    return {
      title: "Product Not Found - Savaj Seeds",
      description: "The requested product could not be found.",
    }
  }

  return generateSEOMetadata({
    title: product.seoMetadata.title,
    description: product.seoMetadata.description,
    keywords: product.seoMetadata.keywords,
    url: `/products/${id}`,
    type: 'website',
    image: sanitizeImageUrl(product.images[0]?.url) || '/images/logo.png',
  })
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  const allProducts = await getAllProducts()
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.subcategory === product.subcategory))
    .slice(0, 4)

  const basicSpecs = product.specifications.filter(spec => spec.category === 'Basic')

  const visuals = getCategoryVisuals(product.category);
  const CategoryIcon = typeof visuals.icon !== 'string' ? visuals.icon : null;

  // Generate structured data for the product
  const productSchema = generateProductSchema({
    name: product.name,
    description: product.description,
    image: sanitizeImageUrl(product.images[0]?.url) || '/images/logo.png',
    category: product.category,
    brand: 'Savaj Seeds',
    sku: product.id,
    availability: product.availability ? 'InStock' : 'OutOfStock',
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: product.name, url: `/products/${id}` },
  ])

  return (
    <div className="flex min-h-screen flex-col bg-muted/10">
      <StructuredData data={[productSchema, breadcrumbSchema]} />
      <SiteHeader />

      <div className="container py-6 flex items-center justify-between">
        <Breadcrumb />
        <Button variant="ghost" size="sm" asChild className="rounded-full hover:bg-muted font-bold uppercase tracking-widest text-[10px]">
          <Link href="/products" className="flex items-center gap-2">
            <ArrowLeft className="h-3 w-3" /> Back to Products
          </Link>
        </Button>
      </div>

      <main className="flex-1 container pb-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Visual Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`aspect-square sm:aspect-[4/3] lg:aspect-square relative rounded-[2rem] overflow-hidden shadow-2xl border border-border/50 ${visuals.gradient} flex items-center justify-center group bg-white dark:bg-card`}>
              {product.images?.some(img => sanitizeImageUrl(img.url)) ? (
                <ProductImageGallery images={product.images} productName={product.name} />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-12 transition-transform duration-700 group-hover:scale-105">
                  <div className={`h-40 w-40 rounded-full bg-white/80 dark:bg-black/20 backdrop-blur-xl flex items-center justify-center shadow-2xl mb-8 ${visuals.iconColor} ring-1 ring-white/20`}>
                    {CategoryIcon ? (
                      <CategoryIcon className="h-20 w-20" />
                    ) : (
                      <span className="text-7xl">{visuals.icon as string}</span>
                    )}
                  </div>
                  <h2 className={`text-5xl font-black tracking-tighter ${visuals.iconColor} opacity-90 mb-2`}>
                    {visuals.label}
                  </h2>
                  <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-xs">Premium Agricultural Series</p>
                </div>
              )}
            </div>

            {/* Quick stats for Mobile/Tablet (Stacked below image) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card p-4 rounded-xl border border-border/50 shadow-sm flex flex-col justify-center items-center text-center">
                <Clock className="h-6 w-6 text-primary mb-2" />
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Maturity</span>
                <span className="font-semibold text-sm">{product.maturityTime}</span>
              </div>
              <div className="bg-card p-4 rounded-xl border border-border/50 shadow-sm flex flex-col justify-center items-center text-center">
                <Leaf className="h-6 w-6 text-primary mb-2" />
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Type</span>
                <span className="font-semibold text-sm">{product.category}</span>
              </div>
            </div>
          </div>

          {/* Info Column (Card Style) */}
          <div className="lg:col-span-7 space-y-10">
            <div className="bg-card rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-border/50 relative overflow-hidden">
              {/* Abstract decorative element */}
              <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] opacity-20 ${visuals.iconColor}`} />

              <div className={`absolute top-0 right-0 p-8 opacity-5 -rotate-12 transform translate-x-8 -translate-y-8 pointer-events-none transition-transform duration-1000 group-hover:rotate-0`}>
                {CategoryIcon && <CategoryIcon className="h-64 w-64" />}
              </div>

              {/* Header info */}
              <div className="relative z-10 space-y-8">
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="secondary" className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest ${visuals.accent} rounded-full`}>
                      {product.subcategory !== 'General' ? product.subcategory : product.category}
                    </Badge>
                    {product.featured && (
                      <Badge className="bg-gradient-to-r from-primary to-emerald-500 text-white border-0 shadow-lg px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-full">
                        Featured Collection
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1] text-balance">
                    {product.name}
                  </h1>

                  <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
                    {product.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button size="lg" className="h-16 px-10 rounded-full text-lg font-black uppercase tracking-wider shadow-2xl hover:shadow-primary/40 transition-all hover:scale-105 bg-primary text-primary-foreground flex-1" asChild>
                    <Link href={`/contact?subject=Order Request for ${product.name}`}>
                      Request Quote
                    </Link>
                  </Button>
                  <DownloadGuideButton product={product} />
                  <div className="hidden sm:block">
                    <ProductQR hideLabel={true} className="h-16 w-16" />
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications Section */}
            <div className="grid md:grid-cols-2 gap-6 pb-2">
              <Card className="rounded-3xl border-border/50 shadow-lg overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                  <CardTitle className="text-xl font-black uppercase tracking-widest text-primary/80">Traits</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {basicSpecs.map(spec => (
                    <div key={spec.id} className="flex justify-between items-center py-3 border-b border-border/40 last:border-0 group">
                      <span className="text-muted-foreground font-bold text-xs uppercase tracking-widest">{spec.name}</span>
                      <span className="font-black text-sm group-hover:text-primary transition-colors">{spec.value}</span>
                    </div>
                  ))}
                  {product.seedColor && (
                    <div className="flex justify-between items-center py-3 border-b border-border/40 last:border-0 group">
                      <span className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Seed Color</span>
                      <span className="font-black text-sm group-hover:text-primary transition-colors">{product.seedColor}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-border/50 shadow-lg overflow-hidden h-full">
                <CardHeader className="bg-muted/30 pb-4">
                  <CardTitle className="text-xl font-black uppercase tracking-widest text-primary/80">Cultivation</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-border/40 group">
                    <span className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Maturity</span>
                    <span className="font-black text-sm group-hover:text-primary transition-colors">{product.maturityTime}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/40 group">
                    <span className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Yield</span>
                    <span className="font-black text-sm group-hover:text-primary transition-colors">{product.yieldExpectation}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 border-t border-border/50 pt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div className="space-y-4">
                <Badge variant="secondary" className={`px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] ${visuals.accent} rounded-full`}>
                  Discovery
                </Badge>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Similar <span className="text-primary italic">Varieties</span></h2>
              </div>
              <Button variant="outline" asChild className="rounded-full h-14 px-10 font-black uppercase tracking-widest text-xs border-2 hover:bg-primary hover:text-white hover:border-primary transition-all">
                <Link href="/products">View All Seeds</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />

      {/* Sticky Bottom Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border/50 z-40 sm:hidden">
        <Button className="w-full h-16 rounded-full text-base font-black uppercase tracking-widest shadow-2xl shadow-primary/40 bg-primary" asChild>
          <Link href={`/contact?subject=Order Request for ${product.name}`}>
            Request Quote
          </Link>
        </Button>
      </div>
    </div>
  )
}
