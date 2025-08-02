"use client";

import { useState } from "react";
import { Platform, SocialAccountData, addSocialAccount } from "@/lib/actions/social-account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const PLATFORMS: { value: Platform; label: string }[] = [
    { value: "youtube", label: "YouTube" },
    { value: "tiktok", label: "TikTok" },
    { value: "instagram", label: "Instagram" },
    { value: "x", label: "X (Twitter)" },
];

export function AddAccountForm({ onAdd }: { onAdd: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [platform, setPlatform] = useState<Platform>("youtube");
    const [username, setUsername] = useState("");
    const [url, setUrl] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!platform || !username || !url) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            setIsLoading(true);
            await addSocialAccount({ platform, username, url });
            toast.success("Account added successfully");
            onAdd();
            // Reset form
            setPlatform("youtube");
            setUsername("");
            setUrl("");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to add account");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-4">
            <h2 className="text-lg font-semibold">Add Social Media Account</h2>
            
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium">Platform</label>
                    <Select
                        value={platform}
                        onValueChange={(value) => setPlatform(value as Platform)}
                        disabled={isLoading}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
                        <SelectContent>
                            {PLATFORMS.map((platform) => (
                                <SelectItem key={platform.value} value={platform.value}>
                                    {platform.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="text-sm font-medium">Username</label>
                    <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder={`Your ${platform} username`}
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Profile URL</label>
                    <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder={`Your ${platform} profile URL`}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Adding..." : "Add Account"}
            </Button>
        </form>
    );
} 