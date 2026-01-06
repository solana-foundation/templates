"use client";

import React from "react";
import type { DriftPositionView } from "@/types/drift";

interface PositionStatusProps {
  position: DriftPositionView | null;
}

export function PositionStatus({ position }: PositionStatusProps) {
  return (
    <section className="glass-panel fade-in rounded-[var(--radius)] p-6">
      <div className="flex flex-col gap-4">
        <div>
          <p className="mono-label">Position</p>
          <h2 className="section-title">Live status</h2>
        </div>

        {position ? (
          <div className="grid gap-3 text-sm">
            <div className="flex items-center justify-between rounded-2xl border border-border-low bg-card/70 px-4 py-3">
              <span className="text-muted">Market Index</span>
              <span className="font-mono text-xs">{position.marketIndex}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-border-low bg-card/70 px-4 py-3">
              <span className="text-muted">Direction</span>
              <span className="font-semibold capitalize text-foreground">
                {position.direction}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-border-low bg-card/70 px-4 py-3">
              <span className="text-muted">Base Size</span>
              <span className="font-mono text-xs">
                {position.baseAssetAmount}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-border-low bg-card/70 px-4 py-3">
              <span className="text-muted">Quote Exposure</span>
              <span className="font-mono text-xs">
                {position.quoteAssetAmount} USDC
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border-low bg-card/60 px-4 py-6 text-sm text-muted">
            No open position yet. Initialize your account, then place a trade to
            see it here.
          </div>
        )}
      </div>
    </section>
  );
}
