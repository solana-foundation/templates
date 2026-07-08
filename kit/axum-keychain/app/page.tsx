"use client";
import { useEffect, useState } from "react";

import { address } from "@solana/kit";

import {
  buildDemoTransaction,
  decodeSignedTransaction,
  type DecodedSignedTransaction,
} from "./lib/demo-transaction";

type SignerInfo = {
  backend: string;
  address?: string;
  available: boolean;
  error?: string;
};

type SignResult = {
  address?: string;
  signature?: string;
  transaction?: string;
  error?: string;
};

type CoSignResult = {
  decoded?: DecodedSignedTransaction;
  raw?: string;
  error?: string;
};

async function fetchSigners(): Promise<SignerInfo[]> {
  const body = await (await fetch("/api/signers")).json();
  return body.signers ?? [];
}

export default function Home() {
  const [signers, setSigners] = useState<SignerInfo[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState("hello solana");
  const [messageResult, setMessageResult] = useState<SignResult | null>(null);
  const [memo, setMemo] = useState("hello keychain");
  const [coSignResult, setCoSignResult] = useState<CoSignResult | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchSigners()
      .then((list) => {
        if (cancelled) return;
        setSigners(list);
        setSelected((current) => current ?? list[0]?.backend ?? null);
      })
      .catch(() => {
        if (!cancelled) setSigners([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedSigner = signers?.find((s) => s.backend === selected) ?? null;

  async function refreshSigners() {
    setBusy("signers");
    try {
      setSigners(await fetchSigners());
    } catch {
      // keep the current list on transient failures
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
        body: JSON.stringify({ message, backend: selected }),
      });
      setMessageResult(await res.json());
    } catch (error) {
      setMessageResult({ error: String(error) });
    } finally {
      setBusy(null);
    }
  }

  async function coSignTransaction() {
    if (!selectedSigner?.address) return;
    setBusy("transaction");
    try {
      const wireTransaction = buildDemoTransaction(
        address(selectedSigner.address),
        memo
      );
      const res = await fetch("/api/sign/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction: wireTransaction,
          backend: selected,
        }),
      });
      const result: SignResult = await res.json();
      if (!res.ok || !result.transaction) {
        setCoSignResult({ error: result.error ?? "Signing failed" });
        return;
      }
      setCoSignResult({
        decoded: await decodeSignedTransaction(result.transaction),
        raw: result.transaction,
      });
    } catch (error) {
      setCoSignResult({ error: String(error) });
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
            Signers live in the Axum (Rust) service powered by{" "}
            <code className="font-mono">solana-keychain</code> — private keys
            never reach the browser. The Next.js frontend proxies{" "}
            <code className="font-mono">/api/*</code> to the Rust service, and
            every backend configured in your environment appears in the registry
            below. See <code className="font-mono">.env.example</code> for every
            backend&apos;s variables.
          </p>
        </header>

        <section className="w-full max-w-3xl space-y-4 rounded-2xl border border-border-low bg-card p-6 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.35)]">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-lg font-semibold">Signers</p>
              <p className="text-sm text-muted">
                Served by <code className="font-mono">GET /api/signers</code> —
                one entry per configured backend, checked with{" "}
                <code className="font-mono">isAvailable()</code>. Pick the one
                to sign with.
              </p>
            </div>
            <button
              onClick={() => void refreshSigners()}
              disabled={busy !== null}
              className="inline-flex items-center gap-2 rounded-lg border border-border-low bg-card px-3 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              Refresh
            </button>
          </div>
          <div className="space-y-2">
            {signers === null && <p className="text-sm text-muted">Loading…</p>}
            {signers?.map((signer) => (
              <label
                key={signer.backend}
                className="flex cursor-pointer flex-wrap items-center gap-3 rounded-lg border border-border-low bg-cream px-3 py-2 text-sm has-checked:border-foreground/40"
              >
                <input
                  type="radio"
                  name="signer"
                  checked={selected === signer.backend}
                  onChange={() => setSelected(signer.backend)}
                  className="accent-foreground"
                />
                <span className="font-semibold">{signer.backend}</span>
                <span className="break-all font-mono text-xs text-muted">
                  {signer.address ?? signer.error ?? "—"}
                </span>
                <span className="ml-auto rounded-full bg-card px-2 py-0.5 text-xs font-semibold uppercase tracking-wide">
                  {signer.available ? "available" : "unavailable"}
                </span>
              </label>
            ))}
          </div>
          <p className="text-xs text-muted">
            Only <code className="font-mono">memory</code>? Add credentials for
            any backend in <code className="font-mono">.env.local</code> and it
            shows up here — no code changes.
          </p>
        </section>

        <section className="w-full max-w-3xl space-y-4 rounded-2xl border border-border-low bg-card p-6 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.35)]">
          <div className="space-y-1">
            <p className="text-lg font-semibold">Sign a message</p>
            <p className="text-sm text-muted">
              Posts to <code className="font-mono">POST /api/sign/message</code>{" "}
              with the selected backend and returns a base58 Ed25519 signature.
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
              disabled={busy !== null || message.length === 0 || !selected}
              className="inline-flex items-center gap-2 rounded-lg border border-border-low bg-card px-3 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy === "message" ? "Signing…" : `Sign with ${selected ?? "…"}`}
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
              Builds a memo transaction in your browser (placeholder blockhash),
              sends it to{" "}
              <code className="font-mono">POST /api/sign/transaction</code> for
              the selected backend, then decodes the signed result and verifies
              the signature. Nothing is submitted to the network.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              value={memo}
              onChange={(event) => setMemo(event.target.value)}
              placeholder="Memo for the demo transaction"
              className="min-w-0 flex-1 rounded-lg border border-border-low bg-cream px-3 py-2 font-mono text-sm outline-none"
            />
            <button
              onClick={() => void coSignTransaction()}
              disabled={
                busy !== null || memo.length === 0 || !selectedSigner?.address
              }
              className="inline-flex items-center gap-2 rounded-lg border border-border-low bg-card px-3 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy === "transaction" ? "Signing…" : "Build & co-sign"}
            </button>
          </div>
          {coSignResult?.error && (
            <p className="break-all rounded-lg border border-border-low bg-cream px-3 py-2 font-mono text-xs">
              {coSignResult.error}
            </p>
          )}
          {coSignResult?.decoded && (
            <div className="space-y-2">
              <dl className="grid gap-2 rounded-lg border border-border-low bg-cream px-3 py-2 text-xs sm:grid-cols-[8rem_1fr]">
                <dt className="font-semibold">Fee payer</dt>
                <dd className="break-all font-mono">
                  {coSignResult.decoded.feePayer}
                </dd>
                <dt className="font-semibold">Blockhash</dt>
                <dd className="break-all font-mono">
                  {coSignResult.decoded.blockhash}
                </dd>
                <dt className="font-semibold">Memo</dt>
                <dd className="break-all font-mono">
                  {coSignResult.decoded.memo}
                </dd>
                <dt className="font-semibold">Signature</dt>
                <dd className="break-all font-mono">
                  {coSignResult.decoded.signature}{" "}
                  <span
                    className={
                      coSignResult.decoded.signatureValid
                        ? "font-sans font-semibold text-green-600"
                        : "font-sans font-semibold text-red-600"
                    }
                  >
                    {coSignResult.decoded.signatureValid
                      ? "✓ valid"
                      : "✗ invalid"}
                  </span>
                </dd>
              </dl>
              {coSignResult.raw && (
                <details className="rounded-lg border border-border-low bg-cream px-3 py-2 text-xs">
                  <summary className="cursor-pointer font-semibold">
                    Raw signed transaction (base64)
                  </summary>
                  <p className="mt-2 break-all font-mono">{coSignResult.raw}</p>
                </details>
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
          — the same signers plug into any{" "}
          <code className="font-mono">@solana/kit</code> transaction pipeline.
        </footer>
      </main>
    </div>
  );
}
