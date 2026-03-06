"use client";

import { useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getStakingProgram } from "../lib/anchor";
import { Program } from "@coral-xyz/anchor";

export function useAnchorProgram(): Program | null {
  const { connection } = useConnection();
  const wallet = useWallet();

  const { publicKey, signTransaction } = wallet;

  return useMemo(() => {
    if (!publicKey || !signTransaction) return null;
    try {
      return getStakingProgram(connection, wallet);
    } catch {
      return null;
    }
  }, [connection, publicKey, signTransaction, wallet]);
}
