import { Product, ProductCategory, Season, DifficultyLevel } from '@/lib/types/product';
import { v4 as uuidv4 } from 'uuid';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

// Helper to map Excel season to App Season
function mapSeason(season: string): Season[] {
    if (!season) return ['All-Season'];
    const s = season.toLowerCase();
    const seasons: Season[] = [];

    if (s.includes('kharif') || s.includes('monsoon')) seasons.push('Monsoon');
    if (s.includes('rabi') || s.includes('winter')) seasons.push('Winter');
    if (s.includes('summer')) seasons.push('Summer');
    if (s.includes('all season') || s.includes('all-season')) seasons.push('All-Season');

    // Default fallback
    if (seasons.length === 0) seasons.push('All-Season');

    return seasons;
}

export async function getAllProducts(): Promise<Product[]> {
    try {
        // Construct path to the Excel file
        // As per user request, we are reading from the file on disk dynamically.
        // Assuming client is at .../savaj-seed/client and Excel is at .../savaj-seed/Savaj Seed Product.xlsx
        const excelPath = path.join(process.cwd(), '../Savaj Seed Product.xlsx');

        if (!fs.existsSync(excelPath)) {
            console.error('Excel file not found at:', excelPath);
            return [];
        }

        // Read file buffer first to avoid direct file access issues
        const fileBuffer = fs.readFileSync(excelPath);
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        let productsData = XLSX.utils.sheet_to_json(sheet);

        // Filter out empty rows or rows missing key data
        productsData = productsData.filter((item: any) => item['Product Name'] && item['Product Name'].toString().trim() !== '');

        // Map JSON data to Product Interface
        const mappedProducts: Product[] = productsData.map((item: any) => {
            // Determine category
            // Determine category based on 'Crop Name'
            let category: ProductCategory = 'Other';
            const cropName = (item['Crop Name'] || '').toLowerCase().trim();
            const productName = (item['Product Name'] || '').toLowerCase(); // For vegetable detection

            if (cropName.includes('cotton')) category = 'Cotton';
            else if (cropName.includes('wheat')) category = 'Wheat';
            else if (cropName.includes('groundnut')) category = 'Groundnut'; // Covers 'ground nut'
            else if (cropName.includes('cumin')) category = 'Cumin';
            else if (cropName.includes('sesa')) category = 'Sesame'; // Covers 'sesame', 'sesasum'
            else if (cropName.includes('castor')) category = 'Castor';
            else if (cropName.includes('maize')) category = 'Maize';
            else if (cropName.includes('gram')) category = 'Gram';
            else if (cropName.includes('pigeon')) category = 'Pigeon Pea'; // Maps 'Pigeon' to 'Pigeon Pea'
            else if (cropName.includes('millet') || cropName.includes('bajra')) category = 'Millet';
            else if (cropName.includes('cori')) category = 'Coriander'; // Covers 'coriander', 'coriender'
            else if (
                productName.includes('okra') ||
                productName.includes('bottle') ||
                productName.includes('bitter') ||
                productName.includes('sponge') ||
                productName.includes('ridge') ||
                productName.includes('chilli') ||
                productName.includes('tomato') ||
                productName.includes('cucumber') ||
                productName.includes('bean')
            ) {
                category = 'Vegetable';
            }

            // Generate a stable ID from the name (slugify)
            const slug = item['Product Name'].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

            // Helper to safely get value ignoring case/spaces
            const getValue = (keyPart: string) => {
                const key = Object.keys(item).find(k => k.toLowerCase().includes(keyPart.toLowerCase()));
                return key ? item[key] : '';
            };

            const seedColor = getValue('seed color') || getValue('fruit color');
            const flowerColor = getValue('flower color');
            const height = getValue('height');
            const fruitShape = getValue('fruit shape');

            const maturity = getValue('maturity days') || getValue('maturity') || 'Medium';
            const yieldVal = getValue('yield') || 'High';

            return {
                id: slug, // Stable ID
                name: item['Product Name'],
                category: category,
                subcategory: 'General',
                description: item['Morphological Characters'] || '',
                longDescription: `${item['Product Name']} is a premium quality seed. \n\nMorphological Characters: ${item['Morphological Characters']}\nSeed/Fruit Color: ${seedColor}`,
                images: [],
                specifications: [
                    { id: '1', name: 'Seed/Fruit Color', value: seedColor, category: 'Basic' },
                    ...(flowerColor ? [{ id: '3', name: 'Flower Color', value: flowerColor, category: 'Basic' }] : []),
                    ...(height ? [{ id: '4', name: 'Plant Height', value: height, category: 'Growing' }] : []),
                    ...(fruitShape ? [{ id: '5', name: 'Fruit Shape', value: fruitShape, category: 'Harvest' }] : [])
                ] as any, // Cast to any to avoid strict union type errors for now
                growingGuide: { id: '1', title: 'General Guide', pdfUrl: '', sections: [] },
                downloadableResources: [],
                seasonality: mapSeason(item['Season']),
                difficultyLevel: 'Intermediate',
                yieldExpectation: yieldVal,
                maturityTime: maturity,
                plantingInstructions: 'Sow as per season guidelines.',
                careInstructions: 'Regular irrigation required.',
                harvestingTips: 'Harvest when mature.',
                storageGuidance: 'Store in cool dry place.',
                certifications: [],
                availability: true,
                featured: false,
                seoMetadata: {
                    title: item['Product Name'],
                    description: item['Morphological Characters'] || '',
                    keywords: [item['Product Name'], category],
                    ogTitle: item['Product Name'],
                    ogDescription: item['Morphological Characters'] || '',
                    ogImage: '',
                    structuredData: {}
                },
                createdAt: new Date(),
                updatedAt: new Date(),

                // Custom fields
                seedColor: seedColor,
                morphologicalCharacters: item['Morphological Characters'],
                cropName: item['Crop Name']?.trim() || 'Other' // Allow original crop name
            };
        });

        return mappedProducts;

    } catch (error) {
        console.error('Error reading Excel file:', error);
        return [];
    }
}

export async function getProductById(id: string): Promise<Product | null> {
    const products = await getAllProducts();
    return products.find(p => p.id === id) || null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
    const products = await getAllProducts();
    return products.slice(0, 4);
}

export async function getUniqueCropCategories(): Promise<string[]> {
    const products = await getAllProducts();
    // Return unique raw 'cropName's from Excel
    const categories = new Set(products.map(p => p.cropName || 'Other'));
    return Array.from(categories).filter(c => c && c !== 'Other').sort();
}
