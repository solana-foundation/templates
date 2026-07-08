"use client";
import { useEffect, useState } from "react";

type Health = {
  available: boolean;
  backend: string;
  address?: string;
  error?: string;
};

type SignResult = {
  address?: string;
  signature?: string;
  transaction?: string;
  error?: string;
};

async function fetchHealth(): Promise<Health> {
  return (await fetch("/api/health")).json();
}

export default function Home() {
  const [health, setHealth] = useState<Health | null>(null);
  const [message, setMessage] = useState("hello solana");
  const [messageResult, setMessageResult] = useState<SignResult | null>(null);
  const [wireTransaction, setWireTransaction] = useState("");
  const [transactionResult, setTransactionResult] = useState<SignResult | null>(
    null
  );
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchHealth().then((data) => {
      if (!cancelled) setHealth(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function refreshHealth() {
    setBusy("health");
    try {
      setHealth(await fetchHealth());
    } finally {
      setBusy(null);
    }
  }

  async function signMessage() {
    setBusy("message");
    try {
      const res = await fetch("/api/sign/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      setMessageResult(await res.json());
    } finally {
      setBusy(null);
    }
  }

  async function signTransaction() {
    setBusy("transaction");
    try {
      const res = await fetch("/api/sign/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction: wireTransaction }),
      });
      setTransactionResult(await res.json());
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-bg1 text-foreground">
      <main className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col gap-10 border-x border-border-low px-6 py-16">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">
            Solana keychain starter
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Server-side signing, pluggable key backends
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-muted">
            The signer lives in Next.js API routes powered by{" "}
            <code className="font-mono">@solana/keychain</code> — the private
            key never reaches the browser. Switch between a local keypair, cloud
            KMS, MPC custody, or wallet APIs by changing{" "}
            <code className="font-mono">KEYCHAIN_BACKEND</code> in your
            environment. See <code className="font-mono">.env.example</code> for
            every backend&apos;s variables.
          </p>
        </header>

        <section className="w-full max-w-3xl space-y-4 rounded-2xl border border-border-low bg-card p-6 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.35)]">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-lg font-semibold">Signer</p>
              <p className="text-sm text-muted">
                Served by <code className="font-mono">GET /api/health</code>{" "}
                using the signer&apos;s{" "}
                <code className="font-mono">isAvailable()</code> check.
              </p>
            </div>
            <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground/80">
              {health === null
                ? "Loading…"
                : health.available
                  ? `${health.backend} · available`
                  : `${health.backend} · unavailable`}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="break-all rounded-lg border border-border-low bg-cream px-3 py-2 font-mono text-xs">
              {health?.address ?? health?.error ?? "—"}
            </span>
            <button
              onClick={() => void refreshHealth()}
              disabled={busy !== null}
              className="inline-flex items-center gap-2 rounded-lg border border-border-low bg-card px-3 py-2 font-medium transition hover:-translate-y-0.5 hover:shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              Refresh
            </button>
          </div>
        </section>

        <section className="w-full max-w-3xl space-y-4 rounded-2xl border border-border-low bg-card p-6 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.35)]">
          <div className="space-y-1">
            <p className="text-lg font-semibold">Sign a message</p>
            <p className="text-sm text-muted">
              Posts to <code className="font-mono">POST /api/sign/message</code>{" "}
              and returns a base58 Ed25519 signature.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Message to sign"
              className="min-w-0 flex-1 rounded-lg border border-border-low bg-cream px-3 py-2 font-mono text-sm outline-none"
            />
            <button
              onClick={() => void signMessage()}
              disabled={busy !== null || message.length === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-border-low bg-card px-3 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy === "message" ? "Signing…" : "Sign"}
            </button>
          </div>
          {messageResult && (
            <p className="break-all rounded-lg border border-border-low bg-cream px-3 py-2 font-mono text-xs">
              {messageResult.signature ?? messageResult.error}
            </p>
          )}
        </section>

        <section className="w-full max-w-3xl space-y-4 rounded-2xl border border-border-low bg-card p-6 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.35)]">
          <div className="space-y-1">
            <p className="text-lg font-semibold">Co-sign a transaction</p>
            <p className="text-sm text-muted">
              Paste a base64-encoded wire transaction;{" "}
              <code className="font-mono">POST /api/sign/transaction</code> adds
              this signer&apos;s signature and returns the signed wire
              transaction. Nothing is submitted to the network.
            </p>
          </div>
          <textarea
            value={wireTransaction}
            onChange={(event) => setWireTransaction(event.target.value)}
            placeholder="Base64 wire transaction"
            rows={4}
            className="w-full rounded-lg border border-border-low bg-cream px-3 py-2 font-mono text-xs outline-none"
          />
          <button
            onClick={() => void signTransaction()}
            disabled={busy !== null || wireTransaction.length === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-border-low bg-card px-3 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy === "transaction" ? "Signing…" : "Co-sign"}
          </button>
          {transactionResult && (
            <div className="space-y-2">
              <p className="break-all rounded-lg border border-border-low bg-cream px-3 py-2 font-mono text-xs">
                {transactionResult.signature ?? transactionResult.error}
              </p>
              {transactionResult.transaction && (
                <p className="break-all rounded-lg border border-border-low bg-cream px-3 py-2 font-mono text-xs">
                  {transactionResult.transaction}
                </p>
              )}
            </div>
          )}
        </section>

        <footer className="text-sm text-muted">
          Built on{" "}
          <a
            className="font-medium underline underline-offset-2"
            href="https://github.com/solana-foundation/solana-keychain"
            target="_blank"
            rel="noreferrer"
          >
            @solana/keychain
          </a>{" "}
          — the same signer plugs into any{" "}
          <code className="font-mono">@solana/kit</code> transaction pipeline.
        </footer>
      </main>
    </div>
  );
}
