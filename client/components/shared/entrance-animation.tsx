"use client"

import type React from "react"
import { motion, useReducedMotion } from "framer-motion"

interface EntranceAnimationProps {
    children: React.ReactNode
    delay?: number
    direction?: "up" | "down" | "left" | "right" | "none"
    duration?: number
    className?: string
}

export function EntranceAnimation({
    children,
    delay = 0,
    direction = "up",
    duration = 0.4, // Slightly faster reveal
    className = "",
}: EntranceAnimationProps) {
    const shouldReduceMotion = useReducedMotion()

    const variants = {
        hidden: {
            opacity: 0,
            y: direction === "up" ? 15 : direction === "down" ? -15 : 0, // Reduced distance
            x: direction === "left" ? 15 : direction === "right" ? -15 : 0,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
        },
    }

    return (
        <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : "hidden"}
            whileInView={shouldReduceMotion ? { opacity: 1 } : "visible"}
            viewport={{ once: true, margin: "-20px" }} // Reveal sooner
            variants={variants}
            transition={{
                duration: duration,
                delay: delay,
                ease: [0.21, 1.02, 0.47, 0.98],
            }}
            style={{ willChange: "transform, opacity" }} // Hardware acceleration
            className={className}
        >
            {children}
        </motion.div>
    )
}
