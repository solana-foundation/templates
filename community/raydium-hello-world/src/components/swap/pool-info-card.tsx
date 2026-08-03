"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PoolView } from "@/hooks/use-pool";
import { POOL_ID } from "@/lib/raydium";

type PoolInfoCardProps = {
  pool: PoolView | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
};

export function PoolInfoCard({
  pool,
  isLoading,
  error,
  onRetry,
}: PoolInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool</CardTitle>
        <CardDescription>CPMM pool state, read from the RPC</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading pool info…</p>
        ) : error ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-destructive">{error}</p>
            <p className="text-sm text-muted-foreground">
              This devnet pool (
              <code className="font-mono">{POOL_ID.slice(0, 8)}…</code>) may no
              longer exist. Find a live one with the command in the README and
              set <code className="font-mono">NEXT_PUBLIC_POOL_ID</code> in{" "}
              <code className="font-mono">.env.local</code>.
            </p>
            <Button variant="outline" size="sm" onClick={onRetry}>
              Retry
            </Button>
          </div>
        ) : pool ? (
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-muted-foreground">Pair</dt>
            <dd className="text-right font-mono">
              {pool.tokenASymbol} / {pool.tokenBSymbol}
            </dd>
            <dt className="text-muted-foreground">Reserves</dt>
            <dd className="text-right font-mono">
              {pool.reserveA} / {pool.reserveB}
            </dd>
            <dt className="text-muted-foreground">Price</dt>
            <dd className="text-right font-mono">{pool.price}</dd>
          </dl>
        ) : null}
      </CardContent>
    </Card>
  );
}
