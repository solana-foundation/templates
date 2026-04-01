"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { type Address, type Lamports } from "@solana/kit";
import { useCluster } from "../../components/cluster-context";
import { useSolanaClient } from "../solana-client-context";

export function useBalance(address?: Address) {
  const { cluster } = useCluster();
  const client = useSolanaClient();

  const { data, isLoading, error, mutate } = useSWR(
    address ? (["balance", cluster, address] as const) : null,
    async ([, , addr]) => {
      const { value } = await client.rpc.getBalance(addr).send();
      return value;
    },
    { refreshInterval: 60_000, revalidateOnFocus: true }
  );

  useEffect(() => {
    if (!address) return;

    const abortController = new AbortController();

    const subscribe = async () => {
      try {
        const notifications = await client.rpcSubscriptions
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
  }, [address, client, mutate]);

  return {
    lamports: (data ?? null) as Lamports | null,
    isLoading,
    error,
    mutate,
  };
}
