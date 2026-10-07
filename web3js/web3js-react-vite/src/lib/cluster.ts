import type { WalletProviderProps } from "@solana/wallet-adapter";
import { clusterApiUrl } from "@solana/web3.js";

export type ClusterMoniker = "devnet" | "testnet" | "mainnet" | "localnet";

export const CLUSTERS: readonly ClusterMoniker[] = [
  "devnet",
  "testnet",
  "mainnet",
  "localnet",
];

export const DEFAULT_CLUSTER: ClusterMoniker = "devnet";

const ENDPOINTS: Record<ClusterMoniker, string> = {
  devnet: clusterApiUrl("devnet"),
  testnet: clusterApiUrl("testnet"),
  mainnet:
    import.meta.env.VITE_MAINNET_RPC_URL || clusterApiUrl("mainnet-beta"),
  localnet: "http://127.0.0.1:8899",
};

const WALLET_CHAINS: Record<ClusterMoniker, WalletProviderProps["chain"]> = {
  devnet: "solana:devnet",
  testnet: "solana:testnet",
  mainnet: "solana:mainnet",
  localnet: "solana:localnet",
};

export function isClusterMoniker(value: unknown): value is ClusterMoniker {
  return CLUSTERS.includes(value as ClusterMoniker);
}

export function getClusterEndpoint(cluster: ClusterMoniker): string {
  return ENDPOINTS[cluster];
}

export function getWalletChain(
  cluster: ClusterMoniker
): WalletProviderProps["chain"] {
  return WALLET_CHAINS[cluster];
}

export function isPublicMainnetEndpoint(endpoint: string): boolean {
  return endpoint === clusterApiUrl("mainnet-beta");
}
