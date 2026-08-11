"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { toast } from "sonner";
import { useAppClient } from "../../lib/client-provider";
import { useCluster } from "../cluster-context";
import { loadRampsSdk } from "../../lib/moneygram/load-sdk";
import type { RampsInstance, SessionResponse } from "../../lib/moneygram/types";

export function CashInCard() {
  const client = useAppClient();
  const connected = useConnectedWallet(client);
  const { cluster } = useCluster();

  const containerRef = useRef<HTMLDivElement>(null);
  const rampsRef = useRef<RampsInstance | null>(null);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const walletAddress = connected?.account.address;
  // Sandbox keys run on devnet — the demo only makes sense there.
  const wrongNetwork = cluster !== "devnet";

  const closeWidget = useCallback(() => {
    rampsRef.current?.destroy();
    rampsRef.current = null;
    setActive(false);
  }, []);

  useEffect(() => () => rampsRef.current?.destroy(), []);

  async function openWidget() {
    if (!walletAddress || !containerRef.current) return;
    setLoading(true);
    try {
      const createRamps = await loadRampsSdk();

      const res = await fetch("/api/moneygram-session", { method: "POST" });
      const session: SessionResponse & { error?: string } = await res.json();
      if (!res.ok)
        throw new Error(session.error ?? `Session failed: ${res.status}`);

      const widgetUrl = new URL(session.widgetUrl);
      widgetUrl.searchParams.set("mode", "on-ramp");

      const ramps = createRamps({
        container: containerRef.current,
        sessionToken: session.sessionToken,
        widgetUrl: widgetUrl.toString(),
        theme: "dark",
        wallet: {
          address: walletAddress,
          chain: "solana",
          asset: "USDC",
          walletType: "non-custodial",
          displayName: "Kit Demo Wallet",
        },
        transaction: { type: "on-ramp", asset: "USDC" },

        // No onSignTransaction — the standard cash-in path never asks the app
        // to sign. The user deposits cash at the counter and MoneyGram delivers
        // USDC to walletAddress after processing the deposit.

        onComplete: (record) => {
          console.info("[MoneyGram] transaction complete", record);
          toast.success(
            record.referenceNumber
              ? `Counter confirmation code: ${record.referenceNumber}`
              : "Cash-in started — head to the location",
            { description: `Transaction ID: ${record.id}` }
          );
        },
        onError: (error) => toast.error(error.reason),
        onClose: closeWidget,
      });

      rampsRef.current = ramps;
      ramps.open();
      setActive(true);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not open MoneyGram"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border-low bg-card p-6">
      <h2 className="text-sm font-semibold">Cash in via MoneyGram</h2>
      <p className="mt-1 text-xs text-muted">
        Opens the widget in <code className="font-mono">on-ramp</code> mode. The
        user picks a location, deposits cash, and gets a counter confirmation
        code. No signing — MoneyGram delivers USDC to the connected wallet.
      </p>

      {wrongNetwork ? (
        <p className="mt-4 rounded-lg border border-border-low bg-cream/50 px-3 py-2 text-xs text-muted">
          Switch the network selector to <strong>devnet</strong> — MoneyGram
          sandbox keys run on devnet.
        </p>
      ) : (
        <button
          onClick={openWidget}
          disabled={loading || !walletAddress}
          className="mt-4 w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? "Opening..." : "Cash in USDC"}
        </button>
      )}

      <div
        className={
          active
            ? "fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur"
            : "hidden"
        }
      >
        <div className="flex items-center justify-between border-b border-border-low px-4 py-3">
          <span className="text-sm font-semibold">MoneyGram</span>
          <button
            onClick={closeWidget}
            className="cursor-pointer rounded-lg border border-border-low bg-card px-3 py-1.5 text-xs font-medium transition hover:bg-cream"
          >
            Close
          </button>
        </div>
        <div ref={containerRef} className="flex-1" />
      </div>
    </div>
  );
}
