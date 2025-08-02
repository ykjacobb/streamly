import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function LibraryPage() {
    // @ts-ignore better-auth type mismatch
    const sessionRes = await auth.api.getSession({ headers: headers() });
    const session = sessionRes?.user ? { user: sessionRes.user } : null;

    if (!session?.user?.id) return null;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-medium">Your Library</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    View and manage your saved clips and highlights.
                </p>
            </div>
        </div>
    );
}
