import express from 'express';
import { SitemapStream, streamToPromise } from 'sitemap';
import Product from '../models/Product';
import Blog from '../models/Blog';
import zlib from 'zlib';

const router = express.Router();

let sitemap: Buffer | null = null;
let lastUpdated: number = 0;
const CACHE_DURATION_MS = 1000 * 60 * 60 * 6; // 6 hours cache

router.get('/', async (req, res) => {
    try {
        res.header('Content-Type', 'application/xml');
        res.header('Content-Encoding', 'gzip');

        // If we have a cached sitemap and it hasn't expired, return it
        if (sitemap && lastUpdated && (Date.now() - lastUpdated) < CACHE_DURATION_MS) {
            return res.send(sitemap);
        }

        const smStream = new SitemapStream({ hostname: 'https://savajseeds.com' });
        const pipeline = smStream.pipe(zlib.createGzip());

        // Basic Core Pages
        smStream.write({ url: '/', changefreq: 'weekly', priority: 1.0 });
        smStream.write({ url: '/about', changefreq: 'monthly', priority: 0.8 });
        smStream.write({ url: '/products', changefreq: 'daily', priority: 0.9 });
        smStream.write({ url: '/contact', changefreq: 'monthly', priority: 0.8 });
        smStream.write({ url: '/blog', changefreq: 'daily', priority: 0.8 });

        // Legal / Supporting Pages
        const legalPages = ['/privacy-policy', '/terms-of-service', '/refund-policy', '/shipping-policy'];
        legalPages.forEach(page => {
            smStream.write({ url: page, changefreq: 'monthly', priority: 0.3 });
        });

        // Fetch Dynamic Data from MongoDB
        const [products, blogs] = await Promise.all([
            Product.find({ availability: true }).select('slug updatedAt'),
            Blog.find({ isPublished: true }).select('slug updatedAt')
        ]);

        // Add Product Pages
        products.forEach(product => {
            smStream.write({
                url: `/products/${product.slug}`,
                changefreq: 'weekly',
                priority: 0.8,
                lastmod: product.updatedAt ? product.updatedAt.toISOString() : new Date().toISOString()
            });
        });

        // Extract and add custom category routes if applicable
        const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
        categories.forEach(category => {
            smStream.write({
                url: `/products?category=${category}`,
                changefreq: 'weekly',
                priority: 0.7
            });
        });

        // Add Blog Pages
        blogs.forEach(blog => {
            smStream.write({
                url: `/blog/${blog.slug}`,
                changefreq: 'monthly',
                priority: 0.8,
                lastmod: blog.updatedAt ? blog.updatedAt.toISOString() : new Date().toISOString()
            });
        });

        smStream.end();

        // Convert the stream to a promise and store the buffer
        streamToPromise(pipeline).then((sm) => {
            sitemap = sm;
            lastUpdated = Date.now();
            res.send(sitemap);
        }).catch((err) => {
            console.error('Error in sitemap stream:', err);
            res.status(500).end();
        });

    } catch (error) {
        console.error('Sitemap Error:', error);
        res.status(500).end();
    }
});

export default router;
