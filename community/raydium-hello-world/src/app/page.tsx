"use client";

import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletButton } from "@/components/solana/solana-provider";
import { SwapCard } from "@/components/swap/swap-card";
import { PoolInfoCard } from "@/components/swap/pool-info-card";

export default function Page() {
  const { connected } = useWallet();
  const [amountIn, setAmountIn] = useState("");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-6 px-4 py-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Raydium Hello World</h1>
          <p className="text-sm text-neutral-400">
            Swap on a Raydium CPMM pool. Devnet-first.
          </p>
        </div>
        <WalletButton />
      </header>

      <PoolInfoCard />

      <SwapCard
        connected={connected}
        amountIn={amountIn}
        onAmountInChange={setAmountIn}
      />

      <footer className="text-center text-xs text-neutral-500">
        Built with{" "}
        <a
          className="underline"
          href="https://github.com/solana-foundation/templates"
        >
          create-solana-dapp
        </a>{" "}
        · Raydium docs:{" "}
        <a className="underline" href="https://docs.raydium.io/">
          docs.raydium.io
        </a>
      </footer>
    </main>
  );
}
