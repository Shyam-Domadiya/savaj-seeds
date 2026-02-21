"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  className?: string
  customTitle?: string // For dynamic pages like blog posts
}

export function Breadcrumb({ className, customTitle }: BreadcrumbProps) {
  const pathname = usePathname()

  // Don't show breadcrumbs on homepage
  if (pathname === "/") {
    return null
  }

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split("/").filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Home", href: "/" }
    ]

    let currentPath = ""

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`

      // Convert segment to readable label
      let label = segment
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      // Handle special cases for better labels
      // Handle special cases for better labels
      if (segment === "products") {
        label = "Products"
      } else if (segment === "contact") {
        label = "Contact"
      } else if (segment === "about") {
        label = "About"
      } else if (index === pathSegments.length - 1 && customTitle) {
        // Use custom title for the last segment (current page)
        label = customTitle
      }

      breadcrumbs.push({
        label,
        href: currentPath
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center overflow-x-auto no-scrollbar py-3 md:py-5 -mx-4 px-4 sm:mx-0 sm:px-0",
        className
      )}
    >
      <ol className="flex items-center whitespace-nowrap">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight
                className="h-3.5 w-3.5 mx-1.5 md:mx-2 text-muted-foreground/50 flex-shrink-0"
                aria-hidden="true"
              />
            )}
            {index === breadcrumbs.length - 1 ? (
              // Current page - not a link
              <span
                className="font-bold text-foreground flex items-center gap-1.5 text-[13px] md:text-sm"
                aria-current="page"
              >
                {index === 0 && <Home className="h-3.5 w-3.5" />}
                <span className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px]">
                  {breadcrumb.label}
                </span>
              </span>
            ) : (
              // Link to previous pages
              <Link
                href={breadcrumb.href}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-1.5 text-[13px] md:text-sm font-medium"
              >
                {index === 0 && <Home className="h-3.5 w-3.5" />}
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}