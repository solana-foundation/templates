"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface UnstakeInterfaceProps {
  onUnstake: (amount: number) => Promise<void>;
  isLoading?: boolean;
  stakedAmount?: number;
  lockupPeriod?: number; // in days
}

export function UnstakeInterface({
  onUnstake,
  isLoading = false,
  stakedAmount = 0,
  lockupPeriod = 0
}: UnstakeInterfaceProps) {
  const [amount, setAmount] = useState("");
  const { publicKey } = useWallet();

  const handleUnstakeAll = () => {
    setAmount(String(Math.max(0, Math.floor(stakedAmount))));
  };

  const handleUnstake = async () => {
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!Number.isInteger(n)) {
      toast.error("Only whole SOL amounts are supported");
      return;
    }
    if (n > stakedAmount) {
      toast.error("Amount exceeds staked balance");
      return;
    }
    if (lockupPeriod > 0) {
      toast.error(`Your stake is locked for ${lockupPeriod} more days`);
      return;
    }

    try {
      await onUnstake(n);
      setAmount("");
    } catch (err) {
      // Transaction errors are handled (and toasted) by the parent handler.
    }
  };

  const isLocked = lockupPeriod > 0;

  return (
    <Card className="glass p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Unstake SOL</h3>
        <p className="text-sm text-muted-foreground">
          Withdraw your staked SOL from the pool
        </p>
      </div>

      {isLocked && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-2">
          <span className="w-4 h-4 rounded-full border-2 border-destructive flex-shrink-0 mt-0.5 flex items-center justify-center text-[10px] text-destructive">
            !
          </span>
          <div className="text-sm text-destructive/90">
            Your stake is locked for {lockupPeriod} more day{lockupPeriod !== 1 ? "s" : ""}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="unstake-amount" className="text-foreground">
            Amount (SOL)
          </Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="unstake-amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step={1}
              min={1}
              className="bg-white/40 border-border text-foreground placeholder:text-muted-foreground"
              disabled={isLoading || isLocked}
            />
            <Button
              onClick={handleUnstakeAll}
              variant="outline"
              className="px-3"
              disabled={isLoading || stakedAmount === 0 || isLocked}
            >
              All
            </Button>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Staked Balance: {stakedAmount.toFixed(2)} SOL
          </p>
          {amount && !isLocked && (
            <p className="text-sm text-accent mt-1">
              You&apos;ll unstake: {Number(amount).toFixed(0)} SOL
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleUnstake}
          disabled={isLoading || !publicKey || !amount || Number(amount) <= 0 || isLocked}
          className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground glow-purple"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin" />
              Unstaking...
            </>
          ) : (
            <>
              <span className="w-4 h-4 mr-2 flex items-center justify-center">↓</span>
              Unstake
            </>
          )}
        </Button>
      </div>

      {!publicKey && (
        <div className="p-3 bg-muted/50 rounded-lg border border-border text-sm text-muted-foreground">
          Connect your wallet to unstake
        </div>
      )}
    </Card>
  );
}

