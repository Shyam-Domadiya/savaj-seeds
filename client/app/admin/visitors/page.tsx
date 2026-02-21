'use client';

import { useState, useEffect } from 'react';
import { getApiUrl } from '@/lib/api-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Smartphone, Monitor } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Visitor {
    _id: string;
    ipAddress: string;
    userAgent: string;
    visitedAt: string;
    readableDateStr?: string;
    readableTimeStr?: string;
    totalVisits: number;
}

export default function VisitorsPage() {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVisitors = async () => {
            try {
                const res = await fetch(`${getApiUrl()}/visitors`, { cache: 'no-store' });
                if (!res.ok) {
                    throw new Error('Failed to fetch visitor logs');
                }
                const data = await res.json();
                setVisitors(data);
            } catch (err: any) {
                setError(err.message || 'Something went wrong');
            } finally {
                setIsLoading(false);
            }
        };

        fetchVisitors();
    }, []);

    const getDeviceIcon = (userAgent: string) => {
        const ua = userAgent.toLowerCase();
        if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
            return <Smartphone className="w-4 h-4 text-gray-500" />;
        }
        return <Monitor className="w-4 h-4 text-gray-500" />;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Visitor Logs</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Total Tracked Visitors ({visitors.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead>Visits</TableHead>
                                    <TableHead>Last Visit Date</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Device/Browser</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {visitors.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24 text-gray-500">
                                            No visitors logged yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    visitors.map((visitor) => (
                                        <TableRow key={visitor._id}>
                                            <TableCell className="font-medium">{visitor.ipAddress}</TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-green-100 bg-green-600 rounded-full">
                                                    {visitor.totalVisits}
                                                </span>
                                            </TableCell>
                                            <TableCell>{visitor.readableDateStr || new Date(visitor.visitedAt).toLocaleDateString()}</TableCell>
                                            <TableCell>{visitor.readableTimeStr || new Date(visitor.visitedAt).toLocaleTimeString()}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 max-w-[200px] truncate" title={visitor.userAgent}>
                                                    {getDeviceIcon(visitor.userAgent)}
                                                    <span className="truncate text-xs text-gray-500">{visitor.userAgent}</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
