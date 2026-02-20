'use client';

import { useState, useEffect } from 'react';
import { getApiUrl } from '@/lib/api-config';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { getAuthHeader } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';

interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    longDescription?: string;
    category: string;
    cropName?: string;
    seedColor?: string;
    morphologicalCharacters?: string;
    flowerColor?: string;
    fruitShape?: string;
    plantHeight?: string;
    seasonality: string[];
    maturityTime?: string;
    yieldExpectation?: string;
    difficultyLevel?: string;
    images: { url: string; altText: string; isPrimary: boolean }[];
    plantingInstructions?: string;
    careInstructions?: string;
    harvestingTips?: string;
    storageGuidance?: string;
    availability: boolean;
    featured: boolean;
}

export default function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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



    // Fetch Product
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${getApiUrl()}/products/${id}`);
                if (!res.ok) throw new Error('Product not found');
                const data = await res.json();
                setProduct(data);
            } catch (error: any) {
                toast({
                    title: 'Error',
                    description: error.message,
                    variant: 'destructive',
                });
                router.push('/admin/products');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id, router, toast]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://savaj-seeds-server.onrender.com/api'}/products/${product._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
                body: JSON.stringify(cleanedProduct),
            });

            if (res.ok) {
                toast({
                    title: 'Success',
                    description: 'Product updated',
                });
                router.push('/admin/products');
            } else {
                throw new Error('Update failed');
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

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div className="flex items-center space-x-4">
                <Link href="/admin/products">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Edit Product</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">

                {/* Basic Info */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Basic Info</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input name="name" value={product.name} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Slug</Label>
                            <Input name="slug" value={product.slug} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Input name="category" value={product.category} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Difficulty</Label>
                            <Select value={product.difficultyLevel} onValueChange={(val) => handleSelectChange('difficultyLevel', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Short Description</Label>
                        <Input name="description" value={product.description} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label>Long Description</Label>
                        <Textarea name="longDescription" value={product.longDescription || ''} onChange={handleChange} rows={5} />
                    </div>
                </div>

                {/* Attributes */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Attributes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Crop Name</Label>
                            <Input name="cropName" value={product.cropName || ''} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Seed Color</Label>
                            <Input name="seedColor" value={product.seedColor || ''} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Maturity Time</Label>
                            <Input name="maturityTime" value={product.maturityTime || ''} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Yield Expectation</Label>
                            <Input name="yieldExpectation" value={product.yieldExpectation || ''} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-xl font-semibold">Images</h2>
                        <Button type="button" onClick={addImage} variant="outline" size="sm"><Plus className="w-4 h-4 mr-2" /> Add Image</Button>
                    </div>
                    {product.images.map((img, index) => (
                        <div key={index} className="flex space-x-2 items-end">
                            <div className="flex-1 space-y-2">
                                <Label>URL</Label>
                                <Input value={img.url} onChange={(e) => handleImageChange(index, 'url', e.target.value)} />
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label>Alt Text</Label>
                                <Input value={img.altText} onChange={(e) => handleImageChange(index, 'altText', e.target.value)} />
                            </div>
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeImage(index)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Guides */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Guides</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label>Planting Instructions</Label>
                            <Textarea name="plantingInstructions" value={product.plantingInstructions || ''} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Care Instructions</Label>
                            <Textarea name="careInstructions" value={product.careInstructions || ''} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={saving}>
                        {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
