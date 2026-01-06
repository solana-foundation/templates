"use client";

import React, { useState } from "react";
import { DEFAULT_BASE_SIZE, DEFAULT_MARKET_INDEX } from "@/lib/drift";
import type { DriftTransactionState } from "@/types/drift";

interface PositionFormProps {
  isInitialized: boolean;
  isLoading: boolean;
  onOpenPosition: (params: {
    direction: "long" | "short";
    marketIndex: number;
    baseAmount: string;
  }) => void;
  txState: DriftTransactionState;
}

export function PositionForm({
  isInitialized,
  isLoading,
  onOpenPosition,
  txState,
}: PositionFormProps) {
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [baseAmount, setBaseAmount] = useState(DEFAULT_BASE_SIZE);

  const isBusy =
    isLoading || txState.status === "pending" || txState.status === "signing";

  return (
    <section className="glass-panel fade-in rounded-[var(--radius)] p-6">
      <div className="flex flex-col gap-5">
        <div>
          <p className="mono-label">Trade</p>
          <h2 className="section-title">Open a simple position</h2>
          <p className="mt-2 text-sm text-muted">
            This demo places a market order on Drift devnet and confirms the
            transaction before updating state.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Direction
            <select
              className="rounded-2xl border border-border-low bg-card px-3 py-2 text-sm"
              value={direction}
              onChange={(event) =>
                setDirection(event.target.value as "long" | "short")
              }
            >
              <option value="long">Long</option>
              <option value="short">Short</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Base Size
            <input
              type="number"
              min={0}
              step={0.01}
              className="rounded-2xl border border-border-low bg-card px-3 py-2 text-sm"
              value={baseAmount}
              onChange={(event) => setBaseAmount(event.target.value)}
            />
          </label>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-60"
          onClick={() =>
            onOpenPosition({
              direction,
              marketIndex: DEFAULT_MARKET_INDEX,
              baseAmount,
            })
          }
          disabled={!isInitialized || isBusy}
        >
          {isInitialized ? "Open Position" : "Initialize account first"}
        </button>

        {txState.action === "open" && txState.status !== "idle" ? (
          <div className="rounded-2xl border border-border-low bg-card/70 px-4 py-3 text-sm text-muted">
            {txState.status === "signing" && "Waiting for wallet signature..."}
            {txState.status === "pending" &&
              "Transaction submitted. Confirming on-chain..."}
            {txState.status === "confirmed" && "Position opened successfully."}
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
