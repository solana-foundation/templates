"use client";

/**
 * StakeForm — input form for staking SOL.
 *
 * Shows the user's wallet balance, validates the amount against the
 * pool's max-stake cap, builds a Stake instruction via the codama
 * client, and sends it through the transaction pool.
 */

import { useState } from "react";
import {
  useWalletSession,
  useBalance,
  useSendTransaction,
} from "@solana/react-hooks";
import { createWalletTransactionSigner } from "@solana/client";
import type { StakingState } from "@/app/hooks/use-staking";
import { lamportsToSol, solToLamports } from "@/app/lib/format";
import { getStakeInstructionAsync } from "@/client/vault/index";

type Props = Pick<StakingState, "pool" | "user" | "refresh">;

export function StakeForm({ pool, user, refresh }: Props) {
  const session = useWalletSession();
  const { lamports: walletBalance } = useBalance(
    session?.account?.address ?? undefined,
    { watch: true },
  );
  const { send, isSending, error, reset } = useSendTransaction();

  const [amount, setAmount] = useState("");
  const [stakeId, setStakeId] = useState("1");

  if (!session) {
    return (
      <section className="rounded border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="text-lg font-semibold">Stake SOL</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Connect your wallet to stake.
        </p>
      </section>
    );
  }

  const lamportAmount = amount ? solToLamports(amount) : 0n;
  const currentStaked = user?.amountStaked ?? 0n;
  const maxStake = pool?.maxStake ?? 0n;
  const remaining = maxStake > currentStaked ? maxStake - currentStaked : 0n;
  const overMax = lamportAmount > remaining;
  const overBalance =
    walletBalance != null && lamportAmount > walletBalance;

  async function handleStake() {
    if (!session || lamportAmount <= 0n || overMax || overBalance) return;
    reset();

    const { signer } = createWalletTransactionSigner(session);

    const ix = await getStakeInstructionAsync({
      user: signer,
      id: BigInt(stakeId),
      amount: lamportAmount,
    });

    await send({
      instructions: [ix],
      feePayer: signer,
    });

    setAmount("");
    await refresh();
  }

  return (
    <section className="rounded border border-zinc-200 p-6 dark:border-zinc-800">
      <h2 className="text-lg font-semibold">Stake SOL</h2>

      {/* Wallet balance */}
      <p className="mt-1 text-sm text-zinc-500">
        Wallet:{" "}
        {walletBalance != null ? `${lamportsToSol(walletBalance)} SOL` : "…"}
      </p>

      <div className="mt-4 space-y-3">
        {/* Amount input */}
        <div>
          <label className="block text-sm font-medium">Amount (SOL)</label>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm
              dark:border-zinc-700 dark:bg-zinc-900"
          />
          {overMax && (
            <p className="mt-1 text-xs text-red-600">
              Exceeds max stake (remaining: {lamportsToSol(remaining)} SOL)
            </p>
          )}
          {overBalance && (
            <p className="mt-1 text-xs text-red-600">Insufficient balance</p>
          )}
        </div>

        {/* Stake ID input */}
        <div>
          <label className="block text-sm font-medium">Stake ID</label>
          <input
            type="number"
            min="1"
            value={stakeId}
            onChange={(e) => setStakeId(e.target.value)}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm
              dark:border-zinc-700 dark:bg-zinc-900"
          />
          <p className="mt-1 text-xs text-zinc-400">
            Unique ID for this stake — use different IDs for concurrent stakes.
          </p>
        </div>

        {/* Submit */}
        <button
          onClick={handleStake}
          disabled={
            isSending ||
            lamportAmount <= 0n ||
            overMax ||
            overBalance
          }
          className="w-full rounded bg-zinc-900 py-2 text-sm font-medium text-white
            hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100
            dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {isSending ? "Staking…" : "Stake"}
        </button>

        {error ? (
          <p className="text-xs text-red-600">
            {error instanceof Error ? error.message : "Transaction failed"}
          </p>
        ) : null}
      </div>
    </section>
  );
}
