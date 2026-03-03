import type { MetadataRoute } from 'next'
import { getAllProducts } from '@/lib/actions/product'
import { getAllBlogs } from '@/lib/actions/blog'

export const dynamic = 'force-dynamic'

const PRIORITY = {
    home: 1.0,
    core: 0.8,   // about, products, blog, contact, certifications
    product: 0.8,
    blog: 0.8,
    legal: 0.3,  // privacy, terms, refund - rarely change
}

const FREQ = {
    daily: 'daily' as const,
    weekly: 'weekly' as const,
    monthly: 'monthly' as const,
    yearly: 'yearly' as const,
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://savajseeds.com'

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: FREQ.daily, priority: PRIORITY.home },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: FREQ.monthly, priority: PRIORITY.core },
        { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: FREQ.weekly, priority: PRIORITY.core },
        { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: FREQ.daily, priority: PRIORITY.core },
        { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: FREQ.monthly, priority: PRIORITY.core },
        { url: `${baseUrl}/certifications`, lastModified: new Date(), changeFrequency: FREQ.monthly, priority: PRIORITY.core },
        { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: FREQ.yearly, priority: PRIORITY.legal },
        { url: `${baseUrl}/terms-of-service`, lastModified: new Date(), changeFrequency: FREQ.yearly, priority: PRIORITY.legal },
        { url: `${baseUrl}/refund-policy`, lastModified: new Date(), changeFrequency: FREQ.yearly, priority: PRIORITY.legal },
    ]

    // Fetch dynamic products
    let productRoutes: MetadataRoute.Sitemap = []
    try {
        const products = await getAllProducts()
        productRoutes = products.map((product) => ({
            url: `${baseUrl}/products/${product.slug || product.id}`,
            lastModified: new Date(product.updatedAt || new Date()),
            changeFrequency: FREQ.weekly,
            priority: PRIORITY.product,
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
            changeFrequency: FREQ.weekly,
            priority: PRIORITY.blog,
        }))
    } catch (error) {
        console.error('Failed to fetch blogs for sitemap:', error)
    }

    return [...staticRoutes, ...productRoutes, ...blogRoutes]
}
