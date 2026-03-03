import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://savajseeds.com'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/shreenath/',   // admin panel
                    '/api/',          // API routes
                    '/_next/',        // Next.js internals
                    '/search',        // search results pages (no unique SEO value)
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
