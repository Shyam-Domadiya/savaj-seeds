import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { getBlogBySlug } from '@/lib/actions/blog';
import { generateMetadata as generateSEOMetadata, generateArticleSchema } from '@/lib/seo';
import { StructuredData } from '@/components/providers/structured-data';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { sanitizeImageUrl } from '@/lib/utils/image';
import Image from 'next/image';

interface BlogPageProps {
    params: Promise<{
        slug: string
    }>
}

export async function generateMetadata({ params }: BlogPageProps) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);

    if (!blog) {
        return {
            title: "Article Not Found - Savaj Seeds",
        }
    }

    return generateSEOMetadata({
        title: blog.seoMetadata?.title || `${blog.title} | Savaj Seeds Blog`,
        description: blog.seoMetadata?.description || blog.excerpt,
        keywords: blog.seoMetadata?.keywords || [blog.category, 'agriculture blog', 'framing'],
        url: `/blog/${slug}`,
        type: 'website',
        image: sanitizeImageUrl(blog.coverImage) || '/images/logo.png',
    });
}

export default async function BlogDetailsPage({ params }: BlogPageProps) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);

    if (!blog) {
        notFound();
    }

    const articleSchema = generateArticleSchema({
        title: blog.title,
        description: blog.excerpt,
        image: sanitizeImageUrl(blog.coverImage) || '/images/logo.png',
        datePublished: new Date(blog.publishedAt).toISOString(),
        authorName: blog.author || 'Savaj Seeds Team',
        url: `/blog/${slug}`,
    });

    return (
        <div className="flex min-h-screen flex-col bg-muted/10">
            <StructuredData data={[articleSchema]} />
            <SiteHeader />
            <main className="flex-1 container py-8 pb-32">
                <Breadcrumb items={[
                    { label: "Home", href: "/" },
                    { label: "Blog", href: "/blog" },
                    { label: blog.title },
                ]} />

                <article className="max-w-3xl mx-auto mt-8 bg-card rounded-[2rem] p-6 md:p-12 shadow-xl border border-border/50">
                    <div className="space-y-4 text-center mb-8">
                        <span className="text-xs uppercase tracking-widest font-black text-primary bg-primary/10 px-3 py-1.5 rounded-full inline-block">
                            {blog.category}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                            {blog.title}
                        </h1>
                        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground font-medium">
                            <span className="flex items-center gap-2">By <span className="text-foreground">{blog.author}</span></span>
                            <span>•</span>
                            <time dateTime={blog.publishedAt}>{new Date(blog.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                        </div>
                    </div>

                    {blog.coverImage && (
                        <div className="relative aspect-video rounded-2xl overflow-hidden mb-10 shadow-lg">
                            <Image
                                src={sanitizeImageUrl(blog.coverImage) || ""}
                                alt={blog.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

                    <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: blog.content || '' }} />
                </article>
            </main>
            <SiteFooter />
        </div>
    );
}
