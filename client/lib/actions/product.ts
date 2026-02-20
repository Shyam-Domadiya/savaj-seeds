import { Product } from '@/lib/types/product';
import { getApiUrl } from '@/lib/api-config';

const API_URL = getApiUrl();

const transformProduct = (p: any): Product => {
    const specifications: any[] = [];

    if (p.seedColor) specifications.push({ id: 'seedColor', name: 'Seed Color', value: p.seedColor, category: 'Basic' });
    if (p.morphologicalCharacters) specifications.push({ id: 'morph', name: 'Morphological Characters', value: p.morphologicalCharacters, category: 'Basic' });
    if (p.flowerColor) specifications.push({ id: 'flowerColor', name: 'Flower Color', value: p.flowerColor, category: 'Basic' });
    if (p.fruitShape) specifications.push({ id: 'fruitShape', name: 'Fruit Shape', value: p.fruitShape, category: 'Basic' });
    if (p.plantHeight) specifications.push({ id: 'plantHeight', name: 'Plant Height', value: p.plantHeight, category: 'Basic' });

    // Add other categories if needed, for instance from maturityTime or yieldExpectation if we want them as 'Growing' specs
    // But page.tsx uses them directly from product properties for the 'Cultivation Specs' card, so we might not need to duplicate them unless we want them in 'growingSpecs'.
    // However, page.tsx doesn't seem to use 'growingSpecs' currently.

    return {
        ...p,
        id: p.slug, // Use slug as the main ID for clean URLs
        mongoId: p._id, // Keep reference to real ID just in case
        specifications: specifications, // Add the constructed specifications
        images: p.images || [], // Ensure array
        seasonality: p.seasonality || [], // Ensure array
        seoMetadata: p.seoMetadata || { title: p.name, description: p.description, keywords: [] } // Ensure object
    };
};

export async function getAllProducts(): Promise<Product[]> {
    try {
        const res = await fetch(`${API_URL}/products`, {
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            throw new Error('Failed to fetch products');
        }

        const products = await res.json();

        // Map DB fields to Frontend Product Interface
        // Specifically map _id or slug to id for frontend routing
        return products.map(transformProduct);

    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

export async function getProductById(id: string): Promise<Product | null> {
    try {
        const res = await fetch(`${API_URL}/products/${id}`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            return null;
        }

        const product = await res.json();
        return transformProduct(product);

    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        return null;
    }
}

export async function getFeaturedProducts(): Promise<Product[]> {
    try {
        const res = await fetch(`${API_URL}/products?featured=true`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error('Failed to fetch featured products');
        }

        const products = await res.json();
        // Return only top 4 if API returns more, though filtering should happen on backend ideally
        return products.slice(0, 4).map(transformProduct);

    } catch (error) {
        console.warn('Error fetching featured products:', error);
        return [];
    }
}

export async function getUniqueCropCategories(): Promise<string[]> {
    // We can fetch all and extract, or make a specific API endpoint.
    // For now, fetching all is fine unless dataset is huge.
    const products = await getAllProducts();
    const categories = new Set(products.map(p => p.cropName || 'Other'));
    return Array.from(categories).filter(c => c && c !== 'Other').sort();
}
