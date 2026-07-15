"use client";

import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { useCluster } from "../cluster-context";
import { AirdropCard } from "./airdrop-card";
import { TransferSolCard } from "./transfer-sol-card";
import { TokenCard } from "./token-card";
import { MemoCard } from "./memo-card";

export function ActionsPanel() {
  const connected = useConnectedWallet();
  const { cluster } = useCluster();

  if (!connected) {
    return (
      <div className="mt-8 rounded-2xl border border-border-low bg-card p-6 text-sm text-muted">
        Connect a wallet to try the on-chain actions.
      </div>
    );
  }

  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-2">
      {cluster !== "mainnet" && <AirdropCard />}
      <TransferSolCard />
      <MemoCard />
      <TokenCard key={cluster} />
    </section>
  );
}
