'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (user.role !== 'admin') {
                router.push('/user'); // Redirect non-admins to user dashboard
            }
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== 'admin') {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4 text-red-600">Admin Dashboard</h1>
            <p className="mb-4">Welcome, Admin {user.name}!</p>
            <div className="bg-white p-6 rounded shadow mb-4">
                <p>This page is restricted to admins only.</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>
            <Button onClick={logout} variant="destructive">Logout</Button>
        </div>
    );
}
