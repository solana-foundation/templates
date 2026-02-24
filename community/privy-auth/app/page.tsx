"use client";

import { LoginButton } from "@/components/auth/login-button";
import { UserProfile } from "@/components/auth/user-profile";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";

export default function Home() {
  const { ready, authenticated } = usePrivy();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex min-h-screen items-center justify-center p-6">
        <main className="flex w-full max-w-2xl flex-col items-center gap-8">
          {/* Header */}
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              Community Template
            </div>
            <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl">
              Privy Auth
            </h1>
            <p className="mx-auto max-w-xl text-lg text-gray-600 dark:text-gray-400">
              Simple authentication with social logins and embedded wallets for Solana dApps
            </p>
          </div>

          {/* Auth Status */}
          {!ready && (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm dark:bg-gray-800">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-500"></div>
              <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Initializing...
              </p>
            </div>
          )}

          {ready && !authenticated && (
            <div className="w-full max-w-md space-y-6">
              <div className="rounded-xl bg-white p-8 text-center shadow-sm dark:bg-gray-800">
                <div className="mb-4 text-5xl">👋</div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome
                </h2>
                <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                  Connect with your preferred method to get started
                </p>
                <LoginButton />
              </div>

              {/* Feature Cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                  <div className="mb-3 text-3xl">🔐</div>
                  <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                    Social Login
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Email, Google, Twitter, Discord & more
                  </p>
                </div>
                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                  <div className="mb-3 text-3xl">💼</div>
                  <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                    Embedded Wallet
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Solana wallet auto-created
                  </p>
                </div>
              </div>
            </div>
          )}

          {ready && authenticated && (
            <div className="w-full space-y-6">
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl dark:bg-green-900/30">
                  ✅
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
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
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Go to Protected Dashboard
                  <span>→</span>
                </Link>
              </div>
              {/* <UserProfile /> */}
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
    </div>
  );
}
