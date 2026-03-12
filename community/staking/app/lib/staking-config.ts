import { PublicKey, clusterApiUrl } from '@solana/web3.js'
import idlJson from '@/types/staking_program.json'

type ClusterName = 'localnet' | 'devnet' | 'testnet' | 'mainnet-beta' | 'mainnet'

function getClusterName(): ClusterName {
  const configured = process.env.NEXT_PUBLIC_SOLANA_NETWORK
  if (
    configured === 'localnet' ||
    configured === 'devnet' ||
    configured === 'testnet' ||
    configured === 'mainnet-beta' ||
    configured === 'mainnet'
  ) {
    return configured
  }

  return 'devnet'
}

function getRpcEndpoint(): string {
  const configured = process.env.NEXT_PUBLIC_RPC_URL || process.env.SOLANA_RPC_URL
  if (configured) return configured

  const cluster = getClusterName()
  if (cluster === 'localnet') return 'http://127.0.0.1:8899'
  if (cluster === 'mainnet') return clusterApiUrl('mainnet-beta')

  return clusterApiUrl(cluster)
}

function getProgramId(): PublicKey {
  const configured = process.env.NEXT_PUBLIC_PROGRAM_ID || idlJson.address
  return new PublicKey(configured)
}

export const STAKING_CLUSTER = getClusterName()
export const STAKING_RPC_ENDPOINT = getRpcEndpoint()
export const STAKING_PROGRAM_ID = getProgramId()
export const STAKING_CLUSTER_LABEL = STAKING_CLUSTER === 'mainnet-beta' ? 'mainnet-beta' : STAKING_CLUSTER

export function getExplorerClusterParam(): string | null {
  const configuredRpc = process.env.NEXT_PUBLIC_RPC_URL
  if (STAKING_CLUSTER === 'localnet') return null
  if (configuredRpc?.includes('devnet')) return 'devnet'
  if (configuredRpc?.includes('testnet')) return 'testnet'
  if (configuredRpc?.includes('mainnet')) return 'mainnet-beta'
  if (configuredRpc) return null
  if (STAKING_CLUSTER === 'mainnet') return null
  return STAKING_CLUSTER
}
