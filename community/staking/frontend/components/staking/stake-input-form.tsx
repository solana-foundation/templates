"use client";

import { useCallback, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface StakeInputFormProps {
  onStake: (amount: number) => Promise<void>;
  isLoading?: boolean;
}

export function StakeInputForm({ onStake, isLoading = false }: StakeInputFormProps) {
  const [amount, setAmount] = useState("");
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [walletBalance, setWalletBalance] = useState(0);

  const fetchBalance = useCallback(async () => {
    if (!publicKey) return;
    try {
      const balanceLamports = await connection.getBalance(publicKey);
      setWalletBalance(balanceLamports / LAMPORTS_PER_SOL);
    } catch (err) {
      console.error("[ui] Failed to fetch balance:", err);
    }
  }, [publicKey, connection]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const handleMaxClick = async () => {
    await fetchBalance();
    const maxAmount = Math.max(0, Math.floor(walletBalance - 0.01)); // keep some SOL for fees
    setAmount(String(maxAmount));
  };

  const handleStake = async () => {
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!Number.isInteger(n)) {
      toast.error("Only whole SOL amounts are supported");
      return;
    }
    if (n > walletBalance) {
      toast.error("Insufficient balance");
      return;
    }

    try {
      await onStake(n);
      setAmount("");
      await fetchBalance();
    } catch (err) {
      // Transaction errors are handled (and toasted) by the parent handler.
    }
  };

  return (
    <Card className="glass p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Stake SOL</h3>
        <p className="text-sm text-muted-foreground">
          Stake whole SOL amounts to earn rewards
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="stake-amount" className="text-foreground">
            Amount (SOL)
          </Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="stake-amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step={1}
              min={1}
              className="bg-white/40 border-border text-foreground placeholder:text-muted-foreground"
              disabled={isLoading}
            />
            <Button
              onClick={handleMaxClick}
              variant="outline"
              className="px-3"
              disabled={isLoading || !publicKey}
            >
              Max
            </Button>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Wallet Balance: {walletBalance.toFixed(4)} SOL
          </p>
          {amount && (
            <p className="text-sm text-accent mt-1">
              You&apos;ll stake: {Number(amount).toFixed(0)} SOL
            </p>
          )}
        </div>
      </div>

      <Button
        onClick={handleStake}
        disabled={isLoading || !publicKey || !amount || Number(amount) <= 0}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground glow-purple"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin" />
            Staking...
          </>
        ) : (
          <>
            <span className="w-4 h-4 mr-2 flex items-center justify-center">↑</span>
            Stake Now
          </>
        )}
      </Button>

      {!publicKey && (
        <div className="p-3 bg-muted/50 rounded-lg border border-border text-sm text-muted-foreground">
          Connect your wallet to stake SOL
        </div>
      )}
    </Card>
  );
}

