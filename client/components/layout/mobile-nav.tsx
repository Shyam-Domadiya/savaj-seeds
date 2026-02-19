"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader } from "@/components/ui/sheet"
import { SearchComponent } from "@/components/features/search/search"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/animations"
import { Menu, X, Home, Package, Phone, Info, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"



const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: Info },
  { href: "/products", label: "Products", icon: Package },

  { href: "/contact", label: "Contact", icon: Phone },
]

interface MobileNavProps {
  className?: string
}

export function MobileNav({ className }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const pathname = usePathname()

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])



  // Handle swipe gestures
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && isOpen) {
      setIsOpen(false)
    }
    if (isRightSwipe && !isOpen) {
      setIsOpen(true)
    }
  }

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isMounted) {
    return null
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className={cn("hidden md:block lg:hidden", className)}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-11 w-11 transition-all duration-300 relative rounded-full",
              "hover:bg-primary/10 hover:text-primary",
              "active:scale-95",
              "focus:ring-2 focus:ring-primary/20"
            )}
            aria-label="Toggle navigation menu"
          >
            <div className="relative">
              <Menu
                className={cn(
                  "h-6 w-6 transition-all duration-300",
                  isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                )}
              />
              <X
                className={cn(
                  "h-6 w-6 absolute inset-0 transition-all duration-300",
                  isOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                )}
              />
            </div>
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className={cn(
            "w-[300px] sm:w-[350px] p-0 border-l border-white/20",
            "bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60",
            "shadow-2xl"
          )}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>Main mobile navigation</SheetDescription>
          </SheetHeader>

          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 dark:border-white/5 bg-gradient-to-b from-white/5 to-transparent">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  Menu
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Scrollable Content */}
            <ScrollArea className="flex-1 px-4 py-6">
              <div className="space-y-6">
                {/* Search */}
                <div className="relative">
                  <SearchComponent
                    placeholder="Search products..."
                    className="w-full shadow-sm border-primary/20 focus-within:border-primary/50 focus-within:ring-primary/20 bg-white/50 dark:bg-black/20"
                    showResults={false}
                  />
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2">
                  {navItems.map((item, index) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300",
                          "hover:bg-primary/5 hover:translate-x-1",
                          "group relative overflow-hidden",
                          isActive
                            ? "bg-primary/10 text-primary font-semibold shadow-sm border border-primary/10"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                        style={{
                          animationDelay: `${index * 50}ms`
                        }}
                      >
                        <Icon className={cn(
                          "h-5 w-5 transition-all duration-300",
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                        )} />

                        <span className="text-base relative z-10">
                          {item.label}
                        </span>

                        {isActive && (
                          <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                        )}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </ScrollArea>

            {/* Footer Actions */}
            <div className="p-6 border-t border-white/10 bg-muted/30 space-y-4">
              <Button
                asChild
                size="lg"
                className={cn(
                  "w-full h-12 text-base font-semibold shadow-lg rounded-xl",
                  "hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
                  "transition-all duration-300",
                  "bg-gradient-to-r from-primary to-primary/80"
                )}
              >
                <Link href="/contact" onClick={() => setIsOpen(false)}>
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Support
                </Link>
              </Button>

              {/* Social / Info Links Row */}
              <div className="flex justify-center gap-6 pt-2">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.047-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C9.673 2.013 10.03 2 12.457 2h-.142zm0 1.802c-2.444 0-2.722.01-3.692.054-.91.041-1.404.19-1.733.32-.435.168-.748.371-1.076.7-.328.328-.53.64-.699 1.076-.129.33-.28.823-.32 1.733-.045.969-.053 1.247-.053 3.692s.008 2.722.053 3.692c.041.91.19 1.404.32 1.733.168.435.371.748.7 1.076.328.328.64.53 1.076.699.33.129.823.28 1.733.32.969.045 1.247.053 3.692.053s2.722-.008 3.692-.053c.91-.041 1.404-.19 1.733-.32.435-.168.748-.371 1.076-.7.328-.328.53-.64.699-1.076.129-.33.28-.823.32-1.733.045-.969.053-1.247.053-3.692s-.008-2.722-.053-3.692c-.041-.91-.19-1.404-.32-1.733-.168-.435-.371-.748-.7-1.076-.328-.328-.64-.53-1.076-.699-.33-.129-.823-.28-1.733-.32-.97-.045-1.248-.053-3.692-.053zM12.315 6.877a5.438 5.438 0 110 10.876 5.438 5.438 0 010-10.876zm0 1.802a3.636 3.636 0 100 7.272 3.636 3.636 0 000-7.272zm5.787-4.226a1.202 1.202 0 110 2.404 1.202 1.202 0 010-2.404z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}