'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function UserDashboard() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
            <p className="mb-4">Welcome, {user.name}!</p>
            <div className="bg-white p-6 rounded shadow mb-4">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>ID:</strong> {user._id}</p>
            </div>
            <Button onClick={logout} variant="destructive">Logout</Button>
        </div>
    );
}
