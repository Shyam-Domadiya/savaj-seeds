import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Product from '../models/Product';
import connectDB from '../config/db';

// Load .env from server root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const products = [
    {
        name: "Savaj Hybrid Tomato S-101",
        slug: "savaj-hybrid-tomato-s-101",
        description: "High-yielding hybrid tomato variety with excellent disease resistance.",
        longDescription: "Savaj Hybrid Tomato S-101 is a premium variety developed for Indian climatic conditions. It offers high yield potential, uniform fruit size, and excellent keeping quality. The fruits are deep red, firm, and ideal for long-distance transportation.",
        category: "vegetable",
        cropName: "Tomato",
        seedColor: "Brownish",
        morphologicalCharacters: "Determinate plant habit",
        flowerColor: "Yellow",
        fruitShape: "Round",
        plantHeight: "3-4 feet",
        seasonality: ["Kharif", "Rabi"],
        maturityTime: "60-65 days after transplanting",
        yieldExpectation: "25-30 tons/acre",
        difficultyLevel: "Intermediate",
        images: [
            {
                url: "/images/product-tomato.jpg",
                altText: "Savaj Hybrid Tomato S-101",
                isPrimary: true
            }
        ],
        availability: true,
        featured: true,
        seoMetadata: {
            title: "Savaj Hybrid Tomato S-101 Seeds",
            description: "Buy high-quality hybrid tomato seeds. Disease resistant and high yielding.",
            keywords: ["tomato seeds", "hybrid tomato", "vegetable seeds"]
        }
    },
    {
        name: "Savaj Premium Wheat W-45",
        slug: "savaj-premium-wheat-w-45",
        description: "Drought-tolerant wheat variety with superior grain quality.",
        longDescription: "W-45 is a research-backed wheat variety widely appreciated for its golden grains and high protein content. It is resistant to rust and suitable for late sowing conditions.",
        category: "crop",
        cropName: "Wheat",
        seedColor: "Golden",
        morphologicalCharacters: "Semi-dwarf",
        plantHeight: "90-100 cm",
        seasonality: ["Rabi"],
        maturityTime: "110-120 days",
        yieldExpectation: "20-22 quintals/acre",
        difficultyLevel: "Beginner",
        images: [
            {
                url: "/images/product-wheat.jpg",
                altText: "Savaj Premium Wheat W-45",
                isPrimary: true
            }
        ],
        availability: true,
        featured: true,
        seoMetadata: {
            title: "Savaj Premium Wheat Seeds",
            description: "Best wheat seeds for high yield. Drought tolerant.",
            keywords: ["wheat seeds", "rabi crop", "grain seeds"]
        }
    },
    {
        name: "Savaj Hybrid Cotton C-22",
        slug: "savaj-hybrid-cotton-c-22",
        description: "Bollworm-resistant hybrid cotton with long staple length.",
        longDescription: "C-22 is a BT cotton hybrid known for its large boll size and easy picking. It has a strong root system and performs well in both irrigated and rainfed conditions.",
        category: "hybrid",
        cropName: "Cotton",
        seedColor: "Black",
        morphologicalCharacters: "Bushy",
        flowerColor: "Cream",
        plantHeight: "4-5 feet",
        seasonality: ["Kharif"],
        maturityTime: "150-160 days",
        yieldExpectation: "10-12 quintals/acre",
        difficultyLevel: "Advanced",
        images: [
            {
                url: "/images/category-crop.jpg",
                altText: "Savaj Hybrid Cotton C-22",
                isPrimary: true
            }
        ],
        availability: true,
        featured: true,
        seoMetadata: {
            title: "Savaj Hybrid Cotton Seeds",
            description: "Top quality cotton seeds with pest resistance.",
            keywords: ["cotton seeds", "hybrid cotton", "kharif crop"]
        }
    },
    {
        name: "Savaj Okra Green Star",
        slug: "savaj-okra-green-star",
        description: "Dark green, tender okra pods with YVMV resistance.",
        longDescription: "Green Star is a vigorous okra variety that produces dark green, 5-ridged, tender fruits. It is highly tolerant to Yellow Vein Mosaic Virus (YVMV) and Enation Leaf Curl Virus (ELCV).",
        category: "vegetable",
        cropName: "Okra",
        seedColor: "Dark Grey",
        morphologicalCharacters: "Erect branding",
        flowerColor: "Yellow with red center",
        fruitShape: "Pentagonal",
        plantHeight: "4-5 feet",
        seasonality: ["Summer", "Kharif"],
        maturityTime: "45-50 days",
        yieldExpectation: "5-7 tons/acre",
        difficultyLevel: "Beginner",
        images: [
            {
                url: "/images/category-vegetable.jpg",
                altText: "Savaj Okra Green Star",
                isPrimary: true
            }
        ],
        availability: true,
        featured: false,
        seoMetadata: {
            title: "Savaj Okra Seeds",
            description: "Virus resistant okra seeds for home and farm.",
            keywords: ["okra seeds", "bhindi seeds", "vegetable seeds"]
        }
    },
    {
        name: "Savaj Cucumber Cool Green",
        slug: "savaj-cucumber-cool-green",
        description: "Crispy, bitter-free cucumber for fresh consumption.",
        longDescription: "Cool Green is a high-yielding variety suitable for salad purposes. Fruits are cylindrical, dark green, and uniform in size. Excellent for organic farming.",
        category: "vegetable",
        cropName: "Cucumber",
        seedColor: "White",
        morphologicalCharacters: "Vining",
        flowerColor: "Yellow",
        fruitShape: "Cylindrical",
        seasonality: ["Summer", "Kharif"],
        maturityTime: "35-40 days",
        yieldExpectation: "15-20 tons/acre",
        difficultyLevel: "Intermediate",
        images: [
            {
                url: "/images/product-pepper.jpg",
                altText: "Savaj Cucumber Cool Green",
                isPrimary: true
            }
        ],
        availability: true,
        featured: false,
        seoMetadata: {
            title: "Savaj Cucumber Seeds",
            description: "Crispy and fresh cucumber seeds.",
            keywords: ["cucumber seeds", "salad seeds", "vegetable seeds"]
        }
    },
    {
        name: "Savaj Hybrid Maize M-55",
        slug: "savaj-hybrid-maize-m-55",
        description: "High starch content hybrid maize for food and fodder.",
        longDescription: "M-55 is a dual-purpose hybrid suitable for grain and fodder. It has bold orange-yellow grains and stays green till harvest.",
        category: "crop",
        cropName: "Maize",
        seedColor: "Orange-Yellow",
        morphologicalCharacters: "Tall, erected leaves",
        plantHeight: "7-8 feet",
        seasonality: ["Kharif", "Rabi"],
        maturityTime: "95-100 days",
        yieldExpectation: "30-35 quintals/acre",
        difficultyLevel: "Intermediate",
        images: [
            {
                url: "/images/category-crop.jpg",
                altText: "Savaj Hybrid Maize M-55",
                isPrimary: true
            }
        ],
        availability: true,
        featured: true,
        seoMetadata: {
            title: "Savaj Maize Seeds",
            description: "Hybrid maize for high yield.",
            keywords: ["maize seeds", "corn seeds", "fodder seeds"]
        }
    }
];

const seedProducts = async () => {
    try {
        await connectDB();

        console.log('Clearing existing products...');
        await Product.deleteMany({});

        console.log('Inserting demo products...');
        await Product.insertMany(products);

        console.log('Products seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
