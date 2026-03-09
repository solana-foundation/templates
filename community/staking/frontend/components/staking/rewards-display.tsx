"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface RewardsDisplayProps {
  pendingRewards?: number;
  accumulatedRewards?: number;
  rewardRate?: number;
  onClaimRewards: () => Promise<void>;
  isLoading?: boolean;
}

export function RewardsDisplay({
  pendingRewards = 0,
  accumulatedRewards = 0,
  rewardRate = 0,
  onClaimRewards,
  isLoading = false
}: RewardsDisplayProps) {
  const { publicKey } = useWallet();

  const handleClaimRewards = async () => {
    if (!publicKey) {
      toast.error("Connect wallet first");
      return;
    }

    try {
      await onClaimRewards();
    } catch (err) {
      // Transaction errors are handled (and toasted) by the parent handler.
    }
  };

  return (
    <Card className="glass p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Rewards</h3>
        <p className="text-sm text-muted-foreground">
          Earn reward tokens by staking SOL
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 p-4 bg-gradient-purple rounded-lg border border-border">
          <p className="text-xs text-muted-foreground">Pending Rewards</p>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-accent glow-purple">
              {pendingRewards.toFixed(4)}
            </p>
            <p className="text-xs text-muted-foreground">tokens</p>
          </div>
        </div>

        <div className="space-y-2 p-4 bg-gradient-purple rounded-lg border border-border">
          <p className="text-xs text-muted-foreground">Accumulated Rewards</p>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-accent glow-purple">
              {accumulatedRewards.toFixed(4)}
            </p>
            <p className="text-xs text-muted-foreground">tokens</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 p-4 bg-muted/30 rounded-lg border border-border">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Protocol rate</span>
          <span className="text-lg font-semibold text-accent">
            {rewardRate.toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Displayed as an estimate (varies by pool config)
        </p>
      </div>

      <Button
        onClick={handleClaimRewards}
        disabled={isLoading || !publicKey || pendingRewards <= 0}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground glow-purple"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin" />
            Claiming...
          </>
        ) : (
          <>
            <span className="w-4 h-4 mr-2 flex items-center justify-center">⚡</span>
            Claim Rewards
          </>
        )}
      </Button>

      {!publicKey && (
        <div className="p-3 bg-muted/50 rounded-lg border border-border text-sm text-muted-foreground">
          Connect your wallet to claim rewards
        </div>
      )}
    </Card>
  );
}

