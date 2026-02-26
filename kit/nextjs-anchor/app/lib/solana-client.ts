import { createEmptyClient } from "@solana/kit";
import { rpc, airdrop } from "@solana/kit-plugins";

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

export function createSolanaClient(cluster: ClusterMoniker) {
  return createEmptyClient().use(rpc(CLUSTER_URLS[cluster])).use(airdrop());
}

export type SolanaClient = ReturnType<typeof createSolanaClient>;
