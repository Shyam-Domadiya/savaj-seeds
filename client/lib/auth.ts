export interface IAdmin {
    _id: string;
    email: string;
    // token is intentionally not stored here — it lives in an HttpOnly cookie
}

export const getAdminUser = (): IAdmin | null => {
    if (typeof window !== 'undefined') {
        const adminStr = localStorage.getItem('adminUser');
        if (adminStr) {
            return JSON.parse(adminStr);
        }
    }
    return null;
};

export const setAdminUser = (admin: IAdmin) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('adminUser', JSON.stringify(admin));
    }
};

export const removeAdminUser = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('adminUser');
    }
};

// No longer sends Authorization header — auth is via HttpOnly cookie
// Use `credentials: 'include'` in all authenticated fetch calls instead
export const getAuthHeader = (): Record<string, string> => {
    return {};
};
