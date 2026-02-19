'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getAdminUser, removeAdminUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    Package,
    MessageSquare,
    LogOut,
    Menu,
} from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const admin = getAdminUser();
        if (!admin && pathname !== '/admin/login') {
            router.push('/admin/login');
        } else {
            setIsAuthenticated(true);
        }
    }, [router, pathname]);

    const handleLogout = () => {
        removeAdminUser();
        router.push('/admin/login');
    };

    if (!isAuthenticated && pathname !== '/admin/login') {
        return null; // Or a loading spinner
    }

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Messages', href: '/admin/contacts', icon: MessageSquare },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:relative lg:translate-x-0`}
            >
                <div className="flex items-center justify-between h-16 px-6 border-b dark:border-gray-700">
                    <span className="text-xl font-bold text-green-600">Savaj Admin</span>
                    <button
                        className="lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                    ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t dark:border-gray-700">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 shadow-sm lg:hidden">
                    <button onClick={() => setIsSidebarOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="text-lg font-semibold">Admin Panel</span>
                </header>
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
