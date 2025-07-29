import { Skeleton } from "@/components/ui/skeleton";

export default function EditorLoading() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-96" />
            </div>

            {/* Upload area skeleton */}
            <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-32" />
            </div>

            {/* Preview area skeleton */}
            <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden">
                    <Skeleton className="w-full h-full" />
                </div>

                {/* Trim controls skeleton */}
                <div className="space-y-6 p-6 border rounded-lg">
                    <Skeleton className="h-6 w-32" />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-10 w-full" />
                        </div>

                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>

                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        </div>
    );
} 