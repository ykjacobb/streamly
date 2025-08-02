"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FlashSolid, CameraSolid, PlaySolid } from "iconoir-react";

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.2
        }
    }
};

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-black">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Hero Section */}
                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={stagger}
                    className="text-center space-y-8"
                >
                    <motion.div variants={fadeIn} className="space-y-4">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                            real.kit
                        </h1>
                        <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300">
                            Your all-in-one streaming toolkit
                        </p>
                    </motion.div>

                    <motion.div variants={fadeIn} className="flex justify-center gap-4">
                        <Link href="/auth/sign-up">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                                Get Started
                            </Button>
                        </Link>
                        <Link href="/auth/login">
                            <Button size="lg" variant="outline">
                                Sign In
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Features */}
                    <motion.div
                        variants={fadeIn}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="p-6 rounded-2xl bg-white dark:bg-zinc-800/50 shadow-xl"
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                                <CameraSolid className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                Clip Sources
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Manage and organize your streaming sources with ease
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="p-6 rounded-2xl bg-white dark:bg-zinc-800/50 shadow-xl"
                        >
                            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                                <PlaySolid className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                Stream Management
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Track and manage your favorite streamers in one place
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="p-6 rounded-2xl bg-white dark:bg-zinc-800/50 shadow-xl"
                        >
                            <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-4">
                                <FlashSolid className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                Quick Editor
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Edit and enhance your content with powerful tools
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Footer */}
                <motion.div
                    variants={fadeIn}
                    initial="initial"
                    animate="animate"
                    className="mt-20 text-center text-gray-600 dark:text-gray-400"
                >
                    <p className="text-sm">
                        © {new Date().getFullYear()} real.kit. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
