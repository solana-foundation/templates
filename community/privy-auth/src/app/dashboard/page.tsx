"use client";

import AuthGuard from "@/components/AuthGuard";
import AuthStatus from "@/components/AuthStatus";
import LogoutButton from "@/components/LogoutButton";
import UserProfile from "@/components/UserProfile";
import WalletInfo from "@/components/WalletInfo";
import Link from "next/link";

export default function Dashboard() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-950">
        {/* Navbar */}
        <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-solana-purple to-solana-green">
                <span className="text-sm font-bold text-white">S</span>
              </div>
              <span className="text-sm font-semibold text-white">
                Solana × Privy
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <AuthStatus />
              <LogoutButton />
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="mx-auto max-w-4xl px-4 py-8">
          <h1 className="mb-1 text-2xl font-bold text-white">Dashboard</h1>
          <p className="mb-8 text-sm text-gray-500">
            Your account overview and wallet information.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <WalletInfo />
            <UserProfile />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
