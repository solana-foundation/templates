"use client";

import { useMemo } from "react";
import { useWallet } from "../wallet/context";
import { useCluster } from "../../components/cluster-context";
import {
  createSubscriptionsClient,
  type SubscriptionsClient,
} from "../subscriptions-client";

export function useSubscriptionsClient(): SubscriptionsClient | null {
  const { signer } = useWallet();
  const { cluster } = useCluster();

  return useMemo(
    () => (signer ? createSubscriptionsClient(cluster, signer) : null),
    [cluster, signer]
  );
}
