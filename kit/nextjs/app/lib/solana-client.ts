import {
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  type TransactionSigner,
} from "@solana/kit";
import { createClient } from "@solana/kit-client-rpc";

export type ClusterMoniker = "devnet" | "testnet" | "mainnet" | "localnet";

export const CLUSTERS: ClusterMoniker[] = [
  "devnet",
  "testnet",
  "mainnet",
  "localnet",
];

const CLUSTER_URLS: Record<ClusterMoniker, string> = {
  devnet: "https://api.devnet.solana.com",
  testnet: "https://api.testnet.solana.com",
  mainnet: "https://api.mainnet-beta.solana.com",
  localnet: "http://localhost:8899",
};

const WS_URLS: Record<ClusterMoniker, string> = {
  devnet: "wss://api.devnet.solana.com",
  testnet: "wss://api.testnet.solana.com",
  mainnet: "wss://api.mainnet-beta.solana.com",
  localnet: "ws://localhost:8900",
};

export function getClusterUrl(cluster: ClusterMoniker) {
  return CLUSTER_URLS[cluster];
}

export function getClusterWsConfig(cluster: ClusterMoniker) {
  return cluster === "localnet" ? { url: WS_URLS[cluster] } : undefined;
}

/**
 * Creates an RPC client for balance fetching and subscriptions.
 * Does not require a payer/signer.
 */
export function createRpcClient(cluster: ClusterMoniker) {
  return {
    rpc: createSolanaRpc(CLUSTER_URLS[cluster]),
    rpcSubscriptions: createSolanaRpcSubscriptions(WS_URLS[cluster]),
  };
}

/**
 * Creates a full Kit client via @solana/kit-client-rpc.
 * Requires a payer for transaction planning and sending.
 */
export function createSolanaClient(
  cluster: ClusterMoniker,
  payer: TransactionSigner
) {
  return createClient({
    url: getClusterUrl(cluster),
    rpcSubscriptionsConfig: getClusterWsConfig(cluster),
    payer,
  });
}

export type RpcClient = ReturnType<typeof createRpcClient>;
export type SolanaClient = ReturnType<typeof createSolanaClient>;
