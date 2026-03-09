"use client";

import { useEffect, useState } from "react";
import { useAnchorProgram } from "./useAnchorProgram";
import { findPoolStatePda } from "../lib/pdas";
import { PoolState } from "../lib/types";
import { REWARD_MINT } from "../lib/config";

export function usePoolState() {
  const program = useAnchorProgram();
  const [poolState, setPoolState] = useState<PoolState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!program) return;
    setLoading(true);
    setError(null);
    try {
      const pda = findPoolStatePda(REWARD_MINT);
      const data = await (program.account as any).poolState.fetch(pda);
      setPoolState(data as PoolState);
    } catch (e: any) {
      if (e?.message?.includes("Account does not exist")) {
        setPoolState(null);
      } else {
        setError(e?.message ?? "Failed to fetch pool state");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program]);

  return { poolState, loading, error, refresh };
}
