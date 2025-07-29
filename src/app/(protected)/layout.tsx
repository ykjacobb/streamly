"use client";

import { useSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/ui/sidebar";
import { MobileNav } from "@/components/ui/mobile-nav";

export default function ProtectedLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const { data: session, isPending } = useSession();

    if (isPending) {
        return null;
    }

    if (!session) {
        redirect("/auth/login");
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-zinc-900">
            {/* Sidebar - hidden on mobile */}
            <div className="hidden md:block">
                <Sidebar userEmail={session.user.email} />
            </div>

            {/* Main content - adjust padding bottom on mobile for nav bar */}
            <div className="flex-1 md:p-3 pb-[76px] md:pb-3">
                <div className="h-full md:rounded-xl md:border md:border-gray-200 md:dark:border-gray-800 bg-white dark:bg-black">
                    <div className="h-full overflow-auto px-2 py-2 md:p-4">{children}</div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <MobileNav userEmail={session.user.email} />
        </div>
    );
}
