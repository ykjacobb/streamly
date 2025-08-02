"use client";

import { LayoutDashboard, Library } from "lucide-react";
import { Suspense } from "react";
import DashboardLoading from "./loading";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const { data: session } = useSession();
    const userName = session?.user?.name || "User";
    const router = useRouter();

    return (
        <Suspense fallback={<DashboardLoading />}>
            <div className="rounded-lg mt-12">
                <div className="mb-6">
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-3xl font-semibold">
                            Welcome back
                        </h1>
                        <p className="text-muted-foreground mt-2 mb-12 text-xl">
                            {userName}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl bg-gray-100 p-2 border dark:bg-zinc-900/50">
                        <div className="flex items-center gap-4">
                            <Image
                                src="/streamers-page.png"
                                alt="Total Projects"
                                quality={100}
                                width={1000}
                                height={1000}
                                className="h-[200px] border w-[200px] rounded-lg select-none drag-none"
                            />
                            <div>
                                <h2 className="text-2xl font-semibold">
                                    Manage Streamers
                                </h2>
                                <p className="text-muted-foreground mt-2 text-lg">
                                    Add your streamers to monitor when they are live.
                                </p>
                                <button onClick={() => router.push("/streamers")} className="hover:opacity-60 cursor-pointer duration-300 rounded-lg mt-6 text-lg font-medium text-white px-5 py-2 bg-blue-600">
                                    Add Streamer
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-gray-100 p-2 border dark:bg-zinc-900/50">
                        <div className="flex items-center gap-4">
                            <Image
                                src="/sources-page.png"
                                alt="Sources"
                                quality={100}
                                width={1000}
                                height={1000}
                                className="h-[200px] border w-[200px] rounded-lg select-none drag-none"
                            />
                            <div>
                                <h2 className="text-2xl font-semibold">
                                    Find Clips
                                </h2>
                                <p className="text-muted-foreground mt-2 text-lg">
                                    Get clips from pages and post.
                                </p>
                                <button onClick={() => router.push("/sources")} className="hover:opacity-60 cursor-pointer duration-300 rounded-lg mt-6 text-lg font-medium text-white px-5 py-2 bg-blue-600">
                                    Find Clips
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    );
}
