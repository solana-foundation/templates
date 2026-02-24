"use client";

import { LoginButton } from "@/components/auth/login-button";
import { UserProfile } from "@/components/auth/user-profile";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";

export default function Home() {
  const { ready, authenticated } = usePrivy();

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-6 dark:from-gray-900 dark:to-gray-800">
      <main className="flex w-full max-w-4xl flex-col items-center gap-8">
        {/* Header */}
        <div className="text-center">
          <div className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200">
            Community Template
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl">
            Privy Auth for Solana dApps
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Authenticate with social logins, create embedded wallets, and manage
            user sessions seamlessly with Privy.
          </p>
        </div>

        {/* Auth Status */}
        {!ready && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Loading Privy...
            </p>
          </div>
        )}

        {ready && !authenticated && (
          <div className="w-full max-w-md space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Welcome! 👋
              </h2>
              <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                Connect with your preferred method to get started
              </p>
              <LoginButton />
            </div>

            {/* Feature Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-2 text-2xl">🔐</div>
                <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                  Social Login
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Email, Google, Twitter, Discord
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-2 text-2xl">💼</div>
                <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                  Embedded Wallet
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Auto-created on first login
                </p>
              </div>
            </div>
          </div>
        )}

        {ready && authenticated && (
          <div className="w-full space-y-6">
            <div className="text-center">
              <div className="mb-2 text-4xl">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Successfully Authenticated
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Your profile and wallet information
              </p>
            </div>
            
            {/* Dashboard Link */}
            <div className="flex justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-700"
              >
                Go to Protected Dashboard →
              </Link>
            </div>
            <UserProfile />
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Learn more at{" "}
            <a
              href="https://docs.privy.io"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              docs.privy.io
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
