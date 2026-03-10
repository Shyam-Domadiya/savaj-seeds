'use client';

import { useState, useEffect } from 'react';
import { getApiUrl } from '@/lib/api-config';
import { getAuthHeader } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { use } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Plus, X, Upload, ImageIcon } from 'lucide-react';
import Link from 'next/link';

interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    cropName?: string;
    seedColor?: string;
    varietyType?: string;
    seasonality: string[];
    maturityTime?: string;
    sowingTime?: string;
    harvestTime?: string;
    yieldExpectation?: string;
    soilType?: string;
    waterRequirement?: string;
    images: { url: string; altText: string; isPrimary: boolean }[];
    availability: boolean;
    featured: boolean;
}

export default function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { toast } = useToast();
    const [saving, setSaving] = useState(false);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

    // Initial State
    const [product, setProduct] = useState<Product>({
        _id: '',
        name: '',
        slug: '',
        description: '',
        category: '',
        seasonality: [],
        images: [],
        availability: true,
        featured: false,
    });





    const { data: fetchedProduct, isLoading: isQueryLoading, error: queryError } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const res = await fetch(`${getApiUrl()}/products/${id}`);
            if (!res.ok) throw new Error('Product not found');
            return res.json();
        },
        enabled: !!id && id !== 'new',
    });

    useEffect(() => {
        if (fetchedProduct) {
            setProduct(fetchedProduct);
        }
    }, [fetchedProduct]);

    useEffect(() => {
        if (queryError) {
            toast({
                title: 'Error',
                description: (queryError as Error).message,
                variant: 'destructive',
            });
            router.push('/shreenath/products');
        }
    }, [queryError, router, toast]);

    const isLoading = id !== 'new' && isQueryLoading;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };


    const handleImageChange = (index: number, field: string, value: string | boolean) => {
        const newImages = [...product.images];
        newImages[index] = { ...newImages[index], [field]: value };
        setProduct((prev) => ({ ...prev, images: newImages }));
    };

    const addImage = () => {
        setProduct((prev) => ({
            ...prev,
            images: [...prev.images, { url: '', altText: '', isPrimary: false }],
        }));
    };

    const removeImage = (index: number) => {
        const newImages = product.images.filter((_, i) => i !== index);
        setProduct((prev) => ({ ...prev, images: newImages }));
    };

    const handleFileUpload = async (files: FileList | File[], indexToUpdate: number) => {
        setUploadingIndex(indexToUpdate); // Indicate upload started for this specific image
        try {
            const file = files[0]; // Take the first file
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch(`${getApiUrl()}/upload`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Upload failed');
            }
            const data = await res.json();

            // Update the specific image at the given index instead of appending
            setProduct((prev) => {
                const newImages = [...prev.images];
                newImages[indexToUpdate] = {
                    ...newImages[indexToUpdate],
                    url: data.url,
                    isPrimary: prev.images.length === 1 // If it's the only image, make it primary
                };
                return { ...prev, images: newImages };
            });

        } catch (err: any) {
            toast({ title: 'Upload Error', description: err.message, variant: 'destructive' });
        } finally {
            setUploadingIndex(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        console.log('Updating product with ID:', product._id); // Debug log

        // Clean payload
        const cleanedProduct = {
            ...product,
            images: product.images.filter(img => img.url.trim() !== '')
        };

        try {
            const isNew = id === 'new';
            const url = isNew
                ? `${getApiUrl()}/products`
                : `${getApiUrl()}/products/${product._id}`;

            const method = isNew ? 'POST' : 'PUT';

            console.log(`${method}ing product to:`, url);

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
                credentials: 'include',
                body: JSON.stringify(cleanedProduct),
            });

            if (res.ok) {
                toast({
                    title: 'Success',
                    description: isNew ? 'Product created' : 'Product updated',
                });
                router.push('/shreenath/products');
            } else {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || `Save failed (${res.status})`);
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    if (id !== 'new' && isQueryLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div className="flex items-center space-x-4">
                <Link href="/shreenath/products">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">{id === 'new' ? 'Create Product' : 'Edit Product'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">

                {/* Product Name */}
                <div className="space-y-2">
                    <Label>Product Name <span className="text-red-500">*</span></Label>
                    <Input
                        name="name"
                        value={product.name}
                        onChange={(e) => {
                            const val = e.target.value;
                            setProduct((prev) => ({
                                ...prev,
                                name: val,
                                // auto-generate slug from name
                                slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                            }));
                        }}
                        placeholder="e.g. Savaj Premium Cotton"
                        required
                    />
                </div>

                {/* Crop Name */}
                <div className="space-y-2">
                    <Label>Crop Name</Label>
                    <Input name="cropName" value={product.cropName || ''} onChange={handleChange} placeholder="e.g. Maize, Cotton, Wheat" />
                </div>

                {/* Seed Color */}
                <div className="space-y-2">
                    <Label>Seed Color</Label>
                    <Input name="seedColor" value={product.seedColor || ''} onChange={handleChange} placeholder="e.g. Yellow, White, Brown" />
                </div>

                {/* Variety Type */}
                <div className="space-y-2">
                    <Label>Variety Type</Label>
                    <Input name="varietyType" value={product.varietyType || ''} onChange={handleChange} placeholder="e.g. Hybrid, Open Pollinated" />
                </div>

                {/* Season */}
                <div className="space-y-2">
                    <Label>Season</Label>
                    <Input
                        name="seasonality"
                        value={product.seasonality?.join(', ') || ''}
                        onChange={(e) => setProduct(p => ({ ...p, seasonality: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                        placeholder="e.g. Kharif, Rabi"
                    />
                </div>

                {/* Two-column grid for text fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Maturity Time</Label>
                        <Input name="maturityTime" value={product.maturityTime || ''} onChange={handleChange} placeholder="e.g. 90–110 days" />
                    </div>
                    <div className="space-y-2">
                        <Label>Yield Expectation</Label>
                        <Input name="yieldExpectation" value={product.yieldExpectation || ''} onChange={handleChange} placeholder="e.g. 25–30 quintal/acre" />
                    </div>
                    <div className="space-y-2">
                        <Label>Sowing Time</Label>
                        <Input name="sowingTime" value={product.sowingTime || ''} onChange={handleChange} placeholder="e.g. June–July" />
                    </div>
                    <div className="space-y-2">
                        <Label>Harvest Time</Label>
                        <Input name="harvestTime" value={product.harvestTime || ''} onChange={handleChange} placeholder="e.g. October–November" />
                    </div>
                </div>

                {/* Suitable Soil Type */}
                <div className="space-y-2">
                    <Label>Suitable Soil Type</Label>
                    <Input name="soilType" value={product.soilType || ''} onChange={handleChange} placeholder="e.g. Black Soil, Loamy" />
                </div>

                {/* Water Requirement */}
                <div className="space-y-2">
                    <Label>Water Requirement</Label>
                    <Input name="waterRequirement" value={product.waterRequirement || ''} onChange={handleChange} placeholder="e.g. Low, Medium, High" />
                </div>

                {/* Short Description */}
                <div className="space-y-2">
                    <Label>Short Description</Label>
                    <Input name="description" value={product.description} onChange={handleChange} placeholder="Brief description of the product" />
                </div>

                {/* Images */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-xl font-semibold">Images</h2>
                        <Button type="button" onClick={addImage} variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" /> Add Image
                        </Button>
                    </div>

                    {product.images.length === 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">No images yet. Click &quot;Add Image&quot; to upload one.</p>
                    )}

                    {product.images.map((img, index) => (
                        <div key={index} className="rounded-lg border dark:border-gray-600 p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Image {index + 1}</span>
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeImage(index)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Image preview */}
                            {img.url && (
                                <div className="w-full flex justify-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <div className="relative h-40 w-full">
                                        <Image
                                            src={img.url}
                                            alt={img.altText || 'Preview'}
                                            fill
                                            className="object-contain rounded-md border dark:border-gray-600"
                                            sizes="(max-width: 768px) 100vw, 400px"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* File upload button */}
                            <div className="space-y-1">
                                <Label className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Upload from PC</Label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const files = e.target.files;
                                            if (files && files.length > 0) {
                                                handleFileUpload(files, index);
                                            }
                                        }}
                                    />
                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-dashed border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                                        {uploadingIndex === index ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                                        ) : (
                                            <><Upload className="w-4 h-4" /> Choose Image File</>
                                        )}
                                    </span>
                                </label>
                            </div>


                            {/* Alt text */}
                            <div className="space-y-1">
                                <Label>Alt Text</Label>
                                <Input
                                    placeholder="Describe the image (for accessibility & SEO)"
                                    value={img.altText}
                                    onChange={(e) => handleImageChange(index, 'altText', e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={saving}>
                        {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

