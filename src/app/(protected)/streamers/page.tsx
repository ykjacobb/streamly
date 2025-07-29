import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { checkTwitchStreamStatus } from "@/lib/twitch";
import StreamersList from "./_components/streamers-list";
import { Suspense } from "react";
import StreamersLoading from "./loading";

async function getInitialStreamers(userId: string) {
    // Get streamers and check status in parallel
    const [streamers, twitchStatus] = await Promise.all([
        prisma.streamer.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        }),
        // Get Twitch usernames and check status
        prisma.streamer.findMany({
            where: { 
                userId,
                platform: 'twitch'
            },
            select: { username: true }
        }).then(async (twitchStreamers) => {
            const usernames = twitchStreamers.map(s => s.username);
            return checkTwitchStreamStatus(usernames);
        })
    ]);

    // Update database with new status in the background
    Promise.all(
        Object.entries(twitchStatus).map(([username, isLive]) =>
            prisma.streamer.updateMany({
                where: {
                    platform: 'twitch',
                    username: username.toLowerCase(),
                },
                data: {
                    isLive,
                    lastCheck: new Date(),
                },
            })
        )
    ).catch(console.error); // Handle errors silently

    // Return streamers with updated status immediately
    return streamers.map(streamer => ({
        ...streamer,
        isLive: streamer.platform === 'twitch' ? twitchStatus[streamer.username.toLowerCase()] : false,
    }));
}

export const metadata = {
    title: "Streamers"
};

export default async function StreamersPage() {
    // @ts-ignore better-auth type mismatch
    const sessionRes = await auth.api.getSession({ headers: headers() });
    const session = sessionRes?.user ? { user: sessionRes.user } : null;
    
    if (!session?.user?.id) return null;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Streamers</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Manage your favorite streamers and see who's live.
                </p>
            </div>

            <Suspense fallback={<StreamersLoading />}>
                {/* @ts-expect-error Async Server Component */}
                <StreamersContent userId={session.user.id} />
            </Suspense>
        </div>
    );
}

async function StreamersContent({ userId }: { userId: string }) {
    const streamers = await getInitialStreamers(userId);
    return <StreamersList initialStreamers={streamers} userId={userId} />;
}
