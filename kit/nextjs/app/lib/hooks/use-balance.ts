"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { type Address, type Lamports } from "@solana/kit";
import { useCluster } from "../../components/cluster-context";
import { useSolanaClient } from "../solana-client-context";

export function useBalance(address?: Address) {
  const { cluster } = useCluster();
  const { rpcClient } = useSolanaClient();

  // Public mainnet RPC rejects browser-origin requests (403)
  const enabled = address && cluster !== "mainnet";

  const { data, isLoading, error, mutate } = useSWR(
    enabled ? (["balance", cluster, address] as const) : null,
    async ([, , addr]) => {
      const { value } = await rpcClient.rpc.getBalance(addr).send();
      return value;
    },
    { refreshInterval: 60_000, revalidateOnFocus: true }
  );

  // Real-time balance via WebSocket (skip on mainnet -- public RPC has no WS)
  useEffect(() => {
    if (!address || cluster === "mainnet") return;

    const abortController = new AbortController();

    const subscribe = async () => {
      try {
        const notifications = await rpcClient.rpcSubscriptions
          .accountNotifications(address, { commitment: "confirmed" })
          .subscribe({ abortSignal: abortController.signal });

        for await (const notification of notifications) {
          const lamports = notification.value.lamports;
          mutate(lamports, { revalidate: false });
        }
      } catch {
        // SWR polling and focus revalidation remain as fallback
      }
    };

    void subscribe();

    return () => {
      abortController.abort();
    };
  }, [address, cluster, rpcClient, mutate]);

  return {
    lamports: (data ?? null) as Lamports | null,
    isLoading,
    error,
    mutate,
  };
}
