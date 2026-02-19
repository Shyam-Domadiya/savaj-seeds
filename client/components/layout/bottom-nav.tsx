"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Info, Package, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/products", label: "Products", icon: Package },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Phone },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border h-16 pb-safe md:hidden shadow-[0_-5px_10px_rgba(0,0,0,0.05)]">
            <div className="grid grid-cols-4 h-full">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 relative transition-colors duration-200",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
                            )}
                        >
                            {isActive && (
                                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full animate-in fade-in zoom-in duration-300" />
                            )}

                            <Icon
                                className={cn(
                                    "h-6 w-6 transition-transform duration-200",
                                    isActive ? "scale-110" : "scale-100"
                                )}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span className={cn(
                                "text-[10px] font-medium transition-all duration-200",
                                isActive ? "font-bold" : "font-medium"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
