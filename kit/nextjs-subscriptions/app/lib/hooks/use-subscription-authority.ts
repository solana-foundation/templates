"use client";

import useSWR from "swr";
import type { Address } from "@solana/kit";
import { useCluster } from "../../components/cluster-context";
import { useWallet } from "../wallet/context";
import { useSubscriptionsClient } from "./use-subscriptions-client";

export function useSubscriptionAuthority(mint?: Address) {
  const { cluster } = useCluster();
  const { wallet } = useWallet();
  const client = useSubscriptionsClient();
  const user = wallet?.account.address;

  return useSWR(
    client && user && mint
      ? (["sub-authority", cluster, user, mint] as const)
      : null,
    () =>
      client!.subscriptions.queries.isSubscriptionAuthorityInitialized(
        user!,
        mint!
      ),
    { revalidateOnFocus: false }
  );
}
