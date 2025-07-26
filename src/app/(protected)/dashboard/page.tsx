"use client";

import { LayoutDashboard, Library } from "lucide-react";

export default function Dashboard() {
    return (
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 dark:border-gray-700">
            <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Stats Cards */}
                <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                    <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                            <LayoutDashboard className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Total Projects
                            </h3>
                            <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                12
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                    <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-green-100 p-2 dark:bg-green-900">
                            <Library className="h-4 w-4 text-green-600 dark:text-green-300" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Library Items
                            </h3>
                            <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                48
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Activity
                </h2>
                <div className="flow-root">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        <li className="py-3">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="h-8 w-8 rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                                        <Library className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                                    </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Added new item to library
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        2 hours ago
                                    </p>
                                </div>
                            </div>
                        </li>
                        <li className="py-3">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                                        <LayoutDashboard className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                                    </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Updated profile settings
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        1 day ago
                                    </p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
