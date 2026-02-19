export interface IAdmin {
    _id: string;
    email: string;
    token: string;
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

export const getAuthHeader = (): Record<string, string> => {
    const admin = getAdminUser();
    if (admin && admin.token) {
        return { Authorization: `Bearer ${admin.token}` };
    }
    return {};
};
