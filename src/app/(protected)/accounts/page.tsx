"use client";

import { useState, useEffect } from "react";
import { getUserSocialAccounts } from "@/lib/actions/social-account";
import { AddAccountForm } from "./_components/add-account-form";
import { AccountList } from "./_components/account-list";
import { toast } from "sonner";

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadAccounts = async () => {
        try {
            setIsLoading(true);
            const data = await getUserSocialAccounts();
            setAccounts(data);
        } catch (error) {
            toast.error("Failed to load accounts");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAccounts();
    }, []);

    if (isLoading) {
        return (
            <div className="container space-y-6">
                <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                <div className="h-64 bg-muted animate-pulse rounded-lg" />
                <div className="h-96 bg-muted animate-pulse rounded-lg" />
            </div>
        );
    }

    return (
        <div className="container space-y-6">
            <div>
                <h1 className="text-2xl font-medium">Social Media Accounts</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your connected social media accounts
                </p>
            </div>

            <AddAccountForm onAdd={loadAccounts} />

            <div>
                <h2 className="text-xl font-semibold mb-4">Your Accounts</h2>
                <AccountList accounts={accounts} onDelete={loadAccounts} />
            </div>

            {/* Social Media Script Tags */}
            <script async src="https://www.tiktok.com/embed.js"></script>
            <script async src="https://platform.twitter.com/widgets.js"></script>
            <script async src="https://www.instagram.com/embed.js"></script>
        </div>
    );
} 