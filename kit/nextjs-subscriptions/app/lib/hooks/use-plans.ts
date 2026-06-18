"use client";

import useSWR from "swr";
import type { Address } from "@solana/kit";
import { useCluster } from "../../components/cluster-context";
import { useSubscriptionsClient } from "./use-subscriptions-client";

export function usePlans(owner?: Address) {
  const { cluster } = useCluster();
  const client = useSubscriptionsClient();

  return useSWR(
    client && owner ? (["plans", cluster, owner] as const) : null,
    () => client!.subscriptions.queries.plansForOwner(owner!),
    { revalidateOnFocus: false }
  );
}
