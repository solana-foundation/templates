"use client";

import React, { useEffect, useId } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSwap } from "@/hooks/use-swap";
import { ellipsify, getExplorerUrl } from "@/lib/explorer";
import {
  displaySymbol,
  fromRawAmount,
  DEFAULT_AMOUNT_RAW,
  INPUT_MINT,
  SLIPPAGE,
  type PoolBundle,
} from "@/lib/raydium";

type SwapCardProps = {
  bundle: PoolBundle | null;
  amountIn: string;
  onAmountInChange: (value: string) => void;
  onSwapConfirmed?: () => void;
};

export function SwapCard({
  bundle,
  amountIn,
  onAmountInChange,
  onSwapConfirmed,
}: SwapCardProps) {
  const { connected } = useWallet();
  const { quote, quoteError, status, swap } = useSwap(
    bundle,
    amountIn,
    onSwapConfirmed
  );
  const amountInputId = useId();

  const baseIsInput = bundle
    ? INPUT_MINT === bundle.poolInfo.mintA.address
    : true;
  const inMint = bundle
    ? baseIsInput
      ? bundle.poolInfo.mintA
      : bundle.poolInfo.mintB
    : null;
  const outMint = bundle
    ? baseIsInput
      ? bundle.poolInfo.mintB
      : bundle.poolInfo.mintA
    : null;

  useEffect(() => {
    if (bundle && inMint && !amountIn && DEFAULT_AMOUNT_RAW) {
      onAmountInChange(fromRawAmount(DEFAULT_AMOUNT_RAW, inMint.decimals));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundle]);

  const canSwap =
    connected && !!bundle && !!quote && status.state !== "swapping";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Swap</CardTitle>
        <CardDescription>
          {inMint && outMint
            ? `${displaySymbol(inMint)} for ${displaySymbol(outMint)}`
            : "Quote locally, execute on devnet"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor={amountInputId}>
            You pay ({inMint ? displaySymbol(inMint) : "…"})
          </Label>
          <Input
            id={amountInputId}
            className="font-mono"
            inputMode="decimal"
            placeholder="0.0"
            value={amountIn}
            onChange={(e) => onAmountInChange(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>
            You receive ({outMint ? displaySymbol(outMint) : "…"}, estimated)
          </Label>
          <output className="rounded-md border border-border-low bg-cream px-3 py-2 font-mono text-sm text-muted">
            {quote?.amountOut ?? "—"}
          </output>
        </div>

        {quote && (
          <p className="text-xs text-muted-foreground">
            Trade fee: {quote.tradeFee} {inMint ? displaySymbol(inMint) : ""} ·
            Slippage tolerance: {SLIPPAGE * 100}%
          </p>
        )}
        {quoteError && <p className="text-xs text-destructive">{quoteError}</p>}

        <Button disabled={!canSwap} onClick={() => void swap()}>
          {!connected
            ? "Connect a wallet to swap"
            : status.state === "swapping"
              ? "Approve in wallet, then confirming…"
              : "Swap"}
        </Button>

        {status.state === "confirmed" && (
          <p className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
            Swapped!{" "}
            <a
              className="font-mono underline underline-offset-2"
              href={getExplorerUrl(status.txId)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {ellipsify(status.txId)} <span aria-hidden="true">&rarr;</span>
            </a>
            <button
              type="button"
              className="cursor-pointer rounded-md border border-border-low px-2 py-0.5 text-muted transition hover:bg-cream"
              onClick={() => {
                void navigator.clipboard.writeText(status.txId);
                toast.info("Signature copied");
              }}
            >
              Copy signature
            </button>
          </p>
        )}
        {status.state === "error" && (
          <p className="text-xs text-destructive">
            Swap failed: {status.message}. If this mentions insufficient funds,
            remember wrapping SOL costs a little extra rent on top of the swap
            amount.
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          Executes on devnet. Get devnet SOL at{" "}
          <a className="underline" href="https://faucet.solana.com">
            faucet.solana.com
          </a>
          .
        </p>
      </CardContent>
    </Card>
  );
}
