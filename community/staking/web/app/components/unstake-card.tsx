"use client";

/**
 * UnstakeCard — displays a single active stake and lets the user unstake.
 *
 * Shows the staked amount, when it was staked, and whether the freeze
 * period has elapsed. The Unstake button is disabled while the stake
 * is still frozen.
 */

import {
  useWalletSession,
  useSendTransaction,
} from "@solana/react-hooks";
import { createWalletTransactionSigner } from "@solana/client";
import type { StakeEntry } from "@/app/hooks/use-staking";
import { lamportsToSol, timeAgo } from "@/app/lib/format";
import { getUnstakeInstructionAsync } from "@/client/vault/index";

interface Props {
  stake: StakeEntry;
  /** Pool freeze period in seconds. */
  freezePeriod: bigint;
  /** Called after a successful unstake to refresh state. */
  onUnstaked: () => Promise<void>;
}

export function UnstakeCard({ stake, freezePeriod, onUnstaked }: Props) {
  const session = useWalletSession();
  const { send, isSending, error, reset } = useSendTransaction();

  const now = BigInt(Math.floor(Date.now() / 1000));
  const unlockAt = stake.stakedAt + freezePeriod;
  const isFrozen = now < unlockAt;
  const remaining = isFrozen ? Number(unlockAt - now) : 0;

  /** Human-readable countdown. */
  function countdown(seconds: number): string {
    if (seconds <= 0) return "now";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const parts: string[] = [];
    if (h) parts.push(`${h}h`);
    if (m) parts.push(`${m}m`);
    if (s || parts.length === 0) parts.push(`${s}s`);
    return parts.join(" ");
  }

  async function handleUnstake() {
    if (!session || isFrozen) return;
    reset();

    const { signer } = createWalletTransactionSigner(session);

    const ix = await getUnstakeInstructionAsync({
      user: signer,
      id: BigInt(stake.id),
    });

    await send({
      instructions: [ix],
      feePayer: signer,
    });

    await onUnstaked();
  }

  return (
    <div className="rounded border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">
            Stake #{stake.id.toString()} — {lamportsToSol(stake.amount)} SOL
          </p>
          <p className="text-xs text-zinc-500">
            Staked {timeAgo(stake.stakedAt)}
          </p>
        </div>

        <button
          onClick={handleUnstake}
          disabled={isSending || isFrozen}
          className="rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium
            hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700
            dark:hover:bg-zinc-800"
        >
          {isSending ? "Unstaking…" : isFrozen ? `Locked (${countdown(remaining)})` : "Unstake"}
        </button>
      </div>

      {error ? (
        <p className="mt-2 text-xs text-red-600">
          {error instanceof Error ? error.message : "Transaction failed"}
        </p>
      ) : null}
    </div>
  );
}
