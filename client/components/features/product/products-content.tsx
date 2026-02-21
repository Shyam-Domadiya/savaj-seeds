"use client"

import Link from "next/link"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getApiUrl } from "@/lib/api-config"
import { ProductFilter } from "@/components/features/product/product-filter"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
// import { sampleProducts } from "@/lib/data/products"
import { useProductFilter } from "@/components/features/product/hooks/use-product-filter"
import { Product } from "@/lib/types/product"
import { getCategoryVisuals } from "@/lib/utils/product-visuals"
import { ArrowRight, Info } from "lucide-react"

function ProductCard({
  product,
}: {
  product: Product
}) {
  const visuals = getCategoryVisuals(product.category);
  const CategoryIcon = typeof visuals.icon !== 'string' ? visuals.icon : null;

  return (
    <Link href={`/products/${product.id}`} className="block h-full group">
      <Card className="h-full flex flex-col hover:shadow-2xl transition-all duration-500 border-border/50 hover:-translate-y-2 cursor-pointer overflow-hidden bg-card/60 backdrop-blur-sm relative group">
        {/* Visual Polish: Background Glow */}
        <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 ${visuals.iconColor} group-hover:opacity-30 transition-opacity duration-500`} />

        {/* Image / Visual Header */}
        <div className={`relative aspect-[4/3] w-full overflow-hidden ${visuals.gradient} flex items-center justify-center`}>
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={product.images[0].altText || product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 group-hover:scale-110 transition-transform duration-500">
              {CategoryIcon ? (
                <CategoryIcon className={`h-16 w-16 mb-4 ${visuals.iconColor} filter drop-shadow-md`} />
              ) : (
                <span className="text-6xl mb-4 filter drop-shadow-md">{visuals.icon as string}</span>
              )}
              <span className={`text-xs font-bold uppercase tracking-[0.2em] ${visuals.iconColor} opacity-80`}>
                {visuals.label}
              </span>
            </div>
          )}

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
            <span className="inline-flex items-center justify-center rounded-full text-sm font-bold bg-white text-black hover:bg-primary hover:text-white h-11 px-6 shadow-2xl translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-professional">
              View Details <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </div>

          {product.featured && (
            <div className="absolute top-4 left-4 z-20">
              <Badge className="bg-primary/95 hover:bg-primary shadow-lg backdrop-blur-md px-3 py-1 text-xs font-bold ring-2 ring-white/20">
                Premium
              </Badge>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 p-6 space-y-5">
          {/* Title & basic info */}
          <div className="space-y-1">
            <div className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${visuals.iconColor}`}>
              {product.subcategory !== 'General' ? product.subcategory : product.category}
            </div>
            <CardTitle className="text-xl font-black leading-tight group-hover:text-primary transition-colors duration-300 text-balance lg:text-2xl">
              {product.name}
            </CardTitle>
          </div>

          {/* Key Attributes - Aesthetic Refinement */}
          <div className="grid grid-cols-2 gap-3 pb-2">
            <div className="bg-muted/40 p-3 rounded-xl border border-border/50 flex flex-col items-center justify-center text-center group-hover:bg-muted/60 transition-colors">
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Maturity</span>
              <span className="font-bold text-xs truncate max-w-full">{product.maturityTime}</span>
            </div>
            <div className="bg-muted/40 p-3 rounded-xl border border-border/50 flex flex-col items-center justify-center text-center group-hover:bg-muted/60 transition-colors">
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Yield</span>
              <span className="font-bold text-xs truncate max-w-full">{product.yieldExpectation}</span>
            </div>
          </div>

          {/* Morphological Characters - Subtle Detail */}
          {product.morphologicalCharacters && (
            <div className="flex gap-2 items-start bg-primary/5 p-3 rounded-xl border border-primary/10">
              <Info className={`h-4 w-4 mt-0.5 flex-shrink-0 ${visuals.iconColor}`} />
              <p className="text-xs leading-relaxed text-foreground/80 font-medium line-clamp-2 italic">
                {product.morphologicalCharacters}
              </p>
            </div>
          )}

          <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
            <div className="flex gap-1.5 font-bold">
              <Badge variant="outline" className="text-[10px] h-6 px-2 bg-background/50 border-border/50 rounded-md">
                {product.seasonality[0]}
              </Badge>
              <Badge variant="outline" className="text-[10px] h-6 px-2 bg-background/50 border-border/50 rounded-md">
                {product.difficultyLevel}
              </Badge>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
              Explore
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export function ProductsContent({ initialProducts }: { initialProducts: Product[] }) {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['public-products'],
    queryFn: async () => {
      const apiUrl = getApiUrl();
      console.log('Fetching products client-side from:', apiUrl);

      const res = await fetch(`${apiUrl}/products`);
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await res.json();
      // Transform data to match Product type
      return data.map((p: any) => ({
        ...p,
        id: p.slug,
        mongoId: p._id,
        specifications: [
          p.seedColor && { id: 'seedColor', name: 'Seed Color', value: p.seedColor, category: 'Basic' },
          p.morphologicalCharacters && { id: 'morph', name: 'Morphological Characters', value: p.morphologicalCharacters, category: 'Basic' },
          p.flowerColor && { id: 'flowerColor', name: 'Flower Color', value: p.flowerColor, category: 'Basic' },
          p.fruitShape && { id: 'fruitShape', name: 'Fruit Shape', value: p.fruitShape, category: 'Basic' },
          p.plantHeight && { id: 'plantHeight', name: 'Plant Height', value: p.plantHeight, category: 'Basic' },
        ].filter(Boolean),
        images: p.images || [],
        seasonality: p.seasonality || [],
        seoMetadata: p.seoMetadata || { title: p.name, description: p.description, keywords: [] }
      }));
    },
    initialData: initialProducts.length > 0 ? initialProducts : undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: initialProducts.length === 0,
  });

  const {
    filters,
    sort,
    filteredProducts,
    filterStats,
    setFilters,
    setSort,
    clearFilters
  } = useProductFilter({
    products: products
  })

  return (
    <>
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-28 relative overflow-hidden animate-in fade-in duration-700">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="container relative z-10">

          <div className="mx-auto max-w-3xl text-center space-y-7 animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-100">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance leading-[1.1]">
              Our{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Seed Collection
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed font-light">
              Discover premium quality seeds carefully selected and tested for optimal performance in diverse growing
              conditions.
            </p>
            <div className="flex items-center justify-center gap-4">
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1">
              <ProductFilter
                filters={filters}
                sort={sort}
                onFiltersChange={setFilters}
                onSortChange={setSort}
                onClearFilters={clearFilters}
              />
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="space-y-8">
                {filteredProducts.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-2">No products found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters to see more results
                    </p>
                    <Button onClick={clearFilters} variant="outline">
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}