"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  displaySymbol,
  fromRawAmount,
  loadPool,
  type PoolBundle,
} from "@/lib/raydium";

export type PoolView = {
  tokenASymbol: string;
  tokenBSymbol: string;
  reserveA: string;
  reserveB: string;
  price: string;
};

export function usePool() {
  const { connection } = useConnection();
  const { publicKey, signAllTransactions } = useWallet();
  const [bundle, setBundle] = useState<PoolBundle | null>(null);
  const [pool, setPool] = useState<PoolView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Guards against overlapping refreshes landing out of order — only the
  // latest request may write state.
  const refreshSeq = useRef(0);

  const refresh = useCallback(async () => {
    const seq = ++refreshSeq.current;

    // The old data is stale the moment a refresh starts (e.g. right after
    // our own swap moved the reserves). Clearing it synchronously makes
    // everything derived from it — quotes, the Swap button — invalidate
    // immediately instead of staying executable against outdated state.
    setBundle(null);
    setPool(null);
    setIsLoading(true);
    setError(null);

    try {
      const loaded = await loadPool(connection, publicKey, signAllTransactions);
      if (refreshSeq.current !== seq) return;
      const { poolInfo, rpcData } = loaded;

      const reserveA = fromRawAmount(
        rpcData.baseReserve.toString(),
        poolInfo.mintA.decimals
      );
      const reserveB = fromRawAmount(
        rpcData.quoteReserve.toString(),
        poolInfo.mintB.decimals
      );
      const price =
        Number(reserveA) > 0
          ? (Number(reserveB) / Number(reserveA)).toFixed(6)
          : "—";

      setBundle(loaded);
      setPool({
        tokenASymbol: displaySymbol(poolInfo.mintA),
        tokenBSymbol: displaySymbol(poolInfo.mintB),
        reserveA,
        reserveB,
        price,
      });
    } catch (e) {
      if (refreshSeq.current !== seq) return;
      setBundle(null);
      setPool(null);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      if (refreshSeq.current === seq) setIsLoading(false);
    }
  }, [connection, publicKey, signAllTransactions]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { pool, bundle, isLoading, error, refresh };
}
