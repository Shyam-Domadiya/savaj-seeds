"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ThemeProviderProps } from "next-themes"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { ConsentBanner } from "@/components/providers/consent-banner"

export function Providers({ children, ...props }: ThemeProviderProps) {
    const [queryClient] = React.useState(() => new QueryClient())

    return (
        <NextThemesProvider {...props}>
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    {children}
                    <ConsentBanner />
                </TooltipProvider>
            </QueryClientProvider>
        </NextThemesProvider>
    )
}
