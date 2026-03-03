export interface IAdmin {
    _id: string;
    email: string;
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
        localStorage.removeItem('adminToken');
    }
};

export const setAdminToken = (token: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('adminToken', token);
    }
};

export const getAdminToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('adminToken');
    }
    return null;
};

// Returns Authorization header for all protected admin API calls
export const getAuthHeader = (): Record<string, string> => {
    const token = getAdminToken();
    if (token) {
        return { Authorization: `Bearer ${token}` };
    }
    return {};
};
