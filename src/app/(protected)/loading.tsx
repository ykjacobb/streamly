import { Skeleton } from "@/components/ui/skeleton";

export default function ProtectedLoading() {
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-zinc-900">
            {/* Sidebar skeleton */}
            <div className="hidden md:block w-60 bg-gray-100 dark:bg-zinc-900">
                <div className="flex flex-col h-full">
                    {/* Logo area */}
                    <div className="h-16 flex items-center px-4">
                        <Skeleton className="h-8 w-24" />
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center h-10 space-x-3 px-3 mb-1">
                                <Skeleton className="h-5 w-5" />
                                <Skeleton className="h-4 flex-1" />
                            </div>
                        ))}
                    </nav>

                    {/* User area */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex items-center space-x-3">
                            <Skeleton className="w-8 h-8 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content skeleton */}
            <div className="flex-1 md:p-3 pb-[76px] md:pb-3">
                <div className="h-full md:rounded-xl md:border md:border-gray-200 md:dark:border-gray-800 bg-white dark:bg-black">
                    <div className="h-full overflow-auto px-2 py-2 md:p-4">
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-full max-w-md" />
                            <div className="grid gap-4 mt-8">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="space-y-3">
                                        <Skeleton className="h-20 w-full rounded-lg" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile nav skeleton */}
            <div className="md:hidden fixed bottom-4 left-4 right-4">
                <div className="bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-full h-16">
                    <div className="flex justify-around items-center h-full px-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-8 w-8 rounded-full" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 