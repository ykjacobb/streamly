import { Skeleton } from "@/components/ui/skeleton";

export default function SourcesLoading() {
    return (
        <div className="p-6 max-w-2xl mx-auto space-y-8">
            <Skeleton className="h-9 w-48" />

            {/* Add source form skeleton */}
            <div className="space-y-4 border rounded-lg p-4">
                <Skeleton className="h-6 w-32" />
                <div className="grid gap-4">
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>

            <Skeleton className="h-9 w-48" />

            {/* Sources list skeleton */}
            <ul className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                    <li key={i} className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                        <div className="flex justify-between items-center">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                            <Skeleton className="h-8 w-8" />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
} 