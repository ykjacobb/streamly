"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkTwitchStreamStatus } from "@/lib/twitch";

export async function addStreamer(userId: string, platform: string, username: string) {
  try {
    await prisma.streamer.create({
      data: {
        userId,
        platform,
        username: username.toLowerCase(),
      },
    });
    revalidatePath('/streamers');
  } catch (error) {
    console.error('Error adding streamer:', error);
    throw error;
  }
}

export async function removeStreamer(streamerId: string, userId: string) {
  try {
    await prisma.streamer.deleteMany({
      where: {
        id: streamerId,
        userId: userId,
      },
    });
    revalidatePath('/streamers');
  } catch (error) {
    console.error('Error removing streamer:', error);
    throw error;
  }
}

export async function getStreamers(userId: string) {
  try {
    const streamers = await prisma.streamer.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get Twitch usernames
    const twitchUsernames = streamers
      .filter(s => s.platform === 'twitch')
      .map(s => s.username);

    // Check Twitch status
    const twitchStatus = await checkTwitchStreamStatus(twitchUsernames);

    // Update streamer status
    return streamers.map(streamer => ({
      ...streamer,
      isLive: streamer.platform === 'twitch' ? twitchStatus[streamer.username.toLowerCase()] : false,
    }));
  } catch (error) {
    console.error('Error getting streamers:', error);
    throw error;
  }
}

export async function getLiveStreamers(userId: string) {
  try {
    const allStreamers = await getStreamers(userId);
    return allStreamers.filter(s => s.isLive);
  } catch (error) {
    console.error('Error getting live streamers:', error);
    throw error;
  }
}

export async function updateStreamersStatus() {
  try {
    const streamers = await prisma.streamer.findMany({
      where: {
        platform: 'twitch',
      },
    });

    const usernames = streamers.map(s => s.username);
    const status = await checkTwitchStreamStatus(usernames);

    // Update all streamers status
    await Promise.all(
      Object.entries(status).map(([username, isLive]) =>
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

    revalidatePath('/streamers');
  } catch (error) {
    console.error('Error updating streamers status:', error);
    throw error;
  }
} 