'use client';

import { useQuery } from '@tanstack/react-query';
import { getApiUrl } from '@/lib/api-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Smartphone, Monitor, Download } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { VisitorCharts } from '@/components/admin/VisitorCharts';

interface Visitor {
    _id: string;
    ipAddress: string;
    userAgent: string;
    visitedAt: string;
    readableDateStr?: string;
    readableTimeStr?: string;
    os?: string;
    browser?: string;
    device?: string;
    totalVisits: number;
    totalTimeSpent?: number;
    country?: string;
    city?: string;
}

export default function VisitorsPage() {
    const { data: visitors, isLoading, error } = useQuery<Visitor[]>({
        queryKey: ['visitors'],
        queryFn: async () => {
            const res = await fetch(`${getApiUrl()}/visitors`, { cache: 'no-store' });
            if (!res.ok) {
                throw new Error('Failed to fetch visitor logs');
            }
            return res.json();
        },
        refetchInterval: 10000, // Refresh every 10 seconds to watch people browse
    });

    const getDeviceIcon = (deviceStr: string, userAgent: string) => {
        const d = (deviceStr || '').toLowerCase();
        const ua = (userAgent || '').toLowerCase();
        if (d.includes('mobile') || ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
            return <Smartphone className="w-4 h-4 text-gray-500 flex-shrink-0" />;
        }
        return <Monitor className="w-4 h-4 text-gray-500 flex-shrink-0" />;
    };

    const formatTimeSpent = (seconds?: number) => {
        if (!seconds) return '—';
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
    };

    const handleExportCSV = () => {
        if (!visitors || visitors.length === 0) return;

        const headers = ['IP Address', 'Country', 'City', 'Total Visits', 'Total Time Spent (s)', 'Date', 'Time', 'Device', 'Browser', 'OS'];
        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + visitors.map(v => {
                const row = [
                    v.ipAddress,
                    v.country || 'Unknown',
                    v.city || 'Unknown',
                    v.totalVisits.toString(),
                    (v.totalTimeSpent || 0).toString(),
                    v.readableDateStr || new Date(v.visitedAt).toLocaleDateString(),
                    v.readableTimeStr || new Date(v.visitedAt).toLocaleTimeString(),
                    v.device || 'Unknown',
                    v.browser || 'Unknown',
                    v.os || 'Unknown'
                ];
                // Quote entries to handle commands natively
                return row.map(str => `"${String(str).replace(/"/g, '""')}"`).join(",");
            }).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `visitor_logs_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                <AlertDescription>{error.message}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Visitor Logs</h1>
                <Button onClick={handleExportCSV} variant="outline" className="gap-2 bg-white dark:bg-gray-800">
                    <Download className="w-4 h-4" />
                    Export CSV
                </Button>
            </div>

            <VisitorCharts visitors={visitors || []} />

            <Card>
                <CardHeader>
                    <CardTitle>Total Tracked Visitors ({visitors?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Visits</TableHead>
                                    <TableHead>Total Time</TableHead>
                                    <TableHead>Last Visit Date</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Device/Browser</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!visitors || visitors.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-24 text-gray-500">
                                            No visitors logged yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    visitors.map((visitor) => (
                                        <TableRow key={visitor._id}>
                                            <TableCell className="font-medium">{visitor.ipAddress}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-900 dark:text-gray-100">{visitor.country || 'Unknown'}</span>
                                                    <span className="text-xs text-gray-500">{visitor.city || 'Unknown'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-green-100 bg-green-600 rounded-full">
                                                    {visitor.totalVisits}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-gray-600 font-medium">
                                                    {formatTimeSpent(visitor.totalTimeSpent)}
                                                </span>
                                            </TableCell>
                                            <TableCell>{visitor.readableDateStr || new Date(visitor.visitedAt).toLocaleDateString()}</TableCell>
                                            <TableCell>{visitor.readableTimeStr || new Date(visitor.visitedAt).toLocaleTimeString()}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 max-w-[250px]" title={visitor.userAgent}>
                                                    {getDeviceIcon(visitor.device || '', visitor.userAgent)}
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {visitor.device || 'Unknown Device'}
                                                        </span>
                                                        <span className="truncate text-xs text-gray-500">
                                                            {visitor.os ? `${visitor.os} • ${visitor.browser || 'Unknown'}` : visitor.userAgent}
                                                        </span>
                                                    </div>
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
