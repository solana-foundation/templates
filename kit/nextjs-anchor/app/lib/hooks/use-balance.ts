"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { type Address, type Lamports } from "@solana/kit";
import { createClusterRpc, createClusterRpcSubscriptions } from "../cluster";
import { useCluster } from "../../components/cluster-context";

export function useBalance(address?: Address) {
  const { cluster } = useCluster();

  const { data, isLoading, error, mutate } = useSWR(
    address ? (["balance", cluster, address] as const) : null,
    async ([, c, addr]) => {
      const rpc = createClusterRpc(c);
      const { value } = await rpc.getBalance(addr).send();
      return value;
    },
    { refreshInterval: 10_000, revalidateOnFocus: true }
  );

  useEffect(() => {
    if (!address) return;

    const abortController = new AbortController();
    const subscriptions = createClusterRpcSubscriptions(cluster);

    (async () => {
      try {
        const notifications = await subscriptions
          .accountNotifications(address, { commitment: "confirmed" })
          .subscribe({ abortSignal: abortController.signal });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for await (const _ of notifications) {
          mutate();
        }
      } catch {
        // Subscription aborted on cleanup or connection lost — SWR polling covers us.
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [address, cluster, mutate]);

  return {
    lamports: (data ?? null) as Lamports | null,
    isLoading,
    error,
    mutate,
  };
}
