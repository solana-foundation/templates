import type { SolanaChain } from '@solana/wallet-standard-chains'

/**
 * A network the app can talk to. The `id` is the wallet-standard chain identifier, which is what
 * ties the three moving parts together: the wallet plugin filters discovered wallets by it, the RPC
 * plugin is picked from it, and the wallet uses it to decide which network to simulate against.
 */
export type Cluster = {
  /** The `?cluster=` value Solana Explorer expects. Mainnet is the explorer default and needs none. */
  explorerParam: string
  /**
   * A web faucet that funds accounts on this network, if one exists.
   *
   * Worth offering because the RPC airdrop is aggressively rate limited and returns 429 far more
   * often than it succeeds. Localnet has no web faucet and needs none — its own airdrop is instant
   * and unlimited — and Mainnet has no faucet at all.
   */
  faucetUrl?: string
  id: SolanaChain
  label: string
  rpcUrl: string
}

const DEVNET: Cluster = {
  explorerParam: 'devnet',
  faucetUrl: 'https://faucet.solana.com',
  id: 'solana:devnet',
  label: 'Devnet',
  rpcUrl: import.meta.env.VITE_RPC_URL_DEVNET || 'https://api.devnet.solana.com',
}

const TESTNET: Cluster = {
  explorerParam: 'testnet',
  faucetUrl: 'https://faucet.solana.com',
  id: 'solana:testnet',
  label: 'Testnet',
  rpcUrl: import.meta.env.VITE_RPC_URL_TESTNET || 'https://api.testnet.solana.com',
}

const MAINNET: Cluster = {
  explorerParam: '',
  id: 'solana:mainnet',
  label: 'Mainnet',
  rpcUrl: import.meta.env.VITE_RPC_URL_MAINNET ?? '',
}

const LOCALNET: Cluster = {
  explorerParam: 'custom',
  id: 'solana:localnet',
  label: 'Localnet',
  rpcUrl: import.meta.env.VITE_RPC_URL_LOCALNET || 'http://localhost:8899',
}

/** Every cluster the app can build a client for, offered or not. Lookups resolve against this. */
const KNOWN_CLUSTERS: readonly Cluster[] = [DEVNET, TESTNET, MAINNET, LOCALNET]

export const DEFAULT_CLUSTER: Cluster = DEVNET

/**
 * The clusters offered in the network picker.
 *
 * Localnet is always offered, so developing against a local validator is one click rather than a
 * configuration step. It points at `http://localhost:8899` unless `VITE_RPC_URL_LOCALNET` says
 * otherwise, and the app detects an unreachable validator and says how to start one instead of
 * failing silently.
 *
 * Mainnet is the exception: it appears only once `VITE_RPC_URL_MAINNET` names an endpoint. There is
 * no sensible default to fall back on — the public endpoint is rate limited and serves no
 * websocket, so subscriptions fail against it and the balance never settles. An unreachable
 * localnet is a validator you have not started yet; an unusable mainnet default is a dead end.
 */
export const CLUSTERS: readonly Cluster[] = [DEVNET, TESTNET, ...(MAINNET.rpcUrl ? [MAINNET] : []), LOCALNET]

export function getCluster(id: string): Cluster {
  return KNOWN_CLUSTERS.find((cluster) => cluster.id === id) ?? DEFAULT_CLUSTER
}

/** Links a transaction signature or an address to Solana Explorer on the given cluster. */
export function getExplorerUrl(cluster: Cluster, path: string): string {
  const url = new URL(path, 'https://explorer.solana.com')
  if (cluster.explorerParam) {
    url.searchParams.set('cluster', cluster.explorerParam)
  }
  if (cluster.id === 'solana:localnet') {
    url.searchParams.set('customUrl', cluster.rpcUrl)
  }
  return url.toString()
}

/**
 * Links to the cluster's web faucet with the network and address pre-filled, if the cluster has
 * one. The faucet takes the same `cluster` values the explorer does.
 */
export function getFaucetUrl(cluster: Cluster, address: string): string | undefined {
  if (!cluster.faucetUrl) {
    return undefined
  }
  const url = new URL(cluster.faucetUrl)
  url.searchParams.set('cluster', cluster.explorerParam)
  url.searchParams.set('walletAddress', address)
  return url.toString()
}

/**
 * Genesis hashes of the three public networks, verified against each endpoint.
 *
 * A genesis hash identifies a network exactly, so it answers two questions in one call: whether the
 * endpoint is reachable at all, and which network it actually is. Anything unrecognised is a
 * validator someone started themselves, which for this app means Localnet.
 */
const GENESIS_HASHES: Readonly<Record<string, SolanaChain>> = {
  '4uhcVJyU9pJkvQyS88uRDiswHXSCkY3zQawwpjk2NsNY': 'solana:testnet',
  '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d': 'solana:mainnet',
  EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG: 'solana:devnet',
}

export function identifyCluster(genesisHash: string): SolanaChain {
  return GENESIS_HASHES[genesisHash] ?? 'solana:localnet'
}
