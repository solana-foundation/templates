"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserProfile } from "@/components/auth/user-profile";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = usePrivy();
  const { wallets } = useWallets();

  // Access Solana wallet from user object
  const solanaWallet = (user as any)?.wallet?.address;
  const totalWallets = wallets.length + (solanaWallet ? 1 : 0);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-6">
          <div className="mx-auto max-w-6xl">
            {/* Header */}
            <div className="mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </Link>
              <div className="mt-4">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Protected Dashboard
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Welcome back! This area requires authentication
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="mb-8 grid gap-6 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      User ID
                    </p>
                    <p className="mt-2 truncate font-mono text-lg font-bold text-gray-900 dark:text-white">
                      {user?.id.slice(0, 12)}...
                    </p>
                  </div>
                  <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                    <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Connected Wallets
                    </p>
                    <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
                      {totalWallets}
                    </p>
                  </div>
                  <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                    <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Status
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        Active
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                    <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* User Profile */}
            <div className="mb-8">
              <UserProfile />
            </div>

            {/* Info Panel */}
            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-2xl dark:bg-blue-900/30">
                  🔒
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Protected Route Example
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    This dashboard is wrapped in a <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm font-medium text-gray-900 dark:bg-gray-700 dark:text-gray-100">ProtectedRoute</code> component that verifies authentication before rendering. Unauthenticated users are automatically redirected to the home page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
