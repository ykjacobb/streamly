import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { checkTwitchStreamStatus } from "@/lib/twitch";
import StreamersList from "./_components/streamers-list";

async function getInitialStreamers(userId: string) {
  // Get streamers from database with their last known status
  const streamers = await prisma.streamer.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  // Get Twitch usernames
  const twitchUsernames = streamers
    .filter(s => s.platform === 'twitch')
    .map(s => s.username);

  // Check current live status
  const twitchStatus = await checkTwitchStreamStatus(twitchUsernames);

  // Update database with new status
  await Promise.all(
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
  );

  // Return streamers with updated status
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

  // Get streamers with fresh status
  const streamers = await getInitialStreamers(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Streamers</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your favorite streamers and see who's live.
        </p>
      </div>

      <StreamersList initialStreamers={streamers} userId={session.user.id} />
    </div>
  );
}
