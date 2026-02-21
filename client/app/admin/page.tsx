'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Package, MessageSquare, Users } from 'lucide-react';
import { getApiUrl } from '@/lib/api-config';

export default function AdminDashboard() {
    const [visitorCount, setVisitorCount] = useState<number | null>(null);

    useEffect(() => {
        const fetchVisitors = async () => {
            try {
                const res = await fetch(`${getApiUrl()}/visitors`);
                if (res.ok) {
                    const data = await res.json();
                    setVisitorCount(data.length);
                }
            } catch (err) {
                console.error("Failed to fetch visitors:", err);
            }
        }
        fetchVisitors();
    }, []);
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/admin/products" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                            <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Products</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Manage seeds and categories</p>
                        </div>
                    </div>
                </Link>

                <Link href="/admin/contacts" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                            <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Messages</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">View customer inquiries</p>
                        </div>
                    </div>
                </Link>

                {/* Visitor Management */}
                <div className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Total Visitors</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {visitorCount !== null ? `${visitorCount} unique IPs` : 'Loading...'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Activity</h2>
                <p className="text-gray-500 dark:text-gray-400">No recent activity to show.</p>
            </div>
        </div>
    );
}
