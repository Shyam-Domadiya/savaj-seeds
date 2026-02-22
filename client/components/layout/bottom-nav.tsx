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

    // Hide bottom navigation on admin routes
    if (pathname?.toLowerCase().startsWith('/admin') || pathname?.split('/')[1]?.toLowerCase() === 'admin') {
        return null;
    }

    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[420px] md:hidden pointer-events-none">
            <div className="bg-background/60 backdrop-blur-2xl border border-white/20 rounded-full h-16 shadow-[0_12px_40px_rgba(0,0,0,0.15)] grid grid-cols-4 items-center px-1.5 pointer-events-auto ring-1 ring-black/5">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 relative h-full transition-all duration-500 ease-professional",
                                isActive ? "text-primary scale-105" : "text-muted-foreground hover:text-primary/70"
                            )}
                        >
                            {isActive && (
                                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full shadow-[0_0_12px_rgba(34,197,94,0.8)] animate-in fade-in zoom-in duration-500" />
                            )}

                            <div className={cn(
                                "p-2.5 rounded-full transition-all duration-500 ease-professional",
                                isActive ? "bg-primary/15 shadow-[inset_0_0_10px_rgba(34,197,94,0.1)]" : "bg-transparent"
                            )}>
                                <Icon
                                    className={cn(
                                        "h-5 w-5 transition-all duration-500",
                                        isActive ? "scale-110 rotate-[5deg]" : "scale-100"
                                    )}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                            </div>
                            <span className={cn(
                                "text-[10px] font-black transition-all duration-500 uppercase tracking-widest",
                                isActive ? "opacity-100 translate-y-[-1px]" : "opacity-50"
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
