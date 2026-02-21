import React from "react"

// Minimal passthrough wrappers — accepts and ignores animation-specific props
interface AnimationProps {
    children: React.ReactNode
    className?: string
    direction?: string
    duration?: number
    delay?: number
    [key: string]: unknown
}

export function FadeIn({ children, className }: AnimationProps) {
    return <div className={className}>{children}</div>
}

export function StaggerContainer({ children, className }: AnimationProps) {
    return <div className={className}>{children}</div>
}

export function StaggerItem({ children, className }: AnimationProps) {
    return <div className={className}>{children}</div>
}
