"use client"

import React, { forwardRef } from "react"
import Image, { ImageProps } from "next/image"

// LazyImage is a simple wrapper around Next.js Image — lazy loading is handled by Next.js by default
export const LazyImage = forwardRef<HTMLImageElement, ImageProps>(
    function LazyImage(props, ref) {
        // Next.js Image handles lazy loading natively; this is just a passthrough wrapper
        return <Image {...props} />
    }
)

LazyImage.displayName = "LazyImage"
