"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { toast } from "sonner";
import { formatAmount } from "../../lib/amount";
import { parseTransactionError } from "../../lib/errors";
import { ellipsify } from "../../lib/explorer";
import { useBalance } from "../../lib/hooks/use-balance";
import { useCluster } from "../cluster-context";

export function AccountCard() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { cluster, getExplorerUrl } = useCluster();
  const balance = useBalance(publicKey);
  const [busy, setBusy] = useState(false);

  if (!publicKey) return null;
  const address = publicKey.toBase58();

  const handleAirdrop = async () => {
    setBusy(true);
    try {
      const latest = await connection.getLatestBlockhash();
      const signature = await connection.requestAirdrop(
        publicKey,
        LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction({ signature, ...latest });
      toast.success("Airdropped 1 SOL");
    } catch (err) {
      console.error(err);
      toast.error(
        `Airdrop failed: ${parseTransactionError(err)} Public faucets are rate-limited — try faucet.solana.com.`
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border-low bg-card p-6">
      <h2 className="text-sm font-semibold">Account</h2>
      <a
        href={getExplorerUrl(`/address/${address}`)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 block font-mono text-xs text-muted underline"
        title={address}
      >
        {ellipsify(address, 6)}
      </a>
      <p className="mt-4 text-xs text-muted">Balance</p>
      <p className="text-2xl font-bold tabular-nums">
        {balance.lamports != null
          ? formatAmount(balance.lamports, 9)
          : balance.isLoading
            ? "Loading..."
            : "Unavailable"}{" "}
        {balance.lamports != null && (
          <span className="text-sm font-normal text-muted">SOL</span>
        )}
      </p>
      {balance.error && (
        <p className="mt-1 text-xs text-destructive" role="alert">
          Unable to load the wallet balance.
        </p>
      )}
      {cluster !== "mainnet" && (
        <button
          onClick={handleAirdrop}
          disabled={busy}
          className="mt-4 w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {busy ? "Requesting..." : "Airdrop 1 SOL"}
        </button>
      )}
    </div>
  );
}
