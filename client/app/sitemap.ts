import type { MetadataRoute } from 'next'
import { getApiUrl } from '@/lib/api-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://savajseeds.com'

    // Define static routes
    const staticRoutes = [
        '',
        '/about',
        '/products',
        '/contact',
        '/certifications',
        '/privacy-policy',
        '/terms-of-service',
        '/refund-policy',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Fetch dynamic products
    let productRoutes: MetadataRoute.Sitemap = []
    try {
        const res = await fetch(`${getApiUrl()}/products/active`, {
            next: { revalidate: 3600 } // Revalidate every hour
        })
        if (res.ok) {
            const data = await res.json()
            const products = data.data || []
            productRoutes = products.map((product: any) => ({
                url: `${baseUrl}/products/${product._id}`,
                lastModified: new Date(product.updatedAt || new Date()),
                changeFrequency: 'weekly' as const,
                priority: 0.6,
            }))
        }
    } catch (error) {
        console.error('Failed to fetch products for sitemap:', error)
    }

    return [...staticRoutes, ...productRoutes]
}
