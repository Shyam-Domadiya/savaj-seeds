import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="container py-8 space-y-8 animate-in fade-in duration-500">
            {/* Breadcrumb Skeleton */}
            <div className="flex gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left/Main Column Skeleton */}
                <div className="lg:col-span-8 space-y-6">
                    <Skeleton className="h-[400px] w-full rounded-3xl" />
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>

                {/* Right/Sidebar Column Skeleton */}
                <div className="lg:col-span-4 space-y-6">
                    <Skeleton className="h-[200px] w-full rounded-3xl" />
                    <Skeleton className="h-[200px] w-full rounded-3xl" />
                    <Skeleton className="h-[200px] w-full rounded-3xl" />
                </div>
            </div>
        </div>
    )
}
