"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserProfile } from "@/components/auth/user-profile";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = usePrivy();
  const { wallets } = useWallets();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50 p-6 dark:from-gray-900 dark:to-gray-800">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ← Back to Home
              </Link>
              <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                Protected Dashboard
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                This page requires authentication
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                User ID
              </p>
              <p className="mt-2 truncate font-mono text-lg font-semibold text-gray-900 dark:text-white">
                {user?.id.slice(0, 12)}...
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Connected Wallets
              </p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {wallets.length}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="mb-8">
            <UserProfile />
          </div>

          {/* Info Panel */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="flex gap-3">
              <div className="text-2xl">🔒</div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  Protected Route Example
                </h3>
                <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                  This dashboard is wrapped in a <code className="rounded bg-blue-100 px-1 py-0.5 dark:bg-blue-800">ProtectedRoute</code> component that verifies authentication before rendering. Unauthenticated users are automatically redirected to the home page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
