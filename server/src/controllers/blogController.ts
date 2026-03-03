import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Blog from '../models/Blog';
import slugify from 'slugify';

// @desc    Fetch all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = asyncHandler(async (req: Request, res: Response) => {
    const keyword = req.query.keyword
        ? {
            title: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const category = req.query.category
        ? { category: req.query.category }
        : {};

    // Combine filters
    const filter = { ...keyword, ...category, isPublished: true };

    const blogs = await Blog.find(filter as any)
        .sort({ publishedAt: -1 })
        .select('title slug excerpt coverImage category author publishedAt pageViews');

    res.json(blogs);
});

// @desc    Fetch single blog
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const blog = await Blog.findOne({
        $or: [
            { slug: id },
            ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])
        ],
        isPublished: true
    });

    if (blog) {
        // Increment view count atomically
        await Blog.findByIdAndUpdate(blog._id, { $inc: { pageViews: 1 } });
        res.json(blog);
    } else {
        res.status(404);
        throw new Error('Blog not found');
    }
});

// @desc    Admin: Create a blog
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = asyncHandler(async (req: Request, res: Response) => {
    const {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        category,
        author,
        tags,
        seoMetadata,
        isPublished,
        publishedAt
    } = req.body;

    const baseSlug = slug || (title ? slugify(title, { lower: true, strict: true }) : 'new-blog');

    const blog = new Blog({
        title: title || 'Unnamed Blog',
        slug: baseSlug,
        content,
        excerpt,
        coverImage,
        category,
        author,
        tags: tags || [],
        seoMetadata,
        isPublished: isPublished !== undefined ? isPublished : true,
        publishedAt: publishedAt || Date.now()
    });

    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
});

// @desc    Admin: Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
        await blog.deleteOne();
        res.json({ message: 'Blog removed' });
    } else {
        res.status(404);
        throw new Error('Blog not found');
    }
});

// @desc    Admin: Update a blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
    try {
        const {
            title,
            slug,
            content,
            excerpt,
            coverImage,
            category,
            author,
            tags,
            seoMetadata,
            isPublished,
            publishedAt
        } = req.body;

        const blog = await Blog.findById(req.params.id);

        if (blog) {
            blog.title = title || blog.title;
            blog.slug = slug ? slugify(slug, { lower: true, strict: true }) : blog.slug;
            blog.content = content || blog.content;
            blog.excerpt = excerpt || blog.excerpt;
            blog.coverImage = coverImage || blog.coverImage;
            blog.category = category || blog.category;
            blog.author = author || blog.author;
            blog.tags = tags || blog.tags;
            blog.seoMetadata = seoMetadata || blog.seoMetadata;
            blog.isPublished = isPublished !== undefined ? isPublished : blog.isPublished;
            blog.publishedAt = publishedAt || blog.publishedAt;

            const updatedBlog = await blog.save();
            res.json(updatedBlog);
        } else {
            res.status(404);
            throw new Error('Blog not found');
        }
    } catch (error: any) {
        console.error('Update Blog Error:', error);
        if (error.code === 11000) {
            res.status(400);
            throw new Error('Blog with this slug already exists');
        }
        throw error;
    }
});
