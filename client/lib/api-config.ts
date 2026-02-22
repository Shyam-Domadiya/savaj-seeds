export const getApiUrl = () => {
    // On the client, route through the Next.js proxy
    if (typeof window !== 'undefined') {
        return '/api';
    }

    // On the server, use the absolute URL
    const envUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_API_URL;
    const fallbackUrl = 'https://savaj-seeds-server.onrender.com';

    if (!envUrl) return `${fallbackUrl}/api`;

    const cleanUrl = envUrl.replace(/\/$/, '');

    if (cleanUrl.endsWith('/api')) {
        return cleanUrl;
    }

    return `${cleanUrl}/api`;
};
