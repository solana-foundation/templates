"use client";

import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { useAppClient } from "../../lib/client-provider";
import { CashOutCard } from "../moneygram/cash-out-card";
import { CashInCard } from "../moneygram/cash-in-card";
import { ViewTransactionCard } from "../moneygram/view-transaction-card";

export function ActionsPanel() {
  const client = useAppClient();
  const connected = useConnectedWallet(client);

  if (!connected) {
    return (
      <div className="mt-8 rounded-2xl border border-border-low bg-card p-6 text-sm text-muted">
        Connect a wallet to try the on-chain actions.
      </div>
    );
  }

  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-2">
      <CashInCard />
      <CashOutCard />
      <ViewTransactionCard />
    </section>
  );
}
