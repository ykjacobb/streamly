"use client";

import Link from "next/link";
import {
    HomeSimpleDoor,
    CameraSolid,
    BookSolid,
    Settings,
    FlashSolid,
    PlaySolid
} from "iconoir-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const sidebarItems = [
    {
        icon: HomeSimpleDoor,
        label: "Dashboard",
        href: "/dashboard"
    },
    {
        icon: CameraSolid,
        label: "Sources",
        href: "/sources"
    },
    {
        icon: PlaySolid,
        label: "Streamers",
        href: "/streamers"
    },
    {
        icon: FlashSolid,
        label: "Editor",
        href: "/editor"
    },
    {
        icon: BookSolid,
        label: "Library",
        href: "/library"
    }
];

interface SidebarProps {
    userEmail?: string | null;
}

export function Sidebar({ userEmail }: SidebarProps) {
    const pathname = usePathname();
    const [activeTabPosition, setActiveTabPosition] = useState(0);

    useEffect(() => {
        const activeIndex = sidebarItems.findIndex((item) => pathname.startsWith(item.href));
        if (activeIndex !== -1) {
            // Each item is 40px (h-10) + 4px margin bottom
            setActiveTabPosition(activeIndex * 44);
        }
    }, [pathname]);

    return (
        <div className="w-16 md:w-60 bg-gray-100 dark:bg-zinc-900">
            <div className="flex flex-col h-full">
                {/* Logo area */}
                <div className="h-16 flex items-center justify-center md:justify-start px-4">
                    <span className="hidden md:block font-bold text-xl text-black dark:text-white">
                        real.kit
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-2 relative">
                    {/* Active tab indicator - blue line */}
                    <div
                        className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full transition-transform duration-300 ease-out"
                        style={{ transform: `translateY(${activeTabPosition + 4}px)` }}
                    />

                    {sidebarItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative flex items-center h-10 space-x-3 px-3 mb-1 rounded-lg transition-colors duration-300 transition-all",
                                    "group z-10",
                                    isActive
                                        ? "text-blue-600 dark:text-blue-400 duration-300 transition-all"
                                        : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white duration-300 transition-all"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="hidden md:block">{item.label}</span>
                                {/* Tooltip for mobile */}
                                <span className="md:hidden absolute left-14 bg-black text-white dark:bg-white dark:text-black px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User area */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-black" />
                        <div className="hidden md:block">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {userEmail}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
