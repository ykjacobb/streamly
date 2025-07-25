"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "better-auth";
import { 
  LayoutDashboard, 
  Library, 
  LogOut, 
  Settings, 
  User as UserIcon,
  Bell
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/login");
    } else if (session?.user) {
      setUser(session.user);
    }
  }, [isPending, session, router]);

  const handleSignOut = async () => {
    await authClient.signOut({
      query: {
        redirectTo: "/auth/login"
      }
    });
    router.push("/auth/login");
  };

  if (isPending || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                Real Kit
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
              <button 
                onClick={handleSignOut}
                className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 mt-16 h-screen w-64 border-r border-gray-200 bg-white pt-6 transition-transform dark:border-gray-700 dark:bg-gray-800">
        <div className="h-full overflow-y-auto px-3">
          <div className="mb-6 flex flex-col items-center">
            <div className="relative h-20 w-20 overflow-hidden rounded-full">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-blue-100 dark:bg-blue-900">
                  <UserIcon className="h-10 w-10 text-blue-600 dark:text-blue-300" />
                </div>
              )}
            </div>
            <h2 className="mt-4 text-xl font-semibold dark:text-white">{user.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>

          <ul className="space-y-2">
            <li>
              <a
                href="/dashboard"
                className="flex items-center rounded-lg bg-gray-100 p-2 text-gray-900 dark:bg-gray-700 dark:text-white"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="ml-3">Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="/library"
                className="flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                <Library className="h-5 w-5" />
                <span className="ml-3">Library</span>
              </a>
            </li>
            <li>
              <a
                href="/settings"
                className="flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                <Settings className="h-5 w-5" />
                <span className="ml-3">Settings</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="mt-16 p-4 sm:ml-64">
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 dark:border-gray-700">
          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Stats Cards */}
            <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                  <LayoutDashboard className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Projects</h3>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">12</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-100 p-2 dark:bg-green-900">
                  <Library className="h-4 w-4 text-green-600 dark:text-green-300" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Library Items</h3>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">48</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
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
                        <Settings className="h-4 w-4 text-blue-600 dark:text-blue-300" />
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
      </div>
    </div>
  );
}
