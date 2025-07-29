import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AddSourceForm from "./_components/add-source-form";
import SourceItem from "./_components/source-item";
import { headers } from "next/headers";
import { Suspense } from "react";
import SourcesLoading from "./loading";

type ClipSource = {
    id: string;
    userId: string;
    platform: string;
    page: string;
    createdAt: Date;
    updatedAt: Date;
};

export const metadata = {
    title: "Clip Sources"
};

export default async function SourcesPage() {
    // @ts-ignore better-auth type mismatch
    const sessionRes = await auth.api.getSession({ headers: headers() });
    const session = sessionRes?.user ? { user: sessionRes.user } : null;
    if (!session?.user?.id) return null;

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Your Clip Sources</h1>

            <AddSourceForm />

            <h2 className="text-3xl font-bold">Current followed sources</h2>

            <Suspense fallback={<SourcesLoading />}>
                {/* @ts-expect-error Async Server Component */}
                <SourcesList userId={session.user.id} />
            </Suspense>
        </div>
    );
}

async function SourcesList({ userId }: { userId: string }) {
    // @ts-ignore prisma client typing generated
    const sources: ClipSource[] = await prisma.clipSource.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
    });

    return (
        <ul className="space-y-2">
            {sources.map((source) => (
                <SourceItem
                    key={source.id}
                    source={source}
                    userId={userId}
                />
            ))}
            {sources.length === 0 && (
                <li className="text-gray-500 text-center py-8">No sources added yet.</li>
            )}
        </ul>
    );
}
