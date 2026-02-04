"use client";

import React from "react";
import { WalletCard } from "@/components/drift/wallet-card";
import { CollateralCard } from "@/components/drift/collateral-card";
import { PositionForm } from "@/components/drift/position-form";
import { PositionStatus } from "@/components/drift/position-status";
import { useDrift } from "@/hooks/use-drift";

export default function Page() {
  const {
    isInitialized,
    isLoading,
    positionView,
    txState,
    initializeUserAccount,
    depositSolCollateral,
    openPosition,
  } = useDrift();

  let initMessage: string | null = null;
  if (txState.action === "init") {
    switch (txState.status) {
      case "signing":
        initMessage = "Waiting for wallet signature...";
        break;
      case "pending":
        initMessage = "Creating Drift account on-chain...";
        break;
      case "confirmed":
        initMessage = "Drift account created.";
        break;
      case "error":
        initMessage = txState.error ?? "Account initialization failed.";
        break;
      default:
        initMessage = null;
    }
  }

  return (
    <main className="min-h-screen px-6 pb-16 pt-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="fade-in space-y-4">
          <p className="mono-label">Drift Protocol</p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Hello World for Drift on Solana
          </h1>
          <p className="max-w-2xl text-base text-muted md:text-lg">
            Connect a wallet, initialize your Drift account PDA, then open a
            simple perp position on devnet. Everything is wired with the Drift
            SDK, wallet adapter, and real transaction confirmations.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <WalletCard
            isInitialized={isInitialized}
            isLoading={isLoading}
            onInitialize={initializeUserAccount}
            txMessage={initMessage}
          />
          <CollateralCard
            isInitialized={isInitialized}
            isLoading={isLoading}
            onDeposit={depositSolCollateral}
            txState={txState}
          />
          <PositionStatus position={positionView} />
          <div className="lg:col-span-2">
            <PositionForm
              isInitialized={isInitialized}
              isLoading={isLoading}
              onOpenPosition={openPosition}
              txState={txState}
            />
          </div>
        </div>

        <section className="fade-in rounded-[var(--radius)] border border-border-low bg-card/50 px-6 py-5 text-sm text-muted">
          <p className="font-medium text-foreground">Tip</p>
          <p className="mt-2">
            Drift devnet uses real program IDs and market data. Make sure your
            wallet has devnet SOL and consider using a dedicated devnet wallet
            for testing.
          </p>
        </section>
      </div>
    </main>
  );
}
