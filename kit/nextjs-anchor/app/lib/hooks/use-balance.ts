"use client";

import useSWR from "swr";
import { type Address, type Lamports } from "@solana/kit";
import { createClusterRpc } from "../cluster";
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

  return {
    lamports: (data ?? null) as Lamports | null,
    isLoading,
    error,
    mutate,
  };
}
