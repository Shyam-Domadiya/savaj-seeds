'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
    login: (userData: any) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Check if user is logged in (Only if token exists)
    useEffect(() => {
        const checkUserLoggedIn = async () => {
            if (typeof window === 'undefined') return;

            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const { data } = await api.get('/users/profile');
                setUser(data);
            } catch (err) {

                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkUserLoggedIn();
    }, []);

    const login = async (userData: any) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/auth/login', userData);
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            setUser(data);
            router.push('/user'); // Redirect to dashboard
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: any) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/auth/register', userData);
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            setUser(data);
            router.push('/user'); // Redirect to dashboard
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            localStorage.removeItem('token');
            setUser(null);
            router.push('/login');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
