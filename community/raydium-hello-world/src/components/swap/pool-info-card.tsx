"use client";

import React from "react";
import { usePool } from "@/hooks/use-pool";

/**
 * Displays the CPMM pool this template swaps against: token pair,
 * reserves, and current price.
 *
 * TODO(raydium): populate via the Raydium SDK — see `usePool` in
 * `src/hooks/use-pool.ts` for where the data comes from.
 */
export function PoolInfoCard() {
  const { pool, isLoading, error } = usePool();

  return (
    <section className="rounded-xl border border-neutral-800 p-4">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-400">
        Pool
      </h2>
      {error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : isLoading ? (
        <p className="text-sm text-neutral-500">Loading pool info…</p>
      ) : pool ? (
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-neutral-500">Pair</dt>
          <dd className="text-right font-mono">
            {pool.tokenASymbol} / {pool.tokenBSymbol}
          </dd>
          <dt className="text-neutral-500">Reserves</dt>
          <dd className="text-right font-mono">
            {pool.reserveA} / {pool.reserveB}
          </dd>
          <dt className="text-neutral-500">Price</dt>
          <dd className="text-right font-mono">{pool.price}</dd>
        </dl>
      ) : (
        <p className="text-sm text-neutral-500">
          No pool loaded yet. Wire up the Raydium SDK in{" "}
          <code className="font-mono">src/hooks/use-pool.ts</code>.
        </p>
      )}
    </section>
  );
}
