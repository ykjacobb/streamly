import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Real Kit",
    description: "Real Kit - Your Real-Time Clip Management Tool"
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
        >
            <body className={`${inter.className} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    {/* Theme toggle moved to settings page */}
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
