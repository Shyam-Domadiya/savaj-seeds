import mongoose, { Document, Schema } from 'mongoose';

export interface IProductImage {
    url: string;
    altText?: string;
    isPrimary?: boolean;
}

export interface IGrowingGuideSection {
    title: string;
    content: string;
}

export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    longDescription?: string;
    category: string;
    cropName?: string;

    // Agricultural Attributes
    seedColor?: string;
    morphologicalCharacters?: string;
    flowerColor?: string;
    fruitShape?: string;
    plantHeight?: string;

    // Farming Info
    seasonality: string[];
    maturityTime?: string;
    yieldExpectation?: string;
    difficultyLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
    varietyType?: string;       // Hybrid / Open Pollinated / Organic
    sowingTime?: string;
    harvestTime?: string;
    soilType?: string;          // Black soil, Loamy, Sandy
    waterRequirement?: string;  // Low / Medium / High

    // Images
    images: IProductImage[];

    // Guides
    plantingInstructions?: string;
    careInstructions?: string;
    harvestingTips?: string;
    storageGuidance?: string;
    growingGuide?: {
        title: string;
        sections: IGrowingGuideSection[];
    };

    // Metadata & SEO
    availability: boolean;
    featured: boolean;
    pageViews?: number;
    seoMetadata?: {
        title?: string;
        description?: string;
        keywords?: string[];
    };

    createdAt: Date;
    updatedAt: Date;
}

const productSchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, index: true },
        description: { type: String, default: '' },
        longDescription: { type: String },
        category: { type: String, required: true, index: true },
        cropName: { type: String, index: true }, // For 'Wheat', 'Cotton' etc from Excel

        // Attributes
        seedColor: { type: String },
        morphologicalCharacters: { type: String },
        flowerColor: { type: String },
        fruitShape: { type: String },
        plantHeight: { type: String },

        // Farming
        seasonality: [{ type: String }],
        maturityTime: { type: String },
        yieldExpectation: { type: String },
        difficultyLevel: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced'],
            default: 'Intermediate'
        },
        varietyType: { type: String },
        sowingTime: { type: String },
        harvestTime: { type: String },
        soilType: { type: String },
        waterRequirement: { type: String },

        // Images
        images: [{
            url: { type: String, required: true },
            altText: String,
            isPrimary: { type: Boolean, default: false }
        }],

        // Guides
        plantingInstructions: String,
        careInstructions: String,
        harvestingTips: String,
        storageGuidance: String,
        growingGuide: {
            title: String,
            sections: [{
                title: String,
                content: String
            }]
        },

        // Status & Meta
        availability: { type: Boolean, default: true },
        featured: { type: Boolean, default: false },
        pageViews: { type: Number, default: 0 },
        seoMetadata: {
            title: String,
            description: String,
            keywords: [String]
        }
    },
    {
        timestamps: true,
    }
);

import slugify from 'slugify';

// Add text index for search functionality
productSchema.index({ name: 'text', description: 'text', cropName: 'text', morphologicalCharacters: 'text' });

productSchema.pre('validate', function (next: any) {
    if (this.name && (!this.slug || this.isModified('name'))) {
        this.slug = (slugify as any)(this.name, { lower: true, strict: true });
    }
    if (next) next();
});

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;
