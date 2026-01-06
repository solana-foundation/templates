"use client";

import React from "react";
import { WalletButton } from "@/components/solana/solana-provider";

interface WalletCardProps {
  isInitialized: boolean;
  isLoading: boolean;
  onInitialize: () => void;
  txMessage?: string | null;
}

export function WalletCard({
  isInitialized,
  isLoading,
  onInitialize,
  txMessage,
}: WalletCardProps) {
  return (
    <section className="glass-panel fade-in rounded-[var(--radius)] p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mono-label">Wallet</p>
            <h2 className="section-title">Connect and initialize</h2>
          </div>
          <WalletButton />
        </div>
        <div className="rounded-2xl border border-border-low bg-card/70 px-4 py-3 text-sm text-muted">
          {isInitialized
            ? "Drift user account is ready on devnet."
            : "Create your Drift user account PDA before placing the first trade."}
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onInitialize}
          disabled={isInitialized || isLoading}
        >
          {isInitialized
            ? "Account ready"
            : isLoading
              ? "Connecting..."
              : "Initialize Drift Account"}
        </button>
        {txMessage ? (
          <div className="rounded-2xl border border-border-low bg-card/70 px-4 py-3 text-sm text-muted">
            {txMessage}
          </div>
        ) : null}
      </div>
    </section>
  );
}
