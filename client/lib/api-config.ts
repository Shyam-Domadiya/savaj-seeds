
export const getApiUrl = () => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    // Default fallback
    const fallbackUrl = 'https://savaj-seeds-server.onrender.com/api';

    if (!envUrl) return fallbackUrl;

    // If env var is set, ensure it ends with /api
    // Remove trailing slash if present
    const cleanUrl = envUrl.replace(/\/$/, '');

    if (cleanUrl.endsWith('/api')) {
        return cleanUrl;
    }

    return `${cleanUrl}/api`;
};
