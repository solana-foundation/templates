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
    <div className="w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-start justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          User Profile
        </h2>
        <LogoutButton />
      </div>

      <div className="space-y-4">
        {/* User ID */}
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            User ID
          </p>
          <p className="mt-1 font-mono text-sm text-gray-900 dark:text-gray-100">
            {user.id}
          </p>
        </div>

        {/* Email */}
        {emailAccount && (
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Email
            </p>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
              {emailAccount.address}
            </p>
          </div>
        )}

        {/* Social Accounts */}
        {(googleAccount || twitterAccount || discordAccount) && (
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Connected Accounts
            </p>
            <div className="mt-2 space-y-2">
              {googleAccount && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Google:
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {googleAccount.email}
                  </span>
                </div>
              )}
              {twitterAccount && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Twitter:
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    @{twitterAccount.username}
                  </span>
                </div>
              )}
              {discordAccount && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Discord:
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {discordAccount.username}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Solana Embedded Wallet */}
        {solanaWallet && (
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Solana Embedded Wallet
            </p>
            <p className="mt-1 break-all font-mono text-sm text-gray-900 dark:text-gray-100">
              {solanaWallet.address}
            </p>
            <div className="mt-2 flex gap-2">
              <span className="inline-block rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Solana
              </span>
              <span className="inline-block rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Embedded
              </span>
            </div>
          </div>
        )}

        {/* All Wallets */}
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Connected Wallets {walletsReady ? `(${allWallets.length})` : "(Loading...)"}
          </p>
          {!walletsReady ? (
            <div className="mt-2 rounded border border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400">Loading wallets...</p>
            </div>
          ) : allWallets.length > 0 ? (
            <div className="mt-2 space-y-2">
              {allWallets.map((wallet, index) => {
                const walletWithChain = wallet as WalletWithChain & { type?: string };
                const isSolana = walletWithChain.type === 'solana' || walletWithChain.chainType === 'solana';
                const isEthereum = walletWithChain.type === 'ethereum';
                
                return (
                  <div
                    key={wallet.address}
                    className="rounded border border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                            Wallet {index + 1}
                          </p>
                          {isSolana && (
                            <span className="inline-block rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                              Solana
                            </span>
                          )}
                          {isEthereum && (
                            <span className="inline-block rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              Ethereum
                            </span>
                          )}
                        </div>
                        <p className="mt-1 break-all font-mono text-xs text-gray-900 dark:text-gray-100">
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
            <div className="mt-2 rounded border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
              <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
                No wallets found
              </p>
              <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
                Try logging out and logging back in to trigger embedded wallet creation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
