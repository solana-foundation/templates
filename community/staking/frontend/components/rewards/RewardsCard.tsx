"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { BN } from "@coral-xyz/anchor";
import { useAnchorProgram } from "../../hooks/useAnchorProgram";
import { findStakeAccountPda, findRewardVaultPda } from "../../lib/pdas";
import { StakeAccount, claimableTokens, pointsToTokens, shortAddress, parseAnchorError } from "../../lib/types";

interface RewardsCardProps {
  stakeAccount: StakeAccount;
  rewardMint: PublicKey;
  onSuccess?: () => void;
}

export function RewardsCard({ stakeAccount, rewardMint, onSuccess }: RewardsCardProps) {
  const { publicKey } = useWallet();
  const program = useAnchorProgram();
  const [claiming, setClaiming] = useState(false);

  const points = stakeAccount.point.toNumber();
  const precise = pointsToTokens(stakeAccount.point);
  const claimable = claimableTokens(stakeAccount.point);

  const onClaim = async () => {
    if (!publicKey || !program) { toast.error("Connect your wallet first"); return; }
    if (claimable === 0) { toast.error("You don't have enough points to claim yet"); return; }

    setClaiming(true);
    const toastId = toast.loading("Claiming rewards…");
    try {
      const stakeAccountPda = findStakeAccountPda(publicKey);
      const rewardVault = findRewardVaultPda(rewardMint);
      const userRewardAccount = getAssociatedTokenAddressSync(rewardMint, publicKey);

      await (program as any).methods
        .claimReward()
        .accountsStrict({
          signer: publicKey,
          stakeAccount: stakeAccountPda,
          rewardMint,
          userRewardAccount,
          rewardVault,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId
        })
        .rpc();

      toast.success(`Claimed ${claimable} reward token(s)!`, { id: toastId });
      onSuccess?.();
    } catch (e) {
      toast.error(parseAnchorError(e), { id: toastId });
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="glass-card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-950">Rewards</h3>
        <span className="text-xs text-slate-600">
          Mint: {shortAddress(rewardMint)}
        </span>
      </div>

      {/* Points meter */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-600">
          <span>Accumulated points</span>
          <span className="font-mono text-sky-400">{points.toLocaleString()}</span>
        </div>
        <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-700"
            style={{ width: `${Math.min(100, (points % 1_000_000) / 10_000)}%` }}
          />
        </div>
        <div className="text-right text-xs text-slate-600">
          {(1_000_000 - (points % 1_000_000)).toLocaleString()} pts until next token
        </div>
      </div>

      {/* Claimable display */}
      <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 px-4 py-3 flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-700">Claimable now</div>
          <div className="text-2xl font-bold text-emerald-600 tabular-nums">{claimable}</div>
          <div className="text-xs text-slate-600 mt-0.5">
            ({precise.toFixed(4)} exact)
          </div>
        </div>
        <div className="text-3xl">🎁</div>
      </div>

      <button
        onClick={onClaim}
        disabled={claiming || claimable === 0 || !publicKey}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {claiming ? (
          <span className="flex items-center gap-2 justify-center">
            <span className="h-3 w-3 rounded-full border-2 border-t-transparent border-white animate-spin" />
            Claiming…
          </span>
        ) : claimable > 0 ? `Claim ${claimable} token${claimable !== 1 ? "s" : ""}` : "No rewards yet"}
      </button>
    </div>
  );
}
