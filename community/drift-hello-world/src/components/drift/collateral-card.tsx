"use client";

import React, { useState } from "react";
import { DEFAULT_SOL_DEPOSIT } from "@/lib/drift";
import type { DriftTransactionState } from "@/types/drift";

interface CollateralCardProps {
  isInitialized: boolean;
  isLoading: boolean;
  onDeposit: (amount: string) => void;
  txState: DriftTransactionState;
}

export function CollateralCard({
  isInitialized,
  isLoading,
  onDeposit,
  txState,
}: CollateralCardProps) {
  const [amount, setAmount] = useState(DEFAULT_SOL_DEPOSIT);
  const isBusy =
    isLoading || txState.status === "pending" || txState.status === "signing";

  return (
    <section className="glass-panel fade-in rounded-[var(--radius)] p-6">
      <div className="flex flex-col gap-4">
        <div>
          <p className="mono-label">Collateral</p>
          <h2 className="section-title">Deposit SOL for margin</h2>
          <p className="mt-2 text-sm text-muted">
            Drift devnet supports SOL collateral. This wraps SOL into wSOL and
            deposits it into your account.
          </p>
        </div>
        <label className="flex flex-col gap-2 text-sm font-medium">
          SOL Amount
          <input
            type="number"
            min={0}
            step={0.01}
            className="rounded-2xl border border-border-low bg-card px-3 py-2 text-sm"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-60"
          onClick={() => onDeposit(amount)}
          disabled={!isInitialized || isBusy}
        >
          {isInitialized
            ? "Deposit SOL collateral"
            : "Initialize account first"}
        </button>
        {txState.action === "deposit" && txState.status !== "idle" ? (
          <div className="rounded-2xl border border-border-low bg-card/70 px-4 py-3 text-sm text-muted">
            {txState.status === "signing" && "Waiting for wallet signature..."}
            {txState.status === "pending" &&
              "Depositing collateral on-chain..."}
            {txState.status === "confirmed" && "Collateral deposited."}
            {txState.status === "error" && txState.error}
            {txState.signature ? (
              <p className="mt-2 break-all font-mono text-xs text-foreground">
                {txState.signature}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
