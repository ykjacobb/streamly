"use client";

import { useState, useTransition } from "react";
import { addClipSource } from "@/lib/actions/clip-source";
import { authClient } from "@/lib/auth-client";
import { SocialIcon } from "react-social-icons";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

const platforms = [
    { id: "twitter", name: "X (Twitter)", url: "twitter.com" },
    { id: "youtube", name: "YouTube", url: "youtube.com" },
    { id: "tiktok", name: "TikTok", url: "tiktok.com" }
] as const;

export default function AddSourceForm() {
    const [platform, setPlatform] = useState<string>("");
    const [page, setPage] = useState("");
    const { useSession } = authClient;
    const { data: session } = useSession();
    const [isPending, startTransition] = useTransition();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.id) return;
        startTransition(() => addClipSource(session.user.id, platform, page));
        setPlatform("");
        setPage("");
    };

    const selectedPlatform = platforms.find((p) => p.id === platform);

    return (
        <form
            onSubmit={onSubmit}
            className="space-y-4"
        >
            <div>
                <label className="block text-sm font-medium mb-1">Platform</label>
                <Select
                    value={platform}
                    onValueChange={setPlatform}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a platform">
                            {selectedPlatform && (
                                <div className="flex items-center gap-2">
                                    <SocialIcon
                                        network={selectedPlatform.id}
                                        style={{ width: 20, height: 20 }}
                                    />
                                    <span>{selectedPlatform.name}</span>
                                </div>
                            )}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {platforms.map((platform) => (
                            <SelectItem
                                key={platform.id}
                                value={platform.id}
                                className="flex items-center gap-2"
                            >
                                <div className="flex items-center gap-2">
                                    <SocialIcon
                                        network={platform.id}
                                        style={{ width: 20, height: 20 }}
                                    />
                                    <span>{platform.name}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">
                    {platform === "youtube"
                        ? "Channel URL"
                        : platform === "twitter"
                          ? "Profile URL"
                          : platform === "tiktok"
                            ? "Profile URL"
                            : "Page / Channel URL"}
                </label>
                <div className="relative">
                    {selectedPlatform && (
                        <div className="absolute left-2 top-1/2 -translate-y-1/2">
                            <SocialIcon
                                network={selectedPlatform.id}
                                style={{ width: 24, height: 24 }}
                            />
                        </div>
                    )}
                    <input
                        value={page}
                        onChange={(e) => setPage(e.target.value)}
                        className={`w-full rounded-md text-sm border px-3 py-1.5 ${selectedPlatform ? "pl-10" : ""}`}
                        placeholder={selectedPlatform ? `${selectedPlatform.url}/...` : "Enter URL"}
                        required
                    />
                </div>
            </div>
            <button
                type="submit"
                disabled={isPending || !platform}
                className="w-full rounded-md bg-blue-600 text-white px-4 py-2 disabled:opacity-50 hover:bg-blue-500 transition-colors"
            >
                {isPending ? "Adding..." : "Add Source"}
            </button>
        </form>
    );
}
