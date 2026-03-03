import { getApiUrl } from '@/lib/api-config';

const API_URL = getApiUrl();

export interface Blog {
    id: string;
    title: string;
    slug: string;
    content?: string;
    excerpt: string;
    coverImage: string;
    category: string;
    author: string;
    tags?: string[];
    seoMetadata?: {
        title?: string;
        description?: string;
        keywords?: string[];
    };
    publishedAt: string;
    pageViews?: number;
}

const transformBlog = (b: any): Blog => {
    return {
        ...b,
        id: b._id || b.slug,
    };
};

export async function getAllBlogs(category?: string, keyword?: string): Promise<Blog[]> {
    try {
        const query = new URLSearchParams();
        if (category) query.append('category', category);
        if (keyword) query.append('keyword', keyword);

        const res = await fetch(`${API_URL}/blogs?${query.toString()}`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error('Failed to fetch blogs');
        }

        const blogs = await res.json();
        return blogs.map(transformBlog);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return [];
    }
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
    try {
        const res = await fetch(`${API_URL}/blogs/${slug}`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            return null;
        }

        const blog = await res.json();
        return transformBlog(blog);
    } catch (error) {
        console.error(`Error fetching blog ${slug}:`, error);
        return null;
    }
}
