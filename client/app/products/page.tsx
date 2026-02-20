import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/shared/breadcrumb"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { ProductsContent } from "@/components/features/product/products-content"
import PageTransition from "@/components/layout/page-transition"
import { StructuredData } from "@/components/providers/structured-data"
import { generateMetadata as generateSEOMetadata, generateBreadcrumbSchema } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: "Premium Quality Seeds - Vegetable, Crop & Hybrid Seeds",
  description: "Explore our comprehensive range of premium vegetable seeds, crop seeds, and hybrid varieties for optimal farming success. High-yielding, disease-resistant seeds for every season.",
  keywords: [
    "vegetable seeds", "crop seeds", "hybrid seeds", "organic sebeds", "seasonal seeds",
    "tomato seeds", "cucumber seeds", "pepper seeds", "wheat seeds", "rice seeds",
    "high yield seeds", "disease resistant seeds", "drought tolerant seeds",
    "premium quality seeds", "certified seeds", "agricultural products"
  ],
  url: "/products",
  type: "website",
})

import { getAllProducts } from "@/lib/actions/product"



export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await getAllProducts()

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <StructuredData data={breadcrumbSchema} />
      <SiteHeader />

      <div className="container">
        <Breadcrumb />
      </div>

      <main className="flex-1">

        <ProductsContent initialProducts={products} />

        <section className="py-20 md:py-28 bg-muted/40">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center space-y-7 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
              <h2 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
                {"Can't Find What You're Looking For?"}
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed font-light">
                Our team is here to help you find the perfect seeds for your specific needs and growing conditions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="h-12 px-8 text-base">
                  <Link href="/contact">
                    Contact Our Experts
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base bg-background">
                  <Link href="/search">
                    Search Products
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}