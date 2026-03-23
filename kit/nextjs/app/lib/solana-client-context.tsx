"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import {
  createRpcClient,
  createSolanaClient,
  type RpcClient,
  type SolanaClient,
} from "./solana-client";
import { useCluster } from "../components/cluster-context";
import { useWallet } from "./wallet/context";

type SolanaClientContextValue = {
  /** Always available -- RPC + subscriptions for reading data */
  rpcClient: RpcClient;
  /** Available when wallet is connected -- full client with payer for transactions */
  client: SolanaClient | null;
};

const SolanaClientContext = createContext<SolanaClientContextValue | null>(
  null
);

export function SolanaClientProvider({ children }: { children: ReactNode }) {
  const { cluster } = useCluster();
  const { signer } = useWallet();

  const rpcClient = useMemo(() => createRpcClient(cluster), [cluster]);

  const client = useMemo(
    () => (signer ? createSolanaClient(cluster, signer) : null),
    [cluster, signer]
  );

  return (
    <SolanaClientContext.Provider value={{ rpcClient, client }}>
      {children}
    </SolanaClientContext.Provider>
  );
}

export function useSolanaClient() {
  const ctx = useContext(SolanaClientContext);
  if (!ctx)
    throw new Error("useSolanaClient must be used within SolanaClientProvider");
  return ctx;
}
