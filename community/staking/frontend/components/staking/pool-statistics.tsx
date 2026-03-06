"use client";

import { Card } from "@/components/ui/card";

interface PoolStatisticsProps {
  totalStaked?: number;
  stakerCount?: number;
  poolAPY?: number;
  totalRewardsDistributed?: number;
}

export function PoolStatistics({
  totalStaked = 0,
  stakerCount = 0,
  poolAPY = 0,
  totalRewardsDistributed = 0
}: PoolStatisticsProps) {
  const stats = [
    { label: "Total Staked", value: `${totalStaked.toFixed(0)} SOL` },
    { label: "Stakers", value: stakerCount > 0 ? stakerCount : "—" },
    { label: "Reward Rate", value: `${poolAPY.toLocaleString()} tkn/SOL/yr` },
    { label: "Total Rewards", value: `${totalRewardsDistributed.toLocaleString()} tokens/yr` }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="glass p-4 space-y-2">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-xl md:text-2xl font-bold text-foreground break-words">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <Card className="glass p-6 space-y-4">
        <h4 className="text-foreground font-semibold">Pool Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">Average Stake</p>
            <p className="text-foreground font-semibold">
              {stakerCount > 0 ? (totalStaked / stakerCount).toFixed(2) : "0"} SOL
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Daily Emissions</p>
            <p className="text-foreground font-semibold">
              {(totalStaked * 24).toFixed(2)} tokens/day
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Pool Status</p>
            <p className="text-accent font-semibold">Active</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

