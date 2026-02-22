export const getApiUrl = () => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    const fallbackUrl = 'https://savaj-seeds-server.onrender.com/api';

    if (!envUrl) return fallbackUrl;

    const cleanUrl = envUrl.replace(/\/$/, '');

    if (cleanUrl.endsWith('/api')) {
        return cleanUrl;
    }

    return `${cleanUrl}/api`;
};
