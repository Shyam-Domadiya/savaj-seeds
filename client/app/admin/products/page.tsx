'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuthHeader } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    countInStock: number;
}

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products`);
            if (!res.ok) throw new Error('Failed to fetch products');
            const data = await res.json();
            setProducts(data);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const deleteHandler = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products/${id}`, {
                    method: 'DELETE',
                    headers: {
                        ...getAuthHeader(),
                    },
                });

                if (res.ok) {
                    toast({
                        title: 'Success',
                        description: 'Product deleted successfully',
                    });
                    setProducts(products.filter((product) => product._id !== id));
                } else {
                    const data = await res.json();
                    throw new Error(data.message || 'Delete failed');
                }
            } catch (error: any) {
                toast({
                    title: 'Error',
                    description: error.message,
                    variant: 'destructive',
                });
            }
        }
    };

    const createProductHandler = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/admin/products/${data.slug || data._id}`); // Redirect to edit page
                toast({
                    title: 'Success',
                    description: 'Product created successfully',
                });
            } else {
                const data = await res.json();
                throw new Error(data.message || 'Create failed');
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
                <Button onClick={createProductHandler} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Product
                </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product._id}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Link href={`/admin/products/${product._id}`}>
                                        <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <Edit className="w-4 h-4 text-blue-600" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="hover:bg-red-50 dark:hover:bg-red-900/20"
                                        onClick={() => deleteHandler(product._id)}
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
