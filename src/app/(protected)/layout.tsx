"use client";

import { useSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/ui/sidebar";

export default function ProtectedLayout({
  children,
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
      <Sidebar userEmail={session.user.email} />
      
      {/* Main content */}
      <div className="flex-1 p-3">
        <div className="h-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
          <div className="h-full overflow-auto p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 