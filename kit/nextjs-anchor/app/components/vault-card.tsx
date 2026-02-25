"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "../lib/wallet/context";
import { useSendTransaction } from "../lib/hooks/use-send-transaction";
import { useBalance } from "../lib/hooks/use-balance";
import { lamportsFromSol, lamportsToSolString } from "../lib/lamports";
import { type Address } from "@solana/kit";
import { toast } from "sonner";
import {
  getDepositInstruction,
  getWithdrawInstruction,
  getWithdrawInstructionAsync,
} from "../generated/vault";
import { parseTransactionError } from "../lib/errors";
import { useCluster } from "./cluster-context";

export function VaultCard() {
  const { wallet, signer, status } = useWallet();
  const { send, isSending } = useSendTransaction();
  const { getExplorerUrl } = useCluster();

  const [amount, setAmount] = useState("");
  const [vaultAddress, setVaultAddress] = useState<Address | null>(null);

  const walletAddress = wallet?.account.address;

  // Derive vault PDA from generated IDL client
  useEffect(() => {
    let cancelled = false;

    async function deriveVault() {
      if (!signer) {
        setVaultAddress(null);
        return;
      }

      try {
        const ix = await getWithdrawInstructionAsync({ signer });
        const pda = ix.accounts[1]?.address;
        if (!cancelled) setVaultAddress((pda as Address) ?? null);
      } catch {
        if (!cancelled) setVaultAddress(null);
      }
    }

    void deriveVault();
    return () => {
      cancelled = true;
    };
  }, [signer]);

  // Get balances
  const walletBalance = useBalance(walletAddress);
  const walletLamports = walletBalance?.lamports;
  const vaultBalance = useBalance(vaultAddress ?? undefined);
  const vaultLamports = vaultBalance?.lamports;

  const handleDeposit = useCallback(async () => {
    if (!walletAddress || !vaultAddress || !amount || !signer) return;

    const depositLamports = lamportsFromSol(parseFloat(amount));
    if (walletLamports != null && walletLamports < depositLamports) {
      toast.error("Insufficient balance.", {
        description: `You need at least ${amount} SOL plus fees. Current balance: ${lamportsToSolString(walletLamports)} SOL.`,
      });
      return;
    }

    try {
      const instruction = getDepositInstruction({
        signer,
        vault: vaultAddress,
        amount: lamportsFromSol(parseFloat(amount)),
      });

      const signature = await send({ instructions: [instruction] });

      toast.success("Deposit confirmed!", {
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
      setAmount("");
    } catch (err) {
      console.error("Deposit failed:", err);
      toast.error(parseTransactionError(err));
    }
  }, [walletAddress, vaultAddress, amount, signer, send, getExplorerUrl]);

  const handleWithdraw = useCallback(async () => {
    if (!walletAddress || !vaultAddress || !signer) return;

    try {
      const instruction = getWithdrawInstruction({
        signer,
        vault: vaultAddress,
      });

      const signature = await send({ instructions: [instruction] });

      toast.success("Withdrawal confirmed!", {
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
    } catch (err) {
      console.error("Withdraw failed:", err);
      toast.error(parseTransactionError(err));
    }
  }, [walletAddress, vaultAddress, signer, send, getExplorerUrl]);

  if (status !== "connected") {
    return (
      <section className="w-full space-y-4 rounded-2xl border border-border-low bg-card p-6 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.35)]">
        <div className="space-y-1">
          <p className="text-lg font-semibold">SOL Vault</p>
          <p className="text-sm text-muted">
            Connect your wallet to interact with the vault program.
          </p>
        </div>
        <div className="rounded-lg bg-cream/50 p-4 text-center text-sm text-muted">
          Wallet not connected
        </div>
      </section>
    );
  }

  return (
    <section className="w-full space-y-4 rounded-2xl border border-border-low bg-card p-6 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.35)]">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-lg font-semibold">SOL Vault</p>
          <p className="text-sm text-muted">
            Deposit SOL into your personal vault PDA and withdraw anytime.
          </p>
        </div>
        <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground/80">
          {(vaultLamports ?? 0n) > 0n ? "Has funds" : "Empty"}
        </span>
      </div>

      {/* Vault Balance */}
      <div className="rounded-xl border border-border-low bg-cream/30 p-4">
        <p className="text-xs uppercase tracking-wide text-muted">
          Vault Balance
        </p>
        <p className="mt-1 text-3xl font-bold tabular-nums">
          {vaultLamports ? lamportsToSolString(vaultLamports) : "0"}{" "}
          <span className="text-lg font-normal text-muted">SOL</span>
        </p>
        {vaultAddress && (vaultLamports ?? 0n) > 0n && (
          <p className="group mt-2 flex items-center gap-1.5">
            <a
              href={getExplorerUrl(`/address/${vaultAddress}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate font-mono text-xs text-muted underline underline-offset-2"
            >
              {vaultAddress}
            </a>
            <span
              className="relative cursor-default text-muted"
              title="This is your vault PDA — a program-derived account that holds your deposited SOL. Only you can withdraw from it."
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-3.5 w-3.5"
              >
                <path
                  fillRule="evenodd"
                  d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.75 8a.75.75 0 0 0 0 1.5h.75v1.75a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8.25 8h-1.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </p>
        )}
      </div>

      {/* Deposit Form */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Amount in SOL"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isSending}
            className="flex-1 rounded-lg border border-border-low bg-card px-4 py-2.5 text-sm outline-none transition placeholder:text-muted focus:border-foreground/30 disabled:opacity-50 disabled:pointer-events-none"
          />
          <button
            onClick={handleDeposit}
            disabled={
              isSending ||
              !amount ||
              parseFloat(amount) <= 0 ||
              (vaultLamports ?? 0n) > 0n
            }
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSending ? "Confirming..." : "Deposit"}
          </button>
        </div>
        {(vaultLamports ?? 0n) > 0n && (
          <p className="text-xs text-muted">
            Vault already has funds. Withdraw first before depositing again.
          </p>
        )}
      </div>

      {/* Withdraw Button */}
      <button
        onClick={handleWithdraw}
        disabled={isSending || !vaultLamports}
        className="w-full rounded-lg border border-border-low bg-card px-4 py-2.5 text-sm font-medium shadow-xs transition hover:bg-cream disabled:opacity-50 disabled:pointer-events-none"
      >
        {isSending ? "Confirming..." : "Withdraw All"}
      </button>

      {/* Educational Footer */}
      <div className="border-t border-border-low pt-4 text-xs text-muted">
        <p className="mb-2">
          This vault is an{" "}
          <a
            href="https://www.anchor-lang.com/docs"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-2"
          >
            Anchor program
          </a>{" "}
          deployed on devnet. Want to deploy your own?
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://www.anchor-lang.com/docs/quickstart"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md bg-cream px-2 py-1 font-medium transition hover:bg-cream/70"
          >
            Anchor Quickstart
          </a>
          <a
            href="https://solana.com/docs/programs/deploying"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md bg-cream px-2 py-1 font-medium transition hover:bg-cream/70"
          >
            Deploy Programs
          </a>
        </div>
      </div>
    </section>
  );
}
