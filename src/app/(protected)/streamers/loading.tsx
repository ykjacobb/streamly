import { Skeleton } from "@/components/ui/skeleton";

export default function StreamersLoading() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-96" />
            </div>

            {/* Add streamer form skeleton */}
            <div className="space-y-4">
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>

            {/* Streamers list skeleton */}
            <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                    </div>
                ))}
            </div>
        </div>
    );
} 