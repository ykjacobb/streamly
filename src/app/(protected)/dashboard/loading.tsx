import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
    return (
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 dark:border-gray-700">
            <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Stats Cards Skeletons */}
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                        <div className="flex items-center">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="ml-4">
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-6 w-12" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Skeleton */}
            <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="flow-root">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <li key={i} className="py-3">
                                <div className="flex items-center space-x-4">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <div className="min-w-0 flex-1 space-y-2">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
} 