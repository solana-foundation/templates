"use client";

import { useCallback, useMemo, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { BN } from "@coral-xyz/anchor";
import { toast } from "sonner";
import { getAssociatedTokenAddressSync, createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import { SystemProgram, Transaction } from "@solana/web3.js";

import { UserDashboard } from "@/components/staking/user-dashboard";
import { useAnchorProgram } from "@/hooks/useAnchorProgram";
import { useStakeAccount } from "@/hooks/useStakeAccount";
import { usePoolState } from "@/hooks/usePoolState";
import { useSolBalance } from "@/hooks/useSolBalance";
import { RECEIPT_MINT, REWARD_MINT } from "@/lib/config";
import {
  findPoolStatePda,
  findStakeAccountPda,
  findVaultPda,
  findMintAuthorityPda,
  findRewardVaultPda
} from "@/lib/pdas";
import { claimableTokens, pointsToTokens, parseAnchorError, POINTS_PER_TOKEN } from "@/lib/types";

function explorerUrl(sig: string) {
  return `https://explorer.solana.com/tx/${sig}?cluster=devnet`;
}

function TxToast({ message, sig }: { message: string; sig: string }) {
  return (
    <div className="space-y-1">
      <p>{message}</p>
      <a
        href={explorerUrl(sig)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-accent underline underline-offset-2 hover:opacity-80"
      >
        View on Explorer &rarr;
      </a>
    </div>
  );
}

export function DashboardContent() {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const program = useAnchorProgram();
  const { stakeAccount, loading: stakeLoading, refresh: refreshStake } = useStakeAccount();
  const { poolState, loading: poolLoading, refresh: refreshPool } = usePoolState();
  const { balance, refresh: refreshBalance } = useSolBalance();

  const [isLoading, setIsLoading] = useState(false);

  const stakedAmount = useMemo(
    () => (stakeAccount ? stakeAccount.stakedAmount.toNumber() : 0),
    [stakeAccount]
  );

  const pendingRewards = useMemo(
    () => (stakeAccount ? claimableTokens(stakeAccount.point) : 0),
    [stakeAccount]
  );

  const accumulatedRewards = useMemo(
    () => (stakeAccount ? pointsToTokens(stakeAccount.point) : 0),
    [stakeAccount]
  );

  const totalStaked = useMemo(
    () => (poolState ? poolState.totalStaked.toNumber() : 0),
    [poolState]
  );

  const rewardRatePtsPerSec = useMemo(
    () => (poolState ? poolState.rewardRate.toNumber() : 0),
    [poolState]
  );

  const refreshAll = useCallback(async () => {
    await Promise.allSettled([refreshStake(), refreshPool(), refreshBalance()]);
  }, [refreshStake, refreshPool, refreshBalance]);

  const ensureAtaExists = useCallback(
    async (mint: any) => {
      if (!publicKey || !signTransaction) throw new Error("Wallet not connected");
      const ata = getAssociatedTokenAddressSync(mint, publicKey);

      const info = await connection.getAccountInfo(ata);
      if (info) return ata;

      const ix = createAssociatedTokenAccountInstruction(
        publicKey, // payer
        ata,
        publicKey, // owner
        mint
      );
      const tx = new Transaction().add(ix);
      tx.feePayer = publicKey;
      tx.recentBlockhash = (await connection.getLatestBlockhash("confirmed")).blockhash;
      const signed = await signTransaction(tx);
      const sig = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(sig, "confirmed");
      return ata;
    },
    [publicKey, signTransaction, connection]
  );

  const handleInitializeIfNeeded = useCallback(async () => {
    if (!publicKey || !program) return;
    if (stakeAccount) return;

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
      toast.success("Staking account created", { id: toastId });
      await refreshStake();
    } catch (e) {
      toast.error(parseAnchorError(e), { id: toastId });
      throw e;
    }
  }, [publicKey, program, stakeAccount, refreshStake]);

  const handleStake = useCallback(
    async (amount: number) => {
      if (!publicKey || !program) {
        toast.error("Connect your wallet first");
        return;
      }
      if (!Number.isInteger(amount) || amount <= 0) {
        toast.error("Only whole SOL amounts are supported");
        return;
      }

      setIsLoading(true);
      const toastId = toast.loading("Staking…");
      try {
        await handleInitializeIfNeeded();

        const stakeAccountPda = findStakeAccountPda(publicKey);
        const poolStatePda = findPoolStatePda(REWARD_MINT);
        const vault = findVaultPda(publicKey);
        const mintAuthority = findMintAuthorityPda();

        const userReceiptAta = await ensureAtaExists(RECEIPT_MINT);

        const sig: string = await (program as any).methods
          .stake(new BN(amount))
          .accountsStrict({
            signer: publicKey,
            stakeAccount: stakeAccountPda,
            poolState: poolStatePda,
            rewardMint: REWARD_MINT,
            mintAccount: RECEIPT_MINT,
            associatedTokenAccount: userReceiptAta,
            tokenProgram: (await import("@solana/spl-token")).TOKEN_PROGRAM_ID,
            associatedTokenProgram: (await import("@solana/spl-token")).ASSOCIATED_TOKEN_PROGRAM_ID,
            vault,
            mintAuthority,
            systemProgram: SystemProgram.programId
          })
          .rpc();

        toast.success(<TxToast message={`Staked ${amount} SOL`} sig={sig} />, { id: toastId });
        await refreshAll();
      } catch (e) {
        toast.error(parseAnchorError(e), { id: toastId });
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [publicKey, program, ensureAtaExists, refreshAll, handleInitializeIfNeeded]
  );

  const handleUnstake = useCallback(
    async (amount: number) => {
      if (!publicKey || !program) {
        toast.error("Connect your wallet first");
        return;
      }
      if (!Number.isInteger(amount) || amount <= 0) {
        toast.error("Only whole SOL amounts are supported");
        return;
      }

      setIsLoading(true);
      const toastId = toast.loading("Unstaking…");
      try {
        const stakeAccountPda = findStakeAccountPda(publicKey);
        const poolStatePda = findPoolStatePda(REWARD_MINT);
        const vault = findVaultPda(publicKey);
        const userReceiptAta = await ensureAtaExists(RECEIPT_MINT);

        const sig: string = await (program as any).methods
          .unstake(new BN(amount))
          .accountsStrict({
            signer: publicKey,
            stakeAccount: stakeAccountPda,
            poolState: poolStatePda,
            rewardMint: REWARD_MINT,
            mintAccount: RECEIPT_MINT,
            associatedTokenAccount: userReceiptAta,
            tokenProgram: (await import("@solana/spl-token")).TOKEN_PROGRAM_ID,
            associatedTokenProgram: (await import("@solana/spl-token")).ASSOCIATED_TOKEN_PROGRAM_ID,
            vault,
            systemProgram: SystemProgram.programId
          })
          .rpc();

        toast.success(<TxToast message={`Unstaked ${amount} SOL`} sig={sig} />, { id: toastId });
        await refreshAll();
      } catch (e) {
        toast.error(parseAnchorError(e), { id: toastId });
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [publicKey, program, ensureAtaExists, refreshAll]
  );

  const handleClaimRewards = useCallback(async () => {
    if (!publicKey || !program) {
      toast.error("Connect your wallet first");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Claiming rewards…");
    try {
      const stakeAccountPda = findStakeAccountPda(publicKey);
      const rewardVault = findRewardVaultPda(REWARD_MINT);
      const userRewardAta = await ensureAtaExists(REWARD_MINT);

      const sig: string = await (program as any).methods
        .claimReward()
        .accountsStrict({
          signer: publicKey,
          stakeAccount: stakeAccountPda,
          rewardMint: REWARD_MINT,
          userRewardAccount: userRewardAta,
          rewardVault,
          tokenProgram: (await import("@solana/spl-token")).TOKEN_PROGRAM_ID,
          associatedTokenProgram: (await import("@solana/spl-token")).ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId
        })
        .rpc();

      toast.success(<TxToast message="Rewards claimed" sig={sig} />, { id: toastId });
      await refreshAll();
    } catch (e) {
      toast.error(parseAnchorError(e), { id: toastId });
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, program, ensureAtaExists, refreshAll]);

  // On-chain formula: points = staked * time * POINTS / SECONDS
  // where POINTS = 1_000_000, SECONDS = 3_600
  // So 1 SOL for 1 hour = 1_000_000 points = 1 token.
  // Per-user annual tokens = stakedAmount * (3600*24*365 / 3600) = stakedAmount * 8760
  const TOKENS_PER_SOL_PER_YEAR = 8_760;

  const annualTokens = useMemo(
    () => stakedAmount * TOKENS_PER_SOL_PER_YEAR,
    [stakedAmount]
  );

  // Pool-wide daily emission estimate: totalStaked * 24 tokens/day per SOL
  const dailyEmissions = useMemo(
    () => totalStaked * 24,
    [totalStaked]
  );

  // Estimate staker count: pool state doesn't track this, but if totalStaked > 0
  // there is at least 1 staker
  const estimatedStakers = useMemo(
    () => (totalStaked > 0 ? Math.max(1, stakedAmount > 0 ? 1 : 0) : 0),
    [totalStaked, stakedAmount]
  );

  // Pool APY estimate: tokens_per_sol_per_year. Since this is token-denominated,
  // express as the raw rate (protocol rate). Shown as a simple multiplier.
  const poolAPYEstimate = useMemo(() => {
    // Without a token price, we express APY as the annual token yield per SOL staked
    // 8760 tokens / 1 SOL = 876000% in token terms (which is just the emission rate)
    // More practically: reward_rate from pool config as tokens/year
    if (totalStaked <= 0) return 0;
    return (totalStaked * TOKENS_PER_SOL_PER_YEAR) / totalStaked; // = 8760 tokens/SOL/year
  }, [totalStaked]);

  // Protocol reward rate (from pool config) in tokens/sec
  const protocolRate = useMemo(
    () => rewardRatePtsPerSec / POINTS_PER_TOKEN,
    [rewardRatePtsPerSec]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <UserDashboard
        onStake={handleStake}
        onUnstake={handleUnstake}
        onClaimRewards={handleClaimRewards}
        isLoading={isLoading || stakeLoading || poolLoading}
        stakedAmount={publicKey ? stakedAmount : 0}
        pendingRewards={publicKey ? pendingRewards : 0}
        accumulatedRewards={publicKey ? accumulatedRewards : 0}
        rewardRate={annualTokens}
        totalStaked={totalStaked}
        stakerCount={estimatedStakers}
        poolAPY={TOKENS_PER_SOL_PER_YEAR}
        totalRewardsDistributed={dailyEmissions * 365}
      />
      {/* Helpful hint for users */}
      {publicKey && balance != null && (
        <p className="mt-6 text-xs text-muted-foreground">
          Wallet balance: {balance.toFixed(4)} SOL. Staking uses whole SOL amounts (no decimals).
        </p>
      )}
    </div>
  );
}

