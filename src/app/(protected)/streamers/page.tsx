import { auth } from "@/lib/auth";
import { getStreamers } from "@/lib/actions/streamer";
import StreamersList from "./_components/streamers-list";
import { headers } from "next/headers";

export const metadata = {
  title: "Streamers",
};

export default async function StreamersPage() {
  // @ts-ignore better-auth type mismatch
  const sessionRes = await auth.api.getSession({ headers: headers() });
  const session = sessionRes?.user ? { user: sessionRes.user } : null;
  
  if (!session?.user?.id) return null;

  // @ts-ignore prisma client typing generated
  const streamers = await getStreamers(session.user.id);

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