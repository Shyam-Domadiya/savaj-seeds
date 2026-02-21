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
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px] md:hidden">
            <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-full h-16 shadow-[0_8px_32px_rgba(0,0,0,0.12)] grid grid-cols-4 h-full items-center px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 relative h-full transition-all duration-300",
                                isActive ? "text-primary translate-y-[-4px]" : "text-muted-foreground hover:text-primary/70"
                            )}
                        >
                            {isActive && (
                                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-in fade-in zoom-in duration-500" />
                            )}

                            <div className={cn(
                                "p-2 rounded-full transition-all duration-300",
                                isActive ? "bg-primary/10 shadow-inner" : ""
                            )}>
                                <Icon
                                    className={cn(
                                        "h-5 w-5 transition-transform duration-300",
                                        isActive ? "scale-110" : "scale-100"
                                    )}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                            </div>
                            <span className={cn(
                                "text-[9px] font-bold transition-all duration-300 uppercase tracking-tighter",
                                isActive ? "opacity-100" : "opacity-60"
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
