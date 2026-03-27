"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { BN } from "@coral-xyz/anchor";
import toast from "react-hot-toast";
import { SystemProgram } from "@solana/web3.js";
import { useStakeAccount } from "../../hooks/useStakeAccount";
import { usePoolState } from "../../hooks/usePoolState";
import { useSolBalance } from "../../hooks/useSolBalance";
import { useAnchorProgram } from "../../hooks/useAnchorProgram";
import { StakeForm } from "../stake/StakeForm";
import { UnstakeForm } from "../stake/UnstakeForm";
import { RewardsCard } from "../rewards/RewardsCard";
import { PoolStats } from "../pool/PoolStats";
import { findStakeAccountPda, findVaultPda } from "../../lib/pdas";
import { shortAddress, parseAnchorError } from "../../lib/types";
import { RECEIPT_MINT, REWARD_MINT } from "../../lib/config";

type Modal = "stake" | "unstake" | null;

export function UserDashboard() {
  const { publicKey } = useWallet();
  const program = useAnchorProgram();
  const { stakeAccount, loading: saLoading, refresh: refreshSA } = useStakeAccount();
  const { poolState, loading: psLoading } = usePoolState();
  const { balance } = useSolBalance();
  const [modal, setModal] = useState<Modal>(null);
  const [initializing, setInitializing] = useState(false);

  const onInitialize = async () => {
    if (!publicKey || !program) { toast.error("Connect your wallet first"); return; }
    setInitializing(true);
    const toastId = toast.loading("Initializing staking account…");
    try {
      const stakeAccountPda = findStakeAccountPda(publicKey);
      const vault = findVaultPda(publicKey);
      await (program as any).methods
        .initialize(new BN(0))
        .accountsStrict({
          signer: publicKey,
          stakeAccount: stakeAccountPda,
          vault,
          systemProgram: SystemProgram.programId
        })
        .rpc();
      toast.success("Staking account created!", { id: toastId });
      await refreshSA();
    } catch (e) {
      toast.error(parseAnchorError(e), { id: toastId });
    } finally {
      setInitializing(false);
    }
  };

  const receiptMint = RECEIPT_MINT;
  const rewardMint = REWARD_MINT;

  return (
    <div className="space-y-6">
      {/* Pool stats */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
          Protocol Overview
        </h2>
        <PoolStats poolState={poolState} loading={psLoading} />
      </section>

      {/* Hero */}
      {publicKey && (
        <div className="glass-card p-5 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 space-y-1">
            <div className="text-xs text-slate-600">Connected wallet</div>
            <div className="font-mono text-sm text-slate-950">{shortAddress(publicKey)}</div>
            <div className="text-xs text-slate-600 mt-1">
              Balance:{" "}
              <span className="text-slate-950 font-medium">
                {balance != null ? `${balance.toFixed(4)} SOL` : "—"}
              </span>
            </div>
          </div>
          {!stakeAccount && !saLoading && (
            <button
              onClick={onInitialize}
              disabled={initializing}
              className="btn-primary shrink-0"
            >
              {initializing ? "Initializing…" : "Initialize Staking Account"}
            </button>
          )}
        </div>
      )}

      {/* Not connected */}
      {!publicKey && (
        <div className="glass-card p-8 text-center text-slate-700 space-y-2">
          <div className="text-4xl">👛</div>
          <div className="text-sm">Connect your wallet to get started.</div>
        </div>
      )}

      {/* Skeleton while loading */}
      {publicKey && saLoading && (
        <div className="glass-card p-5 animate-pulse space-y-3">
          <div className="h-3 rounded bg-slate-200 w-1/3" />
          <div className="h-5 rounded bg-slate-200 w-1/2" />
          <div className="h-3 rounded bg-slate-200 w-1/4" />
        </div>
      )}

      {/* No stake account yet */}
      {publicKey && !saLoading && !stakeAccount && (
        <div className="glass-card p-8 text-center space-y-3">
          <div className="text-4xl">🌱</div>
          <div className="text-slate-700 text-sm">
            No staking account yet. Initialize one to start earning rewards.
          </div>
        </div>
      )}

      {/* Stake summary + actions */}
      {stakeAccount && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Stake summary */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-950">Your Stake</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-slate-50 px-3 py-2 border border-slate-200">
                <div className="text-xs text-slate-600">Staked SOL</div>
                <div className="text-lg font-bold text-slate-950 tabular-nums">
                  {stakeAccount.stakedAmount.toNumber()}
                </div>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2 border border-slate-200">
                <div className="text-xs text-slate-600">Points</div>
                <div className="text-lg font-bold text-slate-950 tabular-nums">
                  {stakeAccount.point.toNumber().toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setModal("stake")}
                className="btn-primary flex-1"
              >
                Stake more
              </button>
              <button
                onClick={() => setModal("unstake")}
                className="btn-outline flex-1"
              >
                Unstake
              </button>
            </div>
          </div>

          {/* Rewards */}
          <RewardsCard
            stakeAccount={stakeAccount}
            rewardMint={rewardMint}
            onSuccess={refreshSA}
          />
        </div>
      )}

      {/* Modals */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setModal(null)}
        >
          <div
            className="glass-card w-full max-w-sm p-6 space-y-4 mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">
                {modal === "stake" ? "Stake SOL" : "Unstake SOL"}
              </h3>
              <button
                onClick={() => setModal(null)}
                className="text-slate-600 hover:text-slate-900 text-xl leading-none"
              >
                ×
              </button>
            </div>

            {modal === "stake" ? (
              <StakeForm
                receiptMint={receiptMint}
                stakedAmount={stakeAccount?.stakedAmount.toNumber() ?? 0}
                onSuccess={() => { setModal(null); refreshSA(); }}
              />
            ) : (
              <UnstakeForm
                receiptMint={receiptMint}
                stakedAmount={stakeAccount?.stakedAmount.toNumber() ?? 0}
                onSuccess={() => { setModal(null); refreshSA(); }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
