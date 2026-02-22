export const getApiUrl = () => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    const fallbackUrl = 'https://savaj-seeds-server.onrender.com/api';

    // If envUrl is missing or accidentally set to the frontend itself, use fallback
    if (!envUrl || envUrl.includes('vercel.app') || envUrl.includes('localhost:3000')) {
        return fallbackUrl;
    }

    const cleanUrl = envUrl.replace(/\/$/, '');

    if (cleanUrl.endsWith('/api')) {
        return cleanUrl;
    }

    return `${cleanUrl}/api`;
};
