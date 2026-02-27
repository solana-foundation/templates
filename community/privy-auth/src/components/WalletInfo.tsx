"use client";

import { useWallets } from "@privy-io/react-auth/solana";
import { createSolanaRpc, address } from "@solana/kit";
import { useEffect, useState } from "react";

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

interface WalletBalanceProps {
  walletAddress: string;
  rpcUrl: string;
}

function WalletBalance({ walletAddress, rpcUrl }: WalletBalanceProps) {
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const rpc = createSolanaRpc(rpcUrl);
    rpc
      .getBalance(address(walletAddress), { commitment: "confirmed" })
      .send()
      .then((res) => {
        if (!cancelled) {
          const sol = Number(res.value) / 1e9;
          setBalance(sol);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [walletAddress, rpcUrl]);

  if (error) return <span className="text-xs text-gray-500">Balance unavailable</span>;
  if (balance === null)
    return <span className="text-xs text-gray-500">Loading balance…</span>;
  return <span className="text-xs text-gray-400">{balance.toFixed(4)} SOL</span>;
}

export default function WalletInfo() {
  const { wallets } = useWallets();
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
                {"walletClientType" in wallet && wallet.walletClientType === "privy" && (
                  <span className="rounded bg-solana-purple/20 px-1.5 py-0.5 text-[10px] font-medium text-solana-purple">
                    EMBEDDED
                  </span>
                )}
              </div>
              <WalletBalance walletAddress={wallet.address} rpcUrl={rpcUrl} />
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
