import Link from "next/link";
import {
    HomeSimpleDoor,
    CameraSolid,
    BookSolid,
    FlashSolid,
    PlaySolid
} from "iconoir-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navItems = [
    {
        icon: HomeSimpleDoor,
        label: "Home",
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

interface MobileNavProps {
    userEmail?: string | null;
}

export function MobileNav({ userEmail }: MobileNavProps) {
    const pathname = usePathname();

    return (
        <div className="md:hidden fixed bottom-4 left-4 right-4">
            <nav className="bg-gray-100/20 dark:bg-zinc-900/20 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-full">
                <div className="flex justify-around items-center h-16">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center w-full h-full",
                                    "transition-colors duration-300",
                                    isActive
                                        ? "text-black dark:text-white"
                                        : "text-gray-600 dark:text-gray-400"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="text-xs mt-1">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
} 