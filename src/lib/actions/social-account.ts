import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type Platform = "youtube" | "tiktok" | "instagram" | "x";

export interface SocialAccountData {
    platform: Platform;
    username: string;
    url: string;
}

export async function addSocialAccount(data: SocialAccountData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }

    // Validate URL format based on platform
    const urlPattern = getUrlPattern(data.platform);
    if (!urlPattern.test(data.url)) {
        throw new Error(`Invalid ${data.platform} URL format`);
    }

    return prisma.socialAccount.create({
        data: {
            ...data,
            userId: session.user.id,
        },
    });
}

export async function deleteSocialAccount(id: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }

    const account = await prisma.socialAccount.findUnique({
        where: { id },
        select: { userId: true },
    });

    if (!account || account.userId !== session.user.id) {
        throw new Error("Account not found or unauthorized");
    }

    return prisma.socialAccount.delete({
        where: { id },
    });
}

export async function getUserSocialAccounts() {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }

    return prisma.socialAccount.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });
}

function getUrlPattern(platform: Platform): RegExp {
    switch (platform) {
        case "youtube":
            return /^https?:\/\/(www\.)?(youtube\.com\/@[\w-]+|youtube\.com\/channel\/[\w-]+)$/;
        case "tiktok":
            return /^https?:\/\/(www\.)?tiktok\.com\/@[\w-.]+$/;
        case "instagram":
            return /^https?:\/\/(www\.)?instagram\.com\/[\w-.]+$/;
        case "x":
            return /^https?:\/\/(www\.)?x\.com\/[\w-.]+$/;
        default:
            return /.*/;
    }
} 