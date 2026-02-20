"use client"
import QRCode from "react-qr-code"
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'

interface ProductQRProps {
    className?: string;
    hideLabel?: boolean;
}

export function ProductQR({ className, hideLabel = false }: ProductQRProps) {
    const pathname = usePathname()

    const { data: url } = useQuery({
        queryKey: ['current-url', pathname],
        queryFn: () => {
            if (typeof window !== 'undefined') {
                return window.location.href;
            }
            return '';
        },
        initialData: '',
        refetchOnMount: 'always'
    });

    if (!url) return null

    return (
        <div className={`flex flex-col items-center justify-center gap-2 p-2 bg-white rounded-xl shadow-sm border border-border/50 ${className}`}>
            <QRCode
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={url}
                viewBox={`0 0 256 256`}
            />
            {!hideLabel && <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider text-center">Scan Me</span>}
        </div>
    )
}
