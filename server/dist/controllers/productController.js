"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = exports.createProduct = exports.deleteProduct = exports.getProductById = exports.getProducts = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Product_1 = __importDefault(require("../models/Product"));
const slugify_1 = __importDefault(require("slugify"));
// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
exports.getProducts = (0, express_async_handler_1.default)(async (req, res) => {
    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};
    const category = req.query.category
        ? { category: req.query.category }
        : {};
    // Combine filters
    const filter = { ...keyword, ...category };
    // If 'featured' param is present
    if (req.query.featured) {
        Object.assign(filter, { featured: true });
    }
    const products = await Product_1.default.find(filter);
    res.json(products);
});
// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = (0, express_async_handler_1.default)(async (req, res) => {
    const id = req.params.id;
    // Search by slug (preferred) or ID
    const product = await Product_1.default.findOne({
        $or: [
            { slug: id },
            // Only check _id if it's a valid ObjectId to avoid cast errors
            ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])
        ]
    });
    if (product) {
        res.json(product);
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }
});
// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = (0, express_async_handler_1.default)(async (req, res) => {
    const product = await Product_1.default.findById(req.params.id);
    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }
});
// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = (0, express_async_handler_1.default)(async (req, res) => {
    const product = new Product_1.default({
        name: 'Sample Name',
        slug: 'sample-name-' + Date.now(),
        category: 'Vegetable Seeds',
        images: [{ url: '/images/sample.jpg', altText: 'Sample Image', isPrimary: true }],
        description: 'Sample description',
        seasonality: ['Rabi'],
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});
// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const { name, slug, description, longDescription, category, cropName, seedColor, morphologicalCharacters, flowerColor, fruitShape, plantHeight, seasonality, maturityTime, yieldExpectation, difficultyLevel, images, plantingInstructions, careInstructions, harvestingTips, storageGuidance, growingGuide, availability, featured, seoMetadata } = req.body;
        const product = await Product_1.default.findById(req.params.id);
        if (product) {
            product.name = name || product.name;
            product.slug = slug ? (0, slugify_1.default)(slug, { lower: true }) : product.slug;
            product.description = description || product.description;
            product.longDescription = longDescription || product.longDescription;
            product.category = category || product.category;
            product.cropName = cropName || product.cropName;
            // Attributes
            product.seedColor = seedColor || product.seedColor;
            product.morphologicalCharacters = morphologicalCharacters || product.morphologicalCharacters;
            product.flowerColor = flowerColor || product.flowerColor;
            product.fruitShape = fruitShape || product.fruitShape;
            product.plantHeight = plantHeight || product.plantHeight;
            // Farming
            product.seasonality = seasonality || product.seasonality;
            product.maturityTime = maturityTime || product.maturityTime;
            product.yieldExpectation = yieldExpectation || product.yieldExpectation;
            product.difficultyLevel = difficultyLevel || product.difficultyLevel;
            // Images
            product.images = images || product.images;
            // Guides
            product.plantingInstructions = plantingInstructions || product.plantingInstructions;
            product.careInstructions = careInstructions || product.careInstructions;
            product.harvestingTips = harvestingTips || product.harvestingTips;
            product.storageGuidance = storageGuidance || product.storageGuidance;
            product.growingGuide = growingGuide || product.growingGuide;
            // Status & Meta
            product.availability = availability !== undefined ? availability : product.availability;
            product.featured = featured !== undefined ? featured : product.featured;
            product.seoMetadata = seoMetadata || product.seoMetadata;
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        }
        else {
            res.status(404);
            throw new Error('Product not found');
        }
    }
    catch (error) {
        console.error('Update Product Error:', error);
        if (error.code === 11000) {
            res.status(400);
            throw new Error('Product with this slug already exists');
        }
        if (error.name === 'ValidationError') {
            res.status(400);
            throw new Error(Object.values(error.errors).map((val) => val.message).join(', '));
        }
        throw error;
    }
});
