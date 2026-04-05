"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Card } from "@/components/ui/card";
import { StakeInputForm } from "./stake-input-form";
import { UnstakeInterface } from "./unstake-interface";
import { RewardsDisplay } from "./rewards-display";
import { PoolStatistics } from "./pool-statistics";

interface UserDashboardProps {
  onStake: (amount: number) => Promise<void>;
  onUnstake: (amount: number) => Promise<void>;
  onClaimRewards: () => Promise<void>;
  isLoading?: boolean;
  stakedAmount?: number;
  pendingRewards?: number;
  accumulatedRewards?: number;
  rewardRate?: number;
  totalStaked?: number;
  stakerCount?: number;
  poolAPY?: number;
  totalRewardsDistributed?: number;
}

export function UserDashboard({
  onStake,
  onUnstake,
  onClaimRewards,
  isLoading = false,
  stakedAmount = 0,
  pendingRewards = 0,
  accumulatedRewards = 0,
  rewardRate = 0,
  totalStaked = 0,
  stakerCount = 0,
  poolAPY = 0,
  totalRewardsDistributed = 0
}: UserDashboardProps) {
  const { publicKey } = useWallet();

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <Card className="glass gradient-purple p-8 border-accent/30">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-accent text-accent-foreground flex items-center justify-center text-base font-semibold">
              S
            </span>
            <h1 className="text-3xl font-bold text-foreground">
              Staking Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground">
            {publicKey
              ? `Connected to ${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`
              : "Connect your wallet to start staking"}
          </p>
        </div>
      </Card>

      {!publicKey && (
        <Card className="bg-destructive/10 border border-destructive/30 p-4 flex gap-3">
          <span className="w-5 h-5 rounded-full border-2 border-destructive flex items-center justify-center text-xs text-destructive flex-shrink-0 mt-0.5">
            !
          </span>
          <div>
            <h3 className="font-semibold text-destructive mb-1">
              Wallet Not Connected
            </h3>
            <p className="text-sm text-destructive/80">
              Please connect your wallet to access staking features. Use the
              wallet button in the top navigation.
            </p>
          </div>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass p-6 space-y-2">
          <p className="text-xs text-muted-foreground">Your Staked</p>
          <p className="text-3xl font-bold text-foreground">
            {stakedAmount.toFixed(2)} SOL
          </p>
          <p className="text-xs text-accent">
            {stakedAmount > 0 && totalStaked > 0
              ? `${Math.min((stakedAmount / totalStaked) * 100, 100).toFixed(2)}% of pool`
              : "Not staking"}
          </p>
        </Card>

        <Card className="glass p-6 space-y-2">
          <p className="text-xs text-muted-foreground">Pending Rewards</p>
          <p className="text-3xl font-bold text-accent glow-purple">
            {pendingRewards.toFixed(4)}
          </p>
          <p className="text-xs text-muted-foreground">tokens ready to claim</p>
        </Card>

        <Card className="glass p-6 space-y-2">
          <p className="text-xs text-muted-foreground">Est. Annual Rewards</p>
          <p className="text-3xl font-bold text-foreground">
            {rewardRate.toFixed(2)}
          </p>
          <p className="text-xs text-accent">tokens per year (estimate)</p>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <StakeInputForm onStake={onStake} isLoading={isLoading} />
          <UnstakeInterface
            onUnstake={onUnstake}
            isLoading={isLoading}
            stakedAmount={stakedAmount}
            lockupPeriod={0}
          />
        </div>

        <RewardsDisplay
          pendingRewards={pendingRewards}
          accumulatedRewards={accumulatedRewards}
          rewardRate={rewardRate}
          onClaimRewards={onClaimRewards}
          isLoading={isLoading}
        />
      </div>

      {/* Pool Statistics */}
      <PoolStatistics
        totalStaked={totalStaked}
        stakerCount={stakerCount}
        poolAPY={poolAPY}
        totalRewardsDistributed={totalRewardsDistributed}
      />
    </div>
  );
}

