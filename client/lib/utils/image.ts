
/**
 * Validates and sanitizes image URLs for products.
 * Returns null if the image is a known placeholder or invalid.
 */
export function sanitizeImageUrl(url: string | undefined | null): string | null {
    if (!url) return null;

    // Known invalid/placeholder images that cause 404s in production
    const invalidPatterns = [
        'sample.jpg',
        'placeholder.jpg',
        'test.png'
    ];

    if (invalidPatterns.some(pattern => url.toLowerCase().includes(pattern))) {
        return null;
    }

    // Ensure URL is valid (starts with / or http)
    if (!url.startsWith('/') && !url.startsWith('http')) {
        return null;
    }

    return url;
}
