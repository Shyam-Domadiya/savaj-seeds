import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function ProductLoading() {
    return (
        <div className="container py-6 space-y-8 animate-in fade-in duration-500">
            {/* Breadcrumb Area */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-10 w-32 rounded-full" />
            </div>

            <main className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Visual Column Skeleton */}
                <div className="lg:col-span-5 space-y-6">
                    <Skeleton className="aspect-square w-full rounded-[2rem]" />
                    <div className="grid grid-cols-3 gap-3">
                        <Skeleton className="h-24 rounded-2xl" />
                        <Skeleton className="h-24 rounded-2xl" />
                        <Skeleton className="h-24 rounded-2xl" />
                    </div>
                </div>

                {/* Info Column Skeleton */}
                <div className="lg:col-span-7 space-y-10">
                    <Card className="p-8 md:p-12 space-y-8">
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-16 md:h-24 w-3/4" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                        <div className="flex gap-4">
                            <Skeleton className="h-16 flex-1 rounded-full" />
                            <Skeleton className="h-16 flex-1 rounded-full" />
                        </div>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Skeleton className="h-64 rounded-3xl" />
                        <Skeleton className="h-64 rounded-3xl" />
                    </div>
                </div>
            </main>
        </div>
    )
}
