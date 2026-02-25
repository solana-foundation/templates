"use client";

import { useState, useCallback } from "react";
import { useSWRConfig } from "swr";
import type { Instruction } from "@solana/kit";
import { sendTransaction } from "../send-transaction";
import { createClusterRpc } from "../cluster";
import { useWallet } from "../wallet/context";
import { useCluster } from "../../components/cluster-context";

export function useSendTransaction() {
  const { signer } = useWallet();
  const { cluster } = useCluster();
  const { mutate } = useSWRConfig();
  const [isSending, setIsSending] = useState(false);

  const send = useCallback(
    async ({ instructions }: { instructions: readonly Instruction[] }) => {
      if (!signer) throw new Error("Wallet not connected");

      setIsSending(true);
      try {
        const rpc = createClusterRpc(cluster);
        const signature = await sendTransaction({
          rpc,
          instructions,
          feePayer: signer,
        });

        mutate(
          (key: unknown) => Array.isArray(key) && key[0] === "balance"
        );

        return signature;
      } finally {
        setIsSending(false);
      }
    },
    [signer, cluster, mutate]
  );

  return { send, isSending };
}
