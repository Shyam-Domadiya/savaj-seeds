import React from "react"
import { cn } from "@/lib/utils"

type Tag = keyof React.JSX.IntrinsicElements

interface ScreenReaderOnlyProps {
    children: React.ReactNode
    as?: Tag
    className?: string
}

export function ScreenReaderOnly({
    children,
    as: Component = "span",
    className,
}: ScreenReaderOnlyProps) {
    const El = Component as React.ElementType
    return (
        <El className={cn("sr-only", className)}>
            {children}
        </El>
    )
}
