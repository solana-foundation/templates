"use client";

import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";

function truncateAddress(address: string): string {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

interface WalletBalanceProps {
  address: string;
  rpcUrl: string;
}

function WalletBalance({ address, rpcUrl }: WalletBalanceProps) {
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const connection = new Connection(rpcUrl);
    connection
      .getBalance(new PublicKey(address))
      .then((lamports) => {
        if (!cancelled) setBalance(lamports / LAMPORTS_PER_SOL);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [address, rpcUrl]);

  if (error) return <span className="text-xs text-gray-500">Balance unavailable</span>;
  if (balance === null)
    return <span className="text-xs text-gray-500">Loading balance…</span>;
  return <span className="text-xs text-gray-400">{balance.toFixed(4)} SOL</span>;
}

export default function WalletInfo() {
  const { wallets } = useSolanaWallets();
  const rpcUrl =
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
    "https://api.mainnet-beta.solana.com";

  if (wallets.length === 0) {
    return (
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
        <h3 className="mb-2 text-sm font-medium text-gray-400">
          Solana Wallets
        </h3>
        <p className="text-sm text-gray-500">No wallets found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
      <h3 className="mb-3 text-sm font-medium text-gray-400">
        Solana Wallets
      </h3>
      <ul className="space-y-3">
        {wallets.map((wallet) => (
          <li
            key={wallet.address}
            className="flex items-center justify-between rounded-md border border-gray-700/50 bg-gray-800/50 px-3 py-2"
          >
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <code className="text-sm text-white">
                  {truncateAddress(wallet.address)}
                </code>
                {wallet.walletClientType === "privy" && (
                  <span className="rounded bg-solana-purple/20 px-1.5 py-0.5 text-[10px] font-medium text-solana-purple">
                    EMBEDDED
                  </span>
                )}
              </div>
              <WalletBalance address={wallet.address} rpcUrl={rpcUrl} />
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(wallet.address)}
              className="rounded px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              title="Copy address"
            >
              Copy
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
