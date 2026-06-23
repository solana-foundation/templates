"use client";

import useSWR from "swr";
import type { Delegation } from "@solana/subscriptions";
import { useCluster } from "../../components/cluster-context";
import { useWallet } from "../wallet/context";
import { useSubscriptionsClient } from "./use-subscriptions-client";

type SubscriptionDelegation = Extract<Delegation, { kind: "subscription" }>;

export function useMySubscriptions() {
  const { cluster } = useCluster();
  const { wallet } = useWallet();
  const client = useSubscriptionsClient();
  const me = wallet?.account.address;

  return useSWR(
    client && me ? (["my-subscriptions", cluster, me] as const) : null,
    async () => {
      const all = await client!.subscriptions.queries.delegationsByDelegator(
        me!
      );
      return all.filter(
        (d): d is SubscriptionDelegation => d.kind === "subscription"
      );
    },
    { revalidateOnFocus: false }
  );
}
