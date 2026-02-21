'use client';

import { getApiUrl } from '@/lib/api-config';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
    pageViews?: number;
}

export default function AdminProducts() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: products = [], isLoading } = useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await fetch(`${getApiUrl()}/products`);
            if (!res.ok) throw new Error('Failed to fetch products');
            return res.json();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`${getApiUrl()}/products/${id}`, {
                method: 'DELETE',
                credentials: 'include', // Auth via HttpOnly cookie
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Delete failed');
            }
            return res.json();
        },
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Product deleted successfully',
            });
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    const deleteHandler = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) {
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
                <Link href="/admin/products/new">
                    <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Product
                    </Button>
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Views</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product._id}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-100 bg-blue-600 rounded-full">
                                        {product.pageViews || 0}
                                    </span>
                                </TableCell>
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
