"use client";

import React, { useState } from "react";
import { WalletButton } from "@/components/solana/solana-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SwapCard } from "@/components/swap/swap-card";
import { PoolInfoCard } from "@/components/swap/pool-info-card";
import { usePool } from "@/hooks/use-pool";

export default function Page() {
  const { pool, bundle, isLoading, error, refresh } = usePool();
  const [amountIn, setAmountIn] = useState("");

  return (
    <>
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <span className="text-sm font-semibold tracking-tight">
          Raydium Hello World
        </span>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <WalletButton />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-16">
        <section className="pt-6 pb-20 md:pt-8 md:pb-24">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <h1 className="font-black tracking-tight text-foreground">
              <span className="block text-7xl md:text-8xl">Raydium</span>
              <span className="block text-5xl md:text-6xl">Hello World</span>
            </h1>
            <div className="flex max-w-lg flex-col gap-3">
              <p className="text-base leading-relaxed text-foreground/50">
                Swap on a Raydium CPMM pool, end to end. This template reads
                pool reserves straight from the RPC, quotes locally with the
                same constant-product math the on-chain program runs, and
                executes the swap through your connected wallet on devnet.
              </p>
              <a
                href="https://docs.raydium.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-foreground/70 underline underline-offset-4 transition-colors hover:text-foreground"
              >
                Raydium developer docs
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </section>

        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
          <PoolInfoCard
            pool={pool}
            isLoading={isLoading}
            error={error}
            onRetry={() => void refresh()}
          />
          <SwapCard
            bundle={bundle}
            amountIn={amountIn}
            onAmountInChange={setAmountIn}
            onSwapConfirmed={() => void refresh()}
          />
        </div>

        <footer className="pt-10 text-center text-xs text-muted">
          Built with{" "}
          <a
            className="underline underline-offset-2"
            href="https://github.com/solana-foundation/templates"
          >
            create-solana-dapp
          </a>
        </footer>
      </main>
    </>
  );
}
