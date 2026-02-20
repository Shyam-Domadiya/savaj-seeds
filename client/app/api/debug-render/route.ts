
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const url = 'https://savaj-seeds-server.onrender.com/api/products';

    try {
        const start = Date.now();
        console.log(`Fetching ${url}...`);
        const res = await fetch(url, { cache: 'no-store' });
        const duration = Date.now() - start;

        const data = await res.json();

        return NextResponse.json({
            status: res.status,
            statusText: res.statusText,
            duration: `${duration}ms`,
            count: Array.isArray(data) ? data.length : 'Not an array',
            dataPreview: Array.isArray(data) ? data.slice(0, 1) : data
        });
    } catch (error: any) {
        return NextResponse.json({
            error: true,
            message: error.message,
            stack: error.stack,
            cause: error.cause
        }, { status: 500 });
    }
}
