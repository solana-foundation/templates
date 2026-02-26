"use client";

import { useState, useCallback } from "react";
import { useSWRConfig } from "swr";
import type { Instruction } from "@solana/kit";
import { sendTransaction } from "../send-transaction";
import { useWallet } from "../wallet/context";
import { useSolanaClient } from "../solana-client-context";

export function useSendTransaction() {
  const { signer } = useWallet();
  const client = useSolanaClient();
  const { mutate } = useSWRConfig();
  const [isSending, setIsSending] = useState(false);

  const send = useCallback(
    async ({ instructions }: { instructions: readonly Instruction[] }) => {
      if (!signer) throw new Error("Wallet not connected");

      setIsSending(true);
      try {
        const signature = await sendTransaction({
          rpc: client.rpc,
          instructions,
          feePayer: signer,
        });

        mutate((key: unknown) => Array.isArray(key) && key[0] === "balance");

        return signature;
      } finally {
        setIsSending(false);
      }
    },
    [signer, client, mutate]
  );

  return { send, isSending };
}
