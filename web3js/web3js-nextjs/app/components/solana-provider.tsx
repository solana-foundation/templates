"use client";

import type { ReactNode } from "react";
import {
  ConnectionProvider,
  WalletModalProvider,
  WalletProvider,
  type WalletError,
} from "@solana/wallet-adapter";
import { getClusterUrl, getWalletChain } from "../lib/cluster";
import { useCluster } from "./cluster-context";

function onWalletError(error: WalletError) {
  console.error(error);
}

export function SolanaProvider({ children }: { children: ReactNode }) {
  const { cluster } = useCluster();

  return (
    <ConnectionProvider endpoint={getClusterUrl(cluster)}>
      <WalletProvider chain={getWalletChain(cluster)} onError={onWalletError}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
