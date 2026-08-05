"use client";

import { useMemo } from "react";
import { type Address, type Lamports } from "@solana/kit";
import { useTrackedDataSWR } from "@solana/react/swr";
import { useCluster } from "../../components/cluster-context";
import { useAppClient } from "../client-provider";

export function useBalance(address?: Address) {
  const { cluster } = useCluster();
  const client = useAppClient();

  const spec = useMemo(
    () =>
      address
        ? {
            initialValueSource: client.rpc.getBalance(address, {
              commitment: "confirmed",
            }),
            initialValueMapper: (lamports: Lamports) => lamports,
            streamSource: client.rpcSubscriptions.accountNotifications(
              address,
              { commitment: "confirmed" }
            ),
            streamValueMapper: ({ lamports }: { lamports: Lamports }) =>
              lamports,
          }
        : null,
    [client, address]
  );

  const { data, error } = useTrackedDataSWR(
    address ? (["balance", cluster, address] as const) : null,
    spec
  );

  return {
    lamports: data?.value ?? null,
    isLoading: address != null && data == null && error == null,
    error,
  };
}
