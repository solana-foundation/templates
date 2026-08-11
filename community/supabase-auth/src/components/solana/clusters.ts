export type ClusterId = 'devnet' | 'testnet' | 'mainnet-beta'

export type ClusterOption = Readonly<{
  id: ClusterId
  label: string
  endpoint: string
  websocket: string
  /** The `solana:*` chain identifier wallets advertise for this cluster. */
  chain: `solana:${string}`
}>

export const CLUSTERS: ClusterOption[] = [
  {
    id: 'devnet',
    label: 'Devnet',
    endpoint: 'https://api.devnet.solana.com',
    websocket: 'wss://api.devnet.solana.com',
    chain: 'solana:devnet',
  },
  {
    id: 'testnet',
    label: 'Testnet',
    endpoint: 'https://api.testnet.solana.com',
    websocket: 'wss://api.testnet.solana.com',
    chain: 'solana:testnet',
  },
  {
    id: 'mainnet-beta',
    label: 'Mainnet Beta',
    endpoint: 'https://api.mainnet-beta.solana.com',
    websocket: 'wss://api.mainnet-beta.solana.com',
    chain: 'solana:mainnet',
  },
]

export const DEFAULT_CLUSTER = CLUSTERS[0]

export function resolveCluster(id: string | undefined): ClusterOption {
  return CLUSTERS.find((cluster) => cluster.id === id) ?? DEFAULT_CLUSTER
}
