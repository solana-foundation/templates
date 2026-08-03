"use client";

import { useEffect, useState } from "react";

export type PoolView = {
  tokenASymbol: string;
  tokenBSymbol: string;
  reserveA: string;
  reserveB: string;
  price: string;
};

/**
 * Fetches the CPMM pool this template swaps against.
 *
 * TODO(raydium): implement with @raydium-io/raydium-sdk-v2:
 *   - init the SDK (see `src/lib/raydium.ts`)
 *   - `raydium.cpmm.getPoolInfoFromRpc(POOL_ID)` for pool info + rpc data
 *   - map reserves/decimals into `PoolView`
 *
 * Devnet pool discovery (not documented in Raydium's docs — found via API):
 *   curl "https://api-v3-devnet.raydium.io/pools/info/list?poolType=standard&poolSortField=default&sortType=desc&pageSize=3&page=1"
 */
export function usePool() {
  const [pool, setPool] = useState<PoolView | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO(raydium): fetch pool info here.
    setPool(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return { pool, isLoading, error };
}
