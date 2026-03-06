"use client";

import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import Image from "next/image";
import type { AuthenticationStatus } from "@/types/privy";

export default function Home() {
  const { login, logout, authenticated, ready, user } = usePrivy();

  const authStatus: AuthenticationStatus = !ready
    ? "loading"
    : authenticated
    ? "authenticated"
    : "unauthenticated";

  const getLinkedAccounts = () => {
    const accounts = [];
    if (user?.google) accounts.push({ type: "Google", email: user.google.email });
    if (user?.discord) accounts.push({ type: "Discord", username: user.discord.username });
    if (user?.twitter) accounts.push({ type: "Twitter", username: user.twitter.username });
    if (user?.email) accounts.push({ type: "Email", email: user.email.address });
    return accounts;
  };

  const getSolanaWallet = () => {
    return user?.linkedAccounts?.find(
      (account) => account.type === "wallet" && account.chainType === "solana"
    );
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Image src="/privy.png" alt="Privy" width={40} height={40} />
              <span className="text-2xl font-bold text-black">×</span>
              <Image src="/solana-logo.svg" alt="Solana" width={32} height={32} />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                authStatus === "loading"
                  ? "bg-amber-100 text-amber-800"
                  : authStatus === "authenticated"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {authStatus === "loading" ? "Loading..." : authStatus === "authenticated" ? "Authenticated" : "Not Authenticated"}
            </span>
          </div>
        </div>

        <div className="text-center space-y-4 py-8">
          <h1 className="text-5xl font-bold text-black tracking-tight">
            Privy + Solana Auth
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Social login with embedded Solana wallets. Sign in with Google, Discord, or Twitter.
          </p>
        </div>

        {authStatus === "loading" && (
          <div className="text-center text-gray-500 py-8">
            <div className="inline-block animate-pulse">Initializing Privy...</div>
          </div>
        )}

        {authStatus === "unauthenticated" && (
          <div className="max-w-md mx-auto space-y-6 text-center">
            <p className="text-gray-700">
              Sign in to get started. An embedded Solana wallet will be created automatically for you.
            </p>
            <button
              onClick={login}
              className="w-full px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Login with Privy
            </button>
            <p className="text-sm text-gray-500">
              Supports Google, Discord, and Twitter
            </p>
          </div>
        )}

        {authStatus === "authenticated" && user && (
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="border border-gray-200 rounded-2xl p-8 space-y-6 bg-white shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-black">User Profile</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">User ID</div>
                    <div className="font-mono text-sm text-gray-800">{user.id}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Created</div>
                    <div className="text-sm text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Linked Accounts</div>
                    <div className="space-y-2">
                      {getLinkedAccounts().map((account, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                          <span className="font-semibold text-black">{account.type}:</span>
                          <span className="text-gray-700">{account.email || account.username}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {getSolanaWallet() && (
                <div className="border border-purple-200 rounded-2xl p-8 space-y-6 bg-gradient-to-br from-purple-50 to-pink-50 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Image src="/solana-logo.svg" alt="Solana" width={40} height={40} />
                    <h2 className="text-2xl font-bold text-black">Solana Wallet</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Address</div>
                      <div className="font-mono text-xs break-all text-gray-800 bg-white/60 p-3 rounded-lg">
                        {getSolanaWallet()?.address}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Type</div>
                        <div className="text-sm text-gray-800">
                          {getSolanaWallet()?.walletClientType === "privy" ? "Embedded" : getSolanaWallet()?.walletClientType}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Chain</div>
                        <div className="text-sm text-gray-800">Solana</div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Source</div>
                        <div className="text-sm text-gray-800">{getSolanaWallet()?.imported ? "Imported" : "Created by Privy"}</div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Custodial</div>
                        <div className="text-sm text-gray-800">Non-custodial</div>
                      </div>
                    </div>

                    <div className="bg-white/60 border border-purple-200 rounded-lg p-3">
                      <p className="text-xs text-gray-700">
                        This wallet is controlled by you and secured by Privy's infrastructure
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 justify-center pt-4">
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                Go to Dashboard →
              </Link>

              <button
                onClick={logout}
                className="px-8 py-4 border-2 border-gray-300 text-black rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}