import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage: string;
    category: string;
    author: string;
    tags: string[];
    seoMetadata: {
        title: string;
        description: string;
        keywords: string[];
    };
    isPublished: boolean;
    publishedAt: Date;
    pageViews: number;
    createdAt: Date;
    updatedAt: Date;
}

const blogSchema: Schema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, index: true },
        content: { type: String, required: true },
        excerpt: { type: String, required: true },
        coverImage: { type: String, required: true },
        category: { type: String, required: true, index: true },
        author: { type: String, default: 'Admin' },
        tags: [{ type: String }],

        seoMetadata: {
            title: String,
            description: String,
            keywords: [String]
        },

        isPublished: { type: Boolean, default: true, index: true },
        publishedAt: { type: Date, default: Date.now },
        pageViews: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

import slugify from 'slugify';

blogSchema.index({ title: 'text', content: 'text', category: 'text', tags: 'text' } as any);

blogSchema.pre('validate', function (next: any) {
    if (this.title && (!this.slug || this.isModified('title'))) {
        this.slug = (slugify as any)(this.title, { lower: true, strict: true });
    }
    if (next) next();
});

const Blog = mongoose.model<IBlog>('Blog', blogSchema);
export default Blog;
