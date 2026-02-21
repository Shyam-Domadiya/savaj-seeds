"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Sprout, FileText, ArrowRight, Package } from "lucide-react"

import { Product } from "@/lib/types/product"
import { cn } from "@/lib/utils"
import { sanitizeImageUrl } from "@/lib/utils/image"

export function SearchResults({ initialProducts }: { initialProducts: Product[] }) {
    const searchParams = useSearchParams()
    const initialQuery = searchParams.get("q") || ""
    const [query, setQuery] = useState(initialQuery)

    // Filter Products
    const filteredProducts = initialProducts.filter(product => {
        const searchTerm = query.toLowerCase()
        return (
            product.name?.toLowerCase().includes(searchTerm) ||
            product.description?.toLowerCase().includes(searchTerm) ||
            product.category?.toLowerCase().includes(searchTerm)
        )
    })

    const totalResults = filteredProducts.length

    useEffect(() => {
        setQuery(searchParams.get("q") || "")
    }, [searchParams])

    return (
        <div className="space-y-8">
            {/* Search Header */}
            <div className="space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
                <div className="relative max-w-xl">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search products..."
                        className="pl-10 h-12 text-lg"
                    />
                </div>
                <p className="text-muted-foreground">
                    Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
                </p>
            </div>

            {/* PRODUCTS */}
            <div className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                {filteredProducts.length === 0 && <NoResults />}
            </div>
        </div>
    )
}

function ProductCard({ product }: { product: any }) {
    return (
        <Link href={`/products/${product.id}`} className="group">
            <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative h-48 bg-muted/30 overflow-hidden flex items-center justify-center">
                    {sanitizeImageUrl(product.images[0]?.url) ? (
                        <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="p-8 flex items-center justify-center">
                            <Image
                                src="/logo.png"
                                alt="Savaj Seeds Logo"
                                width={128}
                                height={128}
                                className="w-32 h-32 object-contain opacity-50 grayscale transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    )}
                    <div className="absolute top-2 right-2 z-10">
                        <Badge className="bg-white/90 text-foreground backdrop-blur hover:bg-white border-none shadow-sm">{product.category}</Badge>
                    </div>
                </div>
                <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {product.seasonality?.slice(0, 2).map((season: string) => (
                            <Badge key={season} variant="secondary" className="text-xs">{season}</Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

function NoResults() {
    return (
        <div className="text-center py-20 bg-muted/30 rounded-lg">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No results found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or browse our categories.</p>
            <div className="mt-6 flex justify-center gap-4">
                <Button variant="outline" asChild><Link href="/products">View All Products</Link></Button>
            </div>
        </div>
    )
}
