'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Visitor {
    _id: string;
    device?: string;
    browser?: string;
    os?: string;
    totalVisits: number;
}

interface VisitorChartsProps {
    visitors: Visitor[];
}

export function VisitorCharts({ visitors }: VisitorChartsProps) {
    // Colors for graphs
    const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#64748b'];

    // Memoize the chart data so it doesn't recalculate on every render uselessly
    const { deviceData, browserData } = useMemo(() => {
        if (!visitors || visitors.length === 0) return { deviceData: [], browserData: [] };

        // Process Device Data
        const deviceMap: Record<string, number> = {};
        // Process Browser Data
        const browserMap: Record<string, number> = {};

        visitors.forEach((visitor) => {
            const device = visitor.device || 'Unknown';
            const browser = visitor.browser || 'Unknown';

            deviceMap[device] = (deviceMap[device] || 0) + 1;
            browserMap[browser] = (browserMap[browser] || 0) + 1;
        });

        // Convert to arrays for Recharts
        const deviceData = Object.keys(deviceMap).map(key => ({
            name: key,
            value: deviceMap[key]
        })).sort((a, b) => b.value - a.value);

        const browserData = Object.keys(browserMap).map(key => ({
            name: key,
            value: browserMap[key]
        })).sort((a, b) => b.value - a.value);

        return { deviceData, browserData };
    }, [visitors]);

    if (!visitors || visitors.length === 0) {
        return null;
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 mb-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-500">Device Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={deviceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {deviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-500">Browser Usage</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={browserData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                                    {browserData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
