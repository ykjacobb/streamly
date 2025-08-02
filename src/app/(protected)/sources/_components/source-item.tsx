"use client";

import { SocialIcon } from "react-social-icons";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { deleteClipSource } from "@/lib/actions/clip-source";

type SourceItemProps = {
    source: {
        id: string;
        userId: string;
        platform: string;
        page: string;
        createdAt: Date;
    };
    userId: string;
};

export default function SourceItem({ source, userId }: SourceItemProps) {
    return (
        <li className="rounded-md border p-3 flex items-center justify-between bg-gray-100 dark:bg-zinc-900">
            <div className="flex items-center gap-3">
                <SocialIcon
                    network={source.platform.toLowerCase()}
                    style={{ width: 32, height: 32 }}
                />
                <div>
                    <div className="font-semibold">{source.platform}</div>
                    <a
                        href={
                            source.page.startsWith("http") ? source.page : `https://${source.page}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                        {source.page}
                    </a>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                    {new Date(source.createdAt).toLocaleDateString()}
                </span>
                <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                        <div className="p-2 hover:bg-gray-100 rounded-full transition-colors dark:hover:bg-gray-700">
                            <MoreVertical className="h-4 w-4 text-gray-500" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => {
                                // TODO: Implement edit functionality
                                console.log("Edit", source.id);
                            }}
                        >
                            <Pencil className="h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                            onClick={async () => {
                                await deleteClipSource(source.id, userId);
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </li>
    );
}
