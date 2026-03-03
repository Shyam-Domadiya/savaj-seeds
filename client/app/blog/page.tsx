import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { getAllBlogs } from '@/lib/actions/blog';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf } from 'lucide-react';
import { sanitizeImageUrl } from '@/lib/utils/image';
import Image from 'next/image';

export const metadata = generateSEOMetadata({
    title: 'Agricultural Blog & Advice - Savaj Seeds',
    description: 'Expert agricultural advice, farming tips, and latest news about seeds and crop management for Indian farmers.',
    keywords: ['agriculture blog', 'farming tips', 'crop management', 'seed guidance', 'Savaj Seeds news', 'Indian farming'],
    url: '/blog',
});

export default async function BlogListingPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
    const { category } = await searchParams;
    const blogs = await getAllBlogs(category);

    return (
        <div className="flex min-h-screen flex-col bg-muted/10">
            <SiteHeader />
            <main className="flex-1 container py-12">
                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                        Farmer's <span className="text-primary">Knowledge Hub</span>
                    </h1>
                    <p className="text-lg text-muted-foreground w-full max-w-2xl mx-auto">
                        Latest insights, tips, and updates for maximizing your crop yield.
                    </p>
                </div>

                {blogs.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <Leaf className="h-12 w-12 mx-auto mb-4 text-primary/40" />
                        <h2 className="text-xl font-bold">No articles found</h2>
                        <p>Check back later for new agricultural insights.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map(blog => (
                            <Card key={blog.id} className="overflow-hidden group rounded-2xl border-border/50 shadow-md hover:shadow-xl transition-all h-full flex flex-col">
                                <Link href={`/blog/${blog.slug}`} className="block relative aspect-video overflow-hidden bg-muted">
                                    {blog.coverImage && (
                                        <Image
                                            src={sanitizeImageUrl(blog.coverImage) || ""}
                                            alt={blog.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    )}
                                </Link>
                                <CardHeader className="flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                                            {blog.category}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {new Date(blog.publishedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <Link href={`/blog/${blog.slug}`} className="hover:text-primary transition-colors">
                                        <CardTitle className="text-xl font-bold line-clamp-2 leading-tight">
                                            {blog.title}
                                        </CardTitle>
                                    </Link>
                                    <CardDescription className="line-clamp-3 mt-2">
                                        {blog.excerpt}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <Button variant="ghost" asChild className="w-full text-primary hover:text-primary hover:bg-primary/5">
                                        <Link href={`/blog/${blog.slug}`}>
                                            Read Article
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
            <SiteFooter />
        </div>
    );
}
