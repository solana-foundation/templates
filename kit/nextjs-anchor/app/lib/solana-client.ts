import { createEmptyClient } from "@solana/kit";
import { rpc } from "@solana/kit-plugin-rpc";
import { airdrop } from "@solana/kit-plugin-airdrop";

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

export function getClusterUrl(cluster: ClusterMoniker) {
  return CLUSTER_URLS[cluster];
}

export function getClusterWsConfig(cluster: ClusterMoniker) {
  return cluster === "localnet" ? { url: "ws://localhost:8900" } : undefined;
}

export function createSolanaClient(cluster: ClusterMoniker) {
  const url = CLUSTER_URLS[cluster];
  const rpcSubscriptionsConfig =
    cluster === "localnet" ? { url: "ws://localhost:8900" } : undefined;
  return createEmptyClient()
    .use(rpc(url, rpcSubscriptionsConfig))
    .use(airdrop());
}

export type SolanaClient = ReturnType<typeof createSolanaClient>;
