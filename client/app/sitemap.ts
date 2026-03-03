import type { MetadataRoute } from 'next'
import { getAllProducts } from '@/lib/actions/product'
import { getAllBlogs } from '@/lib/actions/blog'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://savajseeds.com'

    // Define static routes
    const staticRoutes = [
        '',
        '/about',
        '/products',
        '/blog',
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
        const products = await getAllProducts()
        productRoutes = products.map((product) => ({
            url: `${baseUrl}/products/${product.id || product.slug}`,
            lastModified: new Date(), // using current date since updatedAt isn't always available in Product interface, or we can add it later
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }))
    } catch (error) {
        console.error('Failed to fetch products for sitemap:', error)
    }

    // Fetch dynamic blogs
    let blogRoutes: MetadataRoute.Sitemap = []
    try {
        const blogs = await getAllBlogs()
        blogRoutes = blogs.map((blog) => ({
            url: `${baseUrl}/blog/${blog.slug}`,
            lastModified: new Date(blog.publishedAt || new Date()),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }))
    } catch (error) {
        console.error('Failed to fetch blogs for sitemap:', error)
    }

    return [...staticRoutes, ...productRoutes, ...blogRoutes]
}
