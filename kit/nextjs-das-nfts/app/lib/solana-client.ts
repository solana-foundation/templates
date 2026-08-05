import { createClient } from "@solana/kit";
import { walletSigner } from "@solana/kit-plugin-wallet";
import { solanaRpc } from "@solana/kit-plugin-rpc";
import { das } from "./das";

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

const WALLET_CHAINS: Record<ClusterMoniker, `solana:${string}`> = {
  devnet: "solana:devnet",
  testnet: "solana:testnet",
  mainnet: "solana:mainnet",
  // Wallets do not advertise a localnet chain. Sign against devnet so wallets
  // stay discoverable while the RPC below targets the local validator.
  localnet: "solana:devnet",
};

export function getClusterUrl(cluster: ClusterMoniker) {
  return CLUSTER_URLS[cluster];
}

/**
 * DAS is an indexer API rather than validator state, so only some endpoints serve it. The
 * public devnet and mainnet endpoints do; testnet and a local validator do not. Set
 * `NEXT_PUBLIC_DAS_URL` to point at a provider that indexes the cluster you need.
 */
export function getDasUrl(cluster: ClusterMoniker) {
  return process.env.NEXT_PUBLIC_DAS_URL || CLUSTER_URLS[cluster];
}

/** Helius rejects the spec param names on `getNftEditions` and `getTokenAccounts`. */
function isHeliusUrl(url: string) {
  return url.includes("helius-rpc.com");
}

export function getWalletChain(cluster: ClusterMoniker) {
  return WALLET_CHAINS[cluster];
}

export function createAppClient(cluster: ClusterMoniker) {
  const dasUrl = getDasUrl(cluster);

  return createClient()
    .use(walletSigner({ chain: WALLET_CHAINS[cluster] }))
    .use(
      solanaRpc({
        rpcUrl: CLUSTER_URLS[cluster],
        rpcSubscriptionsUrl: WS_URLS[cluster],
      })
    )
    .use(das({ url: dasUrl, heliusCompatibility: isHeliusUrl(dasUrl) }));
}

export type AppClient = ReturnType<typeof createAppClient>;
