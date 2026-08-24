"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { toast } from "sonner";
import { useAppClient } from "../../lib/client-provider";
import { useCluster } from "../cluster-context";
import { loadRampsSdk } from "../../lib/moneygram/load-sdk";
import { sendUsdc } from "../../lib/moneygram/send-usdc";
import type {
  OnChainTransaction,
  RampsInstance,
  SessionResponse,
} from "../../lib/moneygram/types";

export function CashOutCard() {
  const client = useAppClient();
  const connected = useConnectedWallet(client);
  const { cluster, getExplorerUrl } = useCluster();

  const containerRef = useRef<HTMLDivElement>(null);
  const rampsRef = useRef<RampsInstance | null>(null);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const signer = connected?.signer;
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
    if (!signer || !walletAddress || !containerRef.current) return;
    setLoading(true);
    try {
      const createRamps = await loadRampsSdk();

      const res = await fetch("/api/moneygram-session", { method: "POST" });
      const session: SessionResponse & { error?: string } = await res.json();
      if (!res.ok)
        throw new Error(session.error ?? `Session failed: ${res.status}`);

      const widgetUrl = new URL(session.widgetUrl);
      widgetUrl.searchParams.set("mode", "off-ramp");

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
        transaction: { type: "off-ramp", asset: "USDC" },

        onSignTransaction: async (tx: OnChainTransaction) => {
          if (tx.requiredNetwork === "mainnet") {
            throw new Error(
              "Widget expects mainnet, but the wallet is on devnet. Use production credentials to test mainnet."
            );
          }
          const signature = await sendUsdc(client, signer, tx);
          toast.success("USDC transfer confirmed", {
            description: (
              <a
                href={getExplorerUrl(`/tx/${signature}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                View transaction
              </a>
            ),
          });
          return signature;
        },

        onComplete: (record) => {
          console.info("[MoneyGram] transaction complete", record);
          toast.success(
            record.referenceNumber
              ? `Cash pickup code: ${record.referenceNumber}`
              : "Transaction complete",
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
      <h2 className="text-sm font-semibold">Cash out via MoneyGram</h2>
      <p className="mt-1 text-xs text-muted">
        Opens the MoneyGram Ramps widget (off-ramp). When you commit,{" "}
        <code className="font-mono">onSignTransaction</code> signs a USDC
        transfer with the{" "}
        <code className="font-mono">@solana-program/token</code> kit plugin —
        one <code className="font-mono">transferToATA</code> call.
      </p>

      {wrongNetwork ? (
        <p className="mt-4 rounded-lg border border-border-low bg-cream/50 px-3 py-2 text-xs text-muted">
          Switch the network selector to <strong>devnet</strong> — MoneyGram
          sandbox keys run on devnet.
        </p>
      ) : (
        <button
          onClick={openWidget}
          disabled={loading || !signer}
          className="mt-4 w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? "Opening..." : "Cash out USDC"}
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
