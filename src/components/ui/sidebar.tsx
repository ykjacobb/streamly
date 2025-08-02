"use client";

import Link from "next/link";
import Image from "next/image";
import {
    HomeSimpleDoor,
    CameraSolid,
    BookSolid,
    Settings,
    FlashSolid,
    PlaySolid,
    NavArrowLeft,
    NavArrowRight,
    User,
    AppNotification,
    AppNotificationSolid
} from "iconoir-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const navigation = [
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
    },
    {
        label: "Accounts",
        href: "/accounts",
        icon: User,
    },
    {
        icon: AppNotificationSolid,
        label: "Watermark",
        href: "/watermark"
    }
] as const;

interface SidebarProps {
    userEmail?: string | null;
    userName?: string | null;
}

export function Sidebar({ userEmail, userName }: SidebarProps) {
    const pathname = usePathname();
    const [activeTabPosition, setActiveTabPosition] = useState<number | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia('(max-width: 768px)').matches);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const activeIndex = navigation.findIndex((item) => pathname.startsWith(item.href));
        // Each item is 40px (h-10) + 4px margin bottom
        if (activeIndex !== -1) {
            setActiveTabPosition(activeIndex * 44);
        } else {
            // No matching sidebar item (e.g., /settings) – hide indicator
            setActiveTabPosition(null);
        }
    }, [pathname]);

    return (
        <TooltipProvider>
            <div 
                className={cn(
                    "transition-all duration-300 ease-in-out bg-gray-100 dark:bg-zinc-900 h-full",
                    isCollapsed ? "w-16" : "w-16 md:w-60"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo area */}
                    <div className="h-24 flex items-center justify-center">
                        {isCollapsed || isMobile ? (
                            <Image
                                src="/streamly-icon.png"
                                alt="Streamly"
                                width={40}
                                height={40}
                                className="dark:invert select-none"
                                draggable={false}
                            />
                        ) : (
                            <div className="hidden md:block">
                                <Image
                                    src="/streamly.png"
                                    alt="Streamly"
                                    width={180}
                                    height={60}
                                    className="dark:invert select-none"
                                    draggable={false}
                                />
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-2 relative">
                        {activeTabPosition !== null && (
                            <div
                                className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full transition-transform duration-300 ease-out"
                                style={{ transform: `translateY(${activeTabPosition + 4}px)` }}
                            />
                        )}

                        {navigation.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            const Icon = item.icon;
                            return (
                                <Tooltip key={item.href} delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "relative flex items-center h-10 mb-1 rounded-lg transition-colors duration-300",
                                                isCollapsed || isMobile ? "justify-center" : "space-x-3 px-3",
                                                "group z-10",
                                                isActive
                                                    ? "text-blue-600 dark:text-blue-400"
                                                    : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                                            )}
                                        >
                                            <Icon className="h-5 w-5 flex-shrink-0" />
                                            <span className={cn(
                                                "transition-opacity duration-300",
                                                isCollapsed ? "hidden" : "hidden md:block"
                                            )}>
                                                {item.label}
                                            </span>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent 
                                        side="right" 
                                        className={cn(
                                            "bg-zinc-900 border text-white rounded-full px-3 py-1 text-sm",
                                            (!isCollapsed && !isMobile) && "hidden"
                                        )}
                                    >
                                        {item.label}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </nav>

                    {/* Bottom section: collapse button above account */}
                    <div className="mt-auto border-t border-gray-200 dark:border-gray-800 flex flex-col">
                        {/* Collapse button */}
                        <div className="p-2">
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
                            >
                                {isCollapsed ? (
                                    <NavArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                ) : (
                                    <NavArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                )}
                            </button>
                        </div>

                        {/* Account info */}
                        <Link
                            href="/settings"
                            className="p-4 flex items-center space-x-3 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <Image
                                src="https://github.com/shadcn.png"
                                alt="Avatar"
                                width={32}
                                height={32}
                                className="rounded-full select-none flex-shrink-0"
                                draggable={false}
                            />
                            <div className={cn(
                                "transition-opacity duration-300",
                                isCollapsed ? "hidden" : "hidden md:block"
                            )}>
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {userName || userEmail || "Settings"}
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}
