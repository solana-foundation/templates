"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { LogoutButton } from "./logout-button";

// Extended wallet type with chainType
interface WalletWithChain {
  address: string;
  walletClientType: string;
  chainType?: string;
}

// Extended user type with wallet property
interface UserWithWallet {
  wallet?: {
    address: string;
  };
}

export function UserProfile() {
  const { ready, authenticated, user } = usePrivy();
  const { wallets, ready: walletsReady } = useWallets();

  if (!ready || !authenticated || !user) {
    return null;
  }

  // Access Solana wallet directly from user object
  const solanaWallet = (user as UserWithWallet).wallet?.address ? (user as UserWithWallet).wallet : null;
  
  // Combine Solana wallet from user object with wallets from useWallets
  const allWallets = [
    ...(solanaWallet ? [{
      address: solanaWallet.address,
      walletClientType: 'privy',
      chainType: 'solana',
      type: 'solana'
    }] : []),
    ...wallets
  ];
  
  // Find linked social accounts
  const googleAccount = user.google;
  const twitterAccount = user.twitter;
  const discordAccount = user.discord;
  const emailAccount = user.email;

  return (
    <div className="w-full max-w-4xl rounded-xl bg-white p-8 shadow-sm dark:bg-gray-800">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            User Profile
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Your account information and connected wallets
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="space-y-6">
        {/* User ID */}
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              User ID
            </p>
          </div>
          <p className="font-mono text-sm text-gray-900 break-all dark:text-gray-100">
            {user.id}
          </p>
        </div>

        {/* Email */}
        {emailAccount && (
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Email
              </p>
            </div>
            <p className="text-sm text-gray-900 dark:text-gray-100">
              {emailAccount.address}
            </p>
          </div>
        )}

        {/* Social Accounts */}
        {(googleAccount || twitterAccount || discordAccount) && (
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Connected Accounts
              </p>
            </div>
            <div className="space-y-3">
              {googleAccount && (
                <div className="flex items-center gap-3 rounded-lg bg-white p-3 dark:bg-gray-600">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">G</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Google</p>
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-100">
                      {googleAccount.email}
                    </p>
                  </div>
                </div>
              )}
              {twitterAccount && (
                <div className="flex items-center gap-3 rounded-lg bg-white p-3 dark:bg-gray-600">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">𝕏</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Twitter</p>
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-100">
                      @{twitterAccount.username}
                    </p>
                  </div>
                </div>
              )}
              {discordAccount && (
                <div className="flex items-center gap-3 rounded-lg bg-white p-3 dark:bg-gray-600">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">D</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Discord</p>
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-100">
                      {discordAccount.username}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Solana Embedded Wallet */}
        {solanaWallet && (
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-center gap-2 mb-2">
              <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Solana Embedded Wallet
              </p>
            </div>
            <p className="break-all font-mono text-sm text-gray-900 dark:text-gray-100">
              {solanaWallet.address}
            </p>
            <div className="mt-3 flex gap-2">
              <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                Solana
              </span>
              <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                Embedded
              </span>
            </div>
          </div>
        )}

        {/* All Wallets */}
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                All Connected Wallets
              </p>
            </div>
            {walletsReady && (
              <span className="inline-flex items-center justify-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {allWallets.length}
              </span>
            )}
          </div>

          {!walletsReady ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-500"></div>
            </div>
          ) : allWallets.length > 0 ? (
            <div className="space-y-3">
              {allWallets.map((wallet, index) => {
                const walletWithChain = wallet as WalletWithChain & { type?: string };
                const isSolana = walletWithChain.type === 'solana' || walletWithChain.chainType === 'solana';
                const isEthereum = walletWithChain.type === 'ethereum';
                
                return (
                  <div
                    key={wallet.address}
                    className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-600"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                            Wallet {index + 1}
                          </p>
                          {isSolana && (
                            <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                              Solana
                            </span>
                          )}
                          {isEthereum && (
                            <span className="inline-block rounded-full bg-gray-200 px-2 py-0.5 text-xs font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                              Ethereum
                            </span>
                          )}
                        </div>
                        <p className="break-all font-mono text-xs text-gray-900 dark:text-gray-100">
                          {wallet.address}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Type: {wallet.walletClientType}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-yellow-300 bg-yellow-50 p-6 text-center dark:border-yellow-700 dark:bg-yellow-900/20">
              <svg className="mx-auto h-10 w-10 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="mt-3 text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                No Wallets Found
              </p>
              <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
                Try logging out and logging back in to trigger embedded wallet creation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
