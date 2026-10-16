import type { WalletProviderProps } from "@solana/wallet-adapter";

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
  // The public mainnet endpoint rejects most browser traffic. Set
  // NEXT_PUBLIC_MAINNET_RPC_URL to a provider endpoint for real use.
  mainnet:
    process.env.NEXT_PUBLIC_MAINNET_RPC_URL ||
    "https://api.mainnet-beta.solana.com",
  localnet: "http://localhost:8899",
};

const WALLET_CHAINS: Record<ClusterMoniker, WalletProviderProps["chain"]> = {
  devnet: "solana:devnet",
  testnet: "solana:testnet",
  mainnet: "solana:mainnet",
  localnet: "solana:localnet",
};

export function getClusterUrl(cluster: ClusterMoniker) {
  return CLUSTER_URLS[cluster];
}

export function getWalletChain(cluster: ClusterMoniker) {
  return WALLET_CHAINS[cluster];
}
