"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ThemeProviderProps } from "next-themes"
import { TooltipProvider } from "@/components/ui/tooltip"

import { ConsentBanner } from "@/components/providers/consent-banner"

import { AuthProvider } from "@/context/AuthContext"

export function Providers({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider {...props}>
            <AuthProvider>
                <TooltipProvider>
                    {children}
                    <ConsentBanner />
                </TooltipProvider>
            </AuthProvider>
        </NextThemesProvider>
    )
}
