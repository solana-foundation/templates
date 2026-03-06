"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAnchorProgram } from "./useAnchorProgram";
import { findStakeAccountPda } from "../lib/pdas";
import { StakeAccount } from "../lib/types";

export function useStakeAccount() {
  const { publicKey } = useWallet();
  const program = useAnchorProgram();
  const [stakeAccount, setStakeAccount] = useState<StakeAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!program || !publicKey) return;
    setLoading(true);
    setError(null);
    try {
      const pda = findStakeAccountPda(publicKey);
      const data = await (program.account as any).stakeAccount.fetch(pda);
      setStakeAccount(data as StakeAccount);
    } catch (e: any) {
      if (e?.message?.includes("Account does not exist")) {
        setStakeAccount(null);
      } else {
        setError(e?.message ?? "Failed to fetch stake account");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program, publicKey]);

  return { stakeAccount, loading, error, refresh };
}
