"use client";

import { ThemeToggle } from "@/components/theme-toggle";

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold mb-4">Settings</h1>
            </div>

            {/* Theme Section */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Appearance</h2>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600 dark:text-gray-300">Toggle Theme</span>
                    <ThemeToggle />
                </div>
            </section>
        </div>
    );
} 