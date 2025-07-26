"use server";

import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

export async function addClipSource(userId: string, platform: string, page: string) {
  if (!userId || !platform || !page) return;

  await prisma.clipSource.create({
    data: {
      userId,
      platform,
      page,
    },
  });

  // Revalidate the list page
  revalidatePath("/sources");
}

export async function deleteClipSource(id: string, userId: string) {
  if (!id || !userId) return;

  await prisma.clipSource.deleteMany({
    where: {
      id,
      userId, // Ensure user can only delete their own sources
    },
  });

  revalidatePath("/sources");
} 