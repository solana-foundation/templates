"use client";

import { useState } from "react";
import { address, lamports } from "@solana/kit";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { toast } from "sonner";
import { useAppClient } from "../../lib/client-provider";

export function AirdropCard() {
  const client = useAppClient();
  const connected = useConnectedWallet();
  const [busy, setBusy] = useState(false);

  const handleAirdrop = async () => {
    if (!connected) return;
    setBusy(true);
    try {
      await client.airdrop(
        address(connected.account.address),
        lamports(1_000_000_000n)
      );
      toast.success("Airdropped 1 SOL");
    } catch (err) {
      console.error(err);
      toast.error(
        "Airdrop failed. Public faucets are rate-limited — try faucet.solana.com."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border-low bg-card p-6">
      <h2 className="text-sm font-semibold">Fund wallet</h2>
      <p className="mt-1 text-xs text-muted">
        Request 1 SOL from the faucet so you can try the actions below.
      </p>
      <button
        onClick={handleAirdrop}
        disabled={busy}
        className="mt-4 w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
      >
        {busy ? "Requesting..." : "Airdrop 1 SOL"}
      </button>
    </div>
  );
}
