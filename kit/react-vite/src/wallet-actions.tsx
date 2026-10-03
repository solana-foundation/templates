import {
  lamportsFromSol,
  lamportsToSolString,
  toAddress,
  type WalletSession,
} from "@solana/client";
import {
  useBalance,
  useSolTransfer,
  useWalletActions,
} from "@solana/react-hooks";
import { useState, type FormEvent } from "react";

export function WalletActions({ wallet }: { wallet: WalletSession }) {
  const balance = useBalance(wallet.account.address);
  const { requestAirdrop } = useWalletActions();
  const { send } = useSolTransfer();
  const [pending, setPending] = useState<"airdrop" | "transfer" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    signature: string;
    message: string;
  } | null>(null);
  const canSign = Boolean(wallet.signTransaction || wallet.sendTransaction);

  async function runAction(
    action: "airdrop" | "transfer",
    request: () => Promise<string>
  ) {
    if (pending) return;
    setPending(action);
    setError(null);
    setResult(null);
    try {
      const signature = await request();
      setResult({
        signature,
        message:
          action === "airdrop"
            ? "Airdrop requested."
            : "SOL transfer submitted.",
      });
    } catch (err) {
      setError(
        action === "airdrop"
          ? "Airdrop failed. Try the Solana faucet or retry later."
          : err instanceof Error
            ? err.message
            : "SOL transfer failed. Try again."
      );
    } finally {
      setPending(null);
    }
  }

  function handleTransfer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSign || !event.currentTarget.reportValidity()) return;
    const data = new FormData(event.currentTarget);
    const amount = data.get("amount");
    const recipient = data.get("recipient");
    if (typeof amount !== "string" || typeof recipient !== "string") return;

    void runAction("transfer", () => {
      const transferAmount = lamportsFromSol(amount);
      // Reject sub-lamport amounts instead of silently rounding them.
      if (transferAmount !== lamportsFromSol(amount, { rounding: "ceil" })) {
        throw new Error("Use at most 9 decimal places for the SOL amount.");
      }
      if (balance.lamports !== null && transferAmount >= balance.lamports) {
        throw new Error(
          "Insufficient SOL balance. Leave enough SOL for transaction fees."
        );
      }
      return send({
        amount: transferAmount,
        authority: wallet,
        commitment: "confirmed",
        destination: toAddress(recipient.trim()),
      });
    });
  }

  return (
    <section
      className="w-full max-w-3xl space-y-4"
      aria-labelledby="wallet-actions-title"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="wallet-actions-title" className="text-lg font-semibold">
          Wallet actions
        </h2>
        <span className="rounded-full border border-border-low bg-cream px-3 py-1 text-xs font-medium text-muted">
          Devnet
        </span>
      </div>
      <div className="grid items-start gap-4 sm:grid-cols-2">
        <div className="min-w-0 rounded-2xl border border-border-low bg-cream/50 p-5">
          <h3 className="text-sm text-muted">Available balance</h3>
          <p
            className="mt-2 break-all text-3xl font-semibold tracking-tight tabular-nums"
            role="status"
          >
            {balance.lamports !== null && !balance.error
              ? lamportsToSolString(balance.lamports)
              : "—"}
            <span className="ml-2 text-base font-normal text-muted">SOL</span>
          </p>
          {(balance.error != null || balance.lamports === null) && (
            <p
              className="mt-2 text-sm text-muted"
              role={balance.error ? "alert" : "status"}
            >
              {balance.error
                ? "Could not load the balance. Check your RPC connection."
                : "Loading balance…"}
            </p>
          )}
          <div className="mt-6 space-y-3 border-t border-border-low pt-5">
            <h3 className="text-sm font-semibold">Fund wallet</h3>
            <p className="text-sm text-muted">
              Get 1 devnet SOL to try your first transfer.
            </p>
            <button
              onClick={() =>
                void runAction("airdrop", () =>
                  requestAirdrop(wallet.account.address, lamportsFromSol("1"))
                )
              }
              disabled={pending !== null}
              className="w-full cursor-pointer rounded-lg border border-border-low bg-card px-4 py-2.5 text-sm font-medium transition hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending === "airdrop" ? "Requesting…" : "Airdrop 1 SOL"}
            </button>
            <a
              className="inline-block text-xs text-muted underline underline-offset-4 hover:text-foreground"
              href="https://faucet.solana.com/"
              target="_blank"
              rel="noreferrer"
            >
              Faucet rate-limited? Open Solana faucet ↗
            </a>
          </div>
        </div>
        <form
          onSubmit={handleTransfer}
          aria-label="Transfer SOL"
          className="rounded-2xl border border-border-low bg-card p-5"
        >
          <fieldset
            disabled={pending !== null || !canSign}
            className="space-y-3"
          >
            <legend className="mb-1 text-base font-semibold">
              Transfer SOL
            </legend>
            <p className="text-sm text-muted">
              Send devnet SOL to another wallet.
            </p>
            <label
              htmlFor="sol-recipient"
              className="block text-sm font-medium"
            >
              Recipient address
            </label>
            <input
              id="sol-recipient"
              name="recipient"
              placeholder="Solana wallet address"
              required
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className="w-full rounded-lg border border-border-low bg-background px-3 py-2.5 font-mono text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
            />
            <label htmlFor="sol-amount" className="block text-sm font-medium">
              Amount (SOL)
            </label>
            <input
              id="sol-amount"
              name="amount"
              type="number"
              defaultValue="0.01"
              min="0.000000001"
              step="0.000000001"
              inputMode="decimal"
              required
              aria-describedby="sol-amount-help"
              className="w-full rounded-lg border border-border-low bg-background px-3 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
            />
            <p
              id="sol-amount-help"
              className="text-xs leading-relaxed text-muted"
            >
              Up to 9 decimal places. Leave SOL for fees and review the details
              in your wallet before approving.
            </p>
            <button className="w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-background transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50">
              {pending === "transfer" ? "Sending…" : "Send SOL"}
            </button>
          </fieldset>
          {!canSign && (
            <p className="mt-3 text-sm text-muted">
              This wallet is read-only. Connect a signing-capable wallet to
              transfer SOL.
            </p>
          )}
        </form>
      </div>
      {error && (
        <p
          className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300"
          role="alert"
        >
          {error}
        </p>
      )}
      {result && (
        <p
          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm"
          role="status"
        >
          <span>{result.message}</span>
          <a
            className="font-medium underline underline-offset-4"
            href={`https://explorer.solana.com/tx/${result.signature}?cluster=devnet`}
            target="_blank"
            rel="noreferrer"
          >
            View transaction ↗
          </a>
        </p>
      )}
    </section>
  );
}
