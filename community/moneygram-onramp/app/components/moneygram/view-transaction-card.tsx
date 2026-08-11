"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { toast } from "sonner";
import { useAppClient } from "../../lib/client-provider";
import { loadRampsSdk } from "../../lib/moneygram/load-sdk";
import type { RampsInstance, SessionResponse } from "../../lib/moneygram/types";

export function ViewTransactionCard() {
  const client = useAppClient();
  const connected = useConnectedWallet(client);

  const containerRef = useRef<HTMLDivElement>(null);
  const rampsRef = useRef<RampsInstance | null>(null);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [txId, setTxId] = useState("");

  const walletAddress = connected?.account.address;

  const closeWidget = useCallback(() => {
    rampsRef.current?.destroy();
    rampsRef.current = null;
    setActive(false);
  }, []);

  useEffect(() => () => rampsRef.current?.destroy(), []);

  async function openWidget() {
    const id = txId.trim();
    if (!id || !containerRef.current) return;
    setLoading(true);
    try {
      const createRamps = await loadRampsSdk();

      const res = await fetch("/api/moneygram-session", { method: "POST" });
      const session: SessionResponse & { error?: string } = await res.json();
      if (!res.ok)
        throw new Error(session.error ?? `Session failed: ${res.status}`);

      const ramps = createRamps({
        container: containerRef.current,
        sessionToken: session.sessionToken,
        widgetUrl: session.widgetUrl,
        theme: "dark",
        ...(walletAddress
          ? {
              wallet: {
                address: walletAddress,
                chain: "solana",
                asset: "USDC",
                walletType: "non-custodial",
                displayName: "Kit Demo Wallet",
              },
            }
          : {}),
        // View mode: the widget fetches current status, pickup instructions, and
        // handles refunds entirely on its own — no signing or callbacks needed.
        viewTransaction: { id },
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
      <h2 className="text-sm font-semibold">View transaction status</h2>
      <p className="mt-1 text-xs text-muted">
        Reopen an existing transaction with{" "}
        <code className="font-mono">viewTransaction.id</code> to check status,
        pickup instructions, and refunds — all rendered by the widget. Use the{" "}
        <code className="font-mono">id</code> from an{" "}
        <code className="font-mono">onComplete</code> record.
      </p>

      <div className="mt-4 space-y-3">
        <input
          value={txId}
          onChange={(e) => setTxId(e.target.value)}
          placeholder="Transaction ID"
          className="w-full rounded-lg border border-border-low bg-background px-3 py-2 font-mono text-xs outline-none focus:border-ring"
        />
        <button
          onClick={openWidget}
          disabled={loading || !txId.trim()}
          className="w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? "Opening..." : "View status"}
        </button>
      </div>

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
