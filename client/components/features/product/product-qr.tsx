"use client"

import React from 'react'
import QRCode from "react-qr-code"
import { useQuery } from '@tanstack/react-query'

export function ProductQR() {
    const { data: url } = useQuery({
        queryKey: ['current-url'],
        queryFn: () => {
            if (typeof window !== 'undefined') {
                return window.location.href;
            }
            return '';
        },
        initialData: '',
    });

    if (!url) return null

    return (
        <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm border border-border/50 w-fit">
            <QRCode
                size={128}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={url}
                viewBox={`0 0 256 256`}
            />
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Scan for details</span>
        </div>
    )
}
