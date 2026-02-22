'use client';

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
import { Loader2, AlertCircle } from 'lucide-react';
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

    const { data: contacts = [], isLoading, isError, error } = useQuery<Contact[]>({
        queryKey: ['contacts'],
        queryFn: async () => {
            const res = await fetch(`${getApiUrl()}/contact`, {
                credentials: 'include',
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch messages');
            }
            return res.json();
        },
    });

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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-8 rounded-lg text-center max-w-2xl mx-auto mt-10">
                <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h2 className="text-xl text-red-800 dark:text-red-400 font-bold mb-2">Connection Error</h2>
                <p className="text-red-600 dark:text-red-300 mb-6">{(error as Error).message}</p>
                <button
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['contacts'] })}
                    className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition font-semibold"
                >
                    Try Reconnecting
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-gray-900/50">
                            <TableHead className="w-[150px]">Date</TableHead>
                            <TableHead className="w-[200px]">Sender</TableHead>
                            <TableHead className="w-[150px]">Subject</TableHead>
                            <TableHead className="w-[120px]">Category</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contacts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-64 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <div className="text-lg font-medium">No messages found</div>
                                        <div className="text-sm">When customers contact you, they will appear here.</div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            contacts.map((contact) => (
                                <TableRow
                                    key={contact._id}
                                    className={`group hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors ${!contact.isRead ? 'bg-green-50/30 dark:bg-green-900/10 font-medium' : 'opacity-80'
                                        }`}
                                >
                                    <TableCell className="whitespace-nowrap tabular-nums">
                                        {format(new Date(contact.createdAt), 'MMM d, yyyy')}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 dark:text-white">{contact.name}</span>
                                            <span className="text-xs text-gray-500">{contact.email}</span>
                                            {contact.phone && <span className="text-xs text-gray-400">{contact.phone}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="truncate max-w-[150px]" title={contact.subject}>
                                        {contact.subject}
                                    </TableCell>
                                    <TableCell>
                                        <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-[10px] uppercase tracking-wider font-bold text-gray-600 dark:text-gray-400">
                                            {contact.category.replace('-', ' ')}
                                        </span>
                                    </TableCell>
                                    <TableCell className="max-w-md">
                                        <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300" title={contact.message}>
                                            {contact.message}
                                        </p>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <button
                                            onClick={() => toggleReadMutation.mutate(contact._id)}
                                            className={`px-4 py-1.5 rounded-lg text-xs transition-all ${contact.isRead
                                                    ? 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                                                    : 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                                                }`}
                                        >
                                            {contact.isRead ? 'Archived' : 'Mark Read'}
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
