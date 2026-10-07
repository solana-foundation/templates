import { useMemo, type PropsWithChildren } from "react";
import {
  ConnectionProvider,
  useLocalStorage,
  WalletModalProvider,
  WalletProvider,
  type WalletError,
} from "@solana/wallet-adapter";
import type { ConnectionConfig } from "@solana/web3.js";
import {
  DEFAULT_CLUSTER,
  getClusterEndpoint,
  getWalletChain,
  isClusterMoniker,
  type ClusterMoniker,
} from "../lib/cluster";
import { ClusterContext } from "../lib/cluster-context";

const CONNECTION_CONFIG: ConnectionConfig = { commitment: "confirmed" };

function onWalletError(error: WalletError) {
  console.error(error);
}

export function Providers({ children }: PropsWithChildren) {
  const [stored, setCluster] = useLocalStorage<ClusterMoniker>(
    "solana-cluster",
    DEFAULT_CLUSTER
  );
  const cluster = isClusterMoniker(stored) ? stored : DEFAULT_CLUSTER;
  const clusterContext = useMemo(
    () => ({ cluster, setCluster }),
    [cluster, setCluster]
  );

  return (
    <ClusterContext.Provider value={clusterContext}>
      <ConnectionProvider
        endpoint={getClusterEndpoint(cluster)}
        config={CONNECTION_CONFIG}
      >
        <WalletProvider chain={getWalletChain(cluster)} onError={onWalletError}>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ClusterContext.Provider>
  );
}
