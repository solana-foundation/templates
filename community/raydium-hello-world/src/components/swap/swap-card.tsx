"use client";

import React from "react";

type SwapCardProps = {
  connected: boolean;
  amountIn: string;
  onAmountInChange: (value: string) => void;
};

/**
 * The swap form: amount in → quoted amount out → execute.
 *
 * TODO(raydium): this is a static skeleton. The integration work happens in
 * three places:
 *   1. `src/hooks/use-pool.ts`  — fetch pool info from the SDK
 *   2. `src/lib/raydium.ts`     — quote (CurveCalculator) + build/execute swap
 *   3. this component           — replace the placeholder quote + wire onSwap
 */
export function SwapCard({
  connected,
  amountIn,
  onAmountInChange,
}: SwapCardProps) {
  const quoteOut: string | null = null; // TODO(raydium): compute via CurveCalculator

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-neutral-800 p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">
        Swap
      </h2>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-neutral-500">You pay (SOL)</span>
        <input
          className="rounded-lg border border-neutral-700 bg-transparent px-3 py-2 font-mono outline-none focus:border-neutral-400"
          inputMode="decimal"
          placeholder="0.0"
          value={amountIn}
          onChange={(e) => onAmountInChange(e.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-neutral-500">You receive (estimated)</span>
        <output className="rounded-lg border border-neutral-800 bg-neutral-900/40 px-3 py-2 font-mono text-neutral-400">
          {quoteOut ?? "—"}
        </output>
      </label>

      <button
        type="button"
        disabled
        className="mt-1 rounded-lg bg-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-300 disabled:cursor-not-allowed disabled:opacity-60"
        // TODO(raydium): enable when connected && quote is ready, call executeSwap()
      >
        {connected ? "Swap (not wired yet)" : "Connect a wallet to swap"}
      </button>

      <p className="text-xs text-neutral-500">
        Executes on devnet. Get devnet SOL at{" "}
        <a className="underline" href="https://faucet.solana.com">
          faucet.solana.com
        </a>
        .
      </p>
    </section>
  );
}
