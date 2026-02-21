'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
    isRead?: boolean;
    createdAt: string;
}

export default function AdminContacts() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

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

    const toggleReadMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`${getApiUrl()}/contact/${id}/read`, {
                method: 'PUT',
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to update message status');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    const handleToggleRead = (id: string) => {
        toggleReadMutation.mutate(id);
    };



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
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contacts.map((contact) => (
                            <TableRow key={contact._id} className={contact.isRead ? 'opacity-75' : 'bg-gray-50 dark:bg-gray-800/50'}>
                                <TableCell className={`whitespace-nowrap text-gray-500 ${!contact.isRead ? 'font-semibold text-gray-900 dark:text-white' : ''}`}>
                                    {format(new Date(contact.createdAt), 'MMM d, yyyy')}
                                </TableCell>
                                <TableCell className={`font-medium ${!contact.isRead ? 'text-gray-900 dark:text-white' : ''}`}>
                                    <div>{contact.name}</div>
                                    <div className="text-xs text-gray-500">{contact.email}</div>
                                    {contact.phone && <div className="text-xs text-gray-500">{contact.phone}</div>}
                                </TableCell>
                                <TableCell className={!contact.isRead ? 'font-semibold text-gray-900 dark:text-white' : ''}>{contact.subject}</TableCell>
                                <TableCell>{contact.category}</TableCell>
                                <TableCell className="max-w-md truncate" title={contact.message}>
                                    {contact.message}
                                </TableCell>
                                <TableCell>
                                    <button
                                        onClick={() => handleToggleRead(contact._id)}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${contact.isRead
                                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300'
                                            }`}
                                    >
                                        {contact.isRead ? 'Read' : 'Mark as Read'}
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
