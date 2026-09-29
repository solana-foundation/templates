"use client";

import { useMemo, type ReactNode } from "react";
import { ClientProvider, useClient } from "@solana/react";
import {
  createAppClient,
  type AppClient,
  type RpcUrlOverrides,
} from "./solana-client";
import { useCluster } from "../components/cluster-context";

export function AppClientProvider({
  children,
  urls,
}: {
  children: ReactNode;
  urls?: RpcUrlOverrides;
}) {
  const { cluster } = useCluster();
  const client = useMemo(() => createAppClient(cluster, urls), [cluster, urls]);

  return <ClientProvider client={client}>{children}</ClientProvider>;
}

export function useAppClient() {
  return useClient<AppClient>();
}
