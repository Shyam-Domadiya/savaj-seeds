
import { notFound } from "next/navigation"
import Link from "next/link"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Breadcrumb } from "@/components/shared/breadcrumb"
import { ProductImageGallery } from "@/components/features/product/product-image-gallery"
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
        <Breadcrumb items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.name },
        ]} />
        <Button variant="ghost" size="sm" asChild className="rounded-full hover:bg-muted font-bold uppercase tracking-widest text-[10px]">
          <Link href="/products" className="flex items-center gap-2">
            <ArrowLeft className="h-3 w-3" /> Back to Products
          </Link>
        </Button>
      </div>

      <main className="flex-1 container pb-32 md:pb-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Visual Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`aspect-square sm:aspect-[4/3] lg:aspect-square relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl border border-border/50 ${visuals.gradient} flex items-center justify-center group bg-white dark:bg-card`}>
              {product.images?.some(img => sanitizeImageUrl(img.url)) ? (
                <ProductImageGallery images={product.images} productName={product.name} />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 transition-transform duration-700 group-hover:scale-105">
                  <div className={`h-32 w-32 md:h-40 md:w-40 rounded-full bg-white/80 dark:bg-black/20 backdrop-blur-xl flex items-center justify-center shadow-2xl mb-6 md:mb-8 ${visuals.iconColor} ring-1 ring-white/20`}>
                    {CategoryIcon ? (
                      <CategoryIcon className="h-16 w-16 md:h-20 md:w-20" />
                    ) : (
                      <span className="text-6xl md:text-7xl">{visuals.icon as string}</span>
                    )}
                  </div>
                  <h2 className={`text-3xl md:text-5xl font-black tracking-tighter ${visuals.iconColor} opacity-90 mb-2`}>
                    {visuals.label}
                  </h2>
                  <p className="text-muted-foreground font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs">Premium Agricultural Series</p>
                </div>
              )}
            </div>

            {/* Quick stats Grid (Maturity, Type, QR) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Card className="p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col justify-center items-center text-center bg-card/50 backdrop-blur-sm">
                <Clock className="h-5 w-5 md:h-6 md:w-6 text-primary mb-2" />
                <span className="text-[9px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Maturity</span>
                <span className="font-black text-xs md:text-sm">{product.maturityTime}</span>
              </Card>
              <Card className="p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col justify-center items-center text-center bg-card/50 backdrop-blur-sm">
                <Leaf className="h-5 w-5 md:h-6 md:w-6 text-primary mb-2" />
                <span className="text-[9px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Type</span>
                <span className="font-black text-xs md:text-sm">{product.category}</span>
              </Card>
              <Card className="col-span-1 sm:col-span-1 rounded-2xl border border-border/50 shadow-sm flex flex-col justify-center items-center bg-card/50 backdrop-blur-sm overflow-hidden p-2">
                <div className="w-16 h-16 sm:w-full sm:h-full">
                  <ProductQR hideLabel={true} className="w-full h-full rounded-lg border-0 shadow-none bg-transparent" />
                </div>
              </Card>
            </div>
          </div>

          {/* Info Column (Card Style) */}
          <div className="lg:col-span-7 space-y-8 md:space-y-10">
            <div className="bg-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-2xl border border-border/50 relative overflow-hidden">
              {/* Abstract decorative element */}
              <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] opacity-20 ${visuals.iconColor}`} />

              <div className={`absolute top-0 right-0 p-8 opacity-5 -rotate-12 transform translate-x-8 -translate-y-8 pointer-events-none transition-transform duration-1000 group-hover:rotate-0`}>
                {CategoryIcon && <CategoryIcon className="h-64 w-64" />}
              </div>

              {/* Header info */}
              <div className="relative z-10 space-y-6 md:space-y-8">
                <div className="space-y-4 md:space-y-6">
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    <Badge variant="secondary" className={`px-3 py-1 md:px-4 md:py-1.5 text-[9px] md:text-xs font-black uppercase tracking-widest ${visuals.accent} rounded-full`}>
                      {product.subcategory !== 'General' ? product.subcategory : product.category}
                    </Badge>
                    {product.featured && (
                      <Badge className="bg-gradient-to-r from-primary to-emerald-500 text-white border-0 shadow-lg px-3 py-1 md:px-4 md:py-1.5 text-[9px] md:text-xs font-black uppercase tracking-widest rounded-full">
                        Featured Collection
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-3xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.1] md:leading-[1] text-balance">
                    {product.name}
                  </h1>

                  <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
                    {product.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 md:pt-6">
                  <Button size="lg" className="h-14 md:h-16 px-8 md:px-10 rounded-full text-base md:text-lg font-black uppercase tracking-wider shadow-xl md:shadow-2xl hover:shadow-primary/40 transition-all hover:scale-105 bg-primary text-primary-foreground flex-1" asChild>
                    <Link href={`/contact?subject=Order Request for ${product.name}`}>
                      Request Quote
                    </Link>
                  </Button>
                  <DownloadGuideButton product={product} />
                </div>
              </div>
            </div>

            {/* Specifications Section */}
            <div className="grid md:grid-cols-2 gap-4 md:gap-6 pb-2">
              <Card className="rounded-[1.5rem] md:rounded-3xl border-border/50 shadow-lg overflow-hidden">
                <CardHeader className="bg-muted/30 pb-3 md:pb-4">
                  <CardTitle className="text-lg md:text-xl font-black uppercase tracking-widest text-primary/80">Traits</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 md:pt-6 space-y-3 md:space-y-4">
                  {basicSpecs.map(spec => (
                    <div key={spec.id} className="flex justify-between items-center py-2 md:py-3 border-b border-border/40 last:border-0 group">
                      <span className="text-muted-foreground font-bold text-[10px] md:text-xs uppercase tracking-widest">{spec.name}</span>
                      <span className="font-black text-xs md:text-sm group-hover:text-primary transition-colors">{spec.value}</span>
                    </div>
                  ))}
                  {product.seedColor && (
                    <div className="flex justify-between items-center py-2 md:py-3 border-b border-border/40 last:border-0 group">
                      <span className="text-muted-foreground font-bold text-[10px] md:text-xs uppercase tracking-widest">Seed Color</span>
                      <span className="font-black text-xs md:text-sm group-hover:text-primary transition-colors">{product.seedColor}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-[1.5rem] md:rounded-3xl border-border/50 shadow-lg overflow-hidden h-full">
                <CardHeader className="bg-muted/30 pb-3 md:pb-4">
                  <CardTitle className="text-lg md:text-xl font-black uppercase tracking-widest text-primary/80">Cultivation</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 md:pt-6 space-y-3 md:space-y-4">
                  <div className="flex justify-between items-center py-2 md:py-3 border-b border-border/40 group">
                    <span className="text-muted-foreground font-bold text-[10px] md:text-xs uppercase tracking-widest">Maturity</span>
                    <span className="font-black text-xs md:text-sm group-hover:text-primary transition-colors">{product.maturityTime}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 md:py-3 border-b border-border/40 group">
                    <span className="text-muted-foreground font-bold text-[10px] md:text-xs uppercase tracking-widest">Yield</span>
                    <span className="font-black text-xs md:text-sm group-hover:text-primary transition-colors">{product.yieldExpectation}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 md:mt-24 border-t border-border/50 pt-16 md:pt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-12 md:mb-16">
              <div className="space-y-3 md:space-y-4">
                <Badge variant="secondary" className={`px-4 py-1.5 md:px-5 md:py-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] ${visuals.accent} rounded-full`}>
                  Discovery
                </Badge>
                <h2 className="text-3xl md:text-6xl font-black tracking-tight leading-none">Similar <span className="text-primary italic">Varieties</span></h2>
              </div>
              <Button variant="outline" asChild className="rounded-full h-12 md:h-14 px-8 md:px-10 font-black uppercase tracking-widest text-[10px] md:text-xs border-2 hover:bg-primary hover:text-white hover:border-primary transition-all">
                <Link href="/products">View All Seeds</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />

    </div>
  )
}
