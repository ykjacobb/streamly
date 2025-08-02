"use client";

import { useState } from "react";
import { deleteSocialAccount } from "@/lib/actions/social-account";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SocialAccount {
    id: string;
    platform: string;
    username: string;
    url: string;
}

interface AccountListProps {
    accounts: SocialAccount[];
    onDelete: () => void;
}

export function AccountList({ accounts, onDelete }: AccountListProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await deleteSocialAccount(id);
            toast.success("Account removed successfully");
            onDelete();
        } catch (error) {
            toast.error("Failed to remove account");
        } finally {
            setDeletingId(null);
        }
    };

    const getEmbedCode = (account: SocialAccount) => {
        switch (account.platform) {
            case "youtube":
                return `<iframe width="560" height="315" src="https://www.youtube.com/embed?listType=user_uploads&list=${account.username}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            case "tiktok":
                return `<blockquote class="tiktok-embed" cite="${account.url}" data-unique-id="${account.username}"></blockquote>`;
            case "instagram":
                return `<blockquote class="instagram-media" data-instgrm-permalink="${account.url}"></blockquote>`;
            case "x":
                return `<a class="twitter-timeline" href="${account.url}">Tweets by ${account.username}</a>`;
            default:
                return "";
        }
    };

    if (accounts.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-8">
                No social media accounts added yet
            </div>
        );
    }

    return (
        <ul className="space-y-4">
            {accounts.map((account) => (
                <li
                    key={account.id}
                    className="border rounded-lg p-4 space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold capitalize">
                                {account.platform}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                @{account.username}
                            </p>
                        </div>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(account.id)}
                            disabled={deletingId === account.id}
                        >
                            {deletingId === account.id ? "Removing..." : "Remove"}
                        </Button>
                    </div>

                    <div className="bg-muted p-2 rounded text-sm">
                        <p className="font-mono break-all">
                            {getEmbedCode(account)}
                        </p>
                    </div>

                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: getEmbedCode(account),
                            }}
                        />
                    </div>
                </li>
            ))}
        </ul>
    );
} 