'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getApiUrl } from '@/lib/api-config';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface Contact {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    category: string;
    subject: string;
    message: string;
    createdAt: string;
}

export default function AdminContacts() {
    const { data: contacts = [], isLoading } = useQuery<Contact[]>({
        queryKey: ['contacts'],
        queryFn: async () => {
            const res = await fetch(`${getApiUrl()}/contact`, {
                credentials: 'include', // Auth via HttpOnly cookie
            });
            if (!res.ok) throw new Error('Failed to fetch messages');
            return res.json();
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }



    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Message</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contacts.map((contact) => (
                            <TableRow key={contact._id}>
                                <TableCell className="whitespace-nowrap text-gray-500">
                                    {format(new Date(contact.createdAt), 'MMM d, yyyy')}
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div>{contact.name}</div>
                                    <div className="text-xs text-gray-500">{contact.email}</div>
                                    {contact.phone && <div className="text-xs text-gray-500">{contact.phone}</div>}
                                </TableCell>
                                <TableCell>{contact.subject}</TableCell>
                                <TableCell>{contact.category}</TableCell>
                                <TableCell className="max-w-md truncate" title={contact.message}>
                                    {contact.message}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
