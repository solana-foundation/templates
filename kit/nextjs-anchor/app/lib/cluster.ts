import { createSolanaRpc, createSolanaRpcSubscriptions } from "@solana/kit";

export type ClusterMoniker = "devnet" | "testnet" | "mainnet" | "localnet";

export const CLUSTERS: ClusterMoniker[] = [
  "devnet",
  "testnet",
  "mainnet",
  "localnet",
];

const CLUSTER_URLS: Record<
  ClusterMoniker,
  { endpoint: string; wsEndpoint: string }
> = {
  devnet: {
    endpoint: "https://api.devnet.solana.com",
    wsEndpoint: "wss://api.devnet.solana.com",
  },
  testnet: {
    endpoint: "https://api.testnet.solana.com",
    wsEndpoint: "wss://api.testnet.solana.com",
  },
  mainnet: {
    endpoint: "https://api.mainnet-beta.solana.com",
    wsEndpoint: "wss://api.mainnet-beta.solana.com",
  },
  localnet: {
    endpoint: "http://localhost:8899",
    wsEndpoint: "ws://localhost:8900",
  },
};

export function getClusterUrls(cluster: ClusterMoniker) {
  return CLUSTER_URLS[cluster];
}

export function createClusterRpc(cluster: ClusterMoniker) {
  return createSolanaRpc(CLUSTER_URLS[cluster].endpoint);
}

export function createClusterRpcSubscriptions(cluster: ClusterMoniker) {
  return createSolanaRpcSubscriptions(CLUSTER_URLS[cluster].wsEndpoint);
}
