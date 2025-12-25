export type ClusterOption = Readonly<{
  id: string
  label: string
  endpoint: string
  websocket?: string
}>

export const CLUSTERS: ClusterOption[] = [
  {
    id: 'devnet',
    label: 'Devnet',
    endpoint: 'https://api.devnet.solana.com',
    websocket: 'wss://api.devnet.solana.com',
  },
  {
    id: 'testnet',
    label: 'Testnet',
    endpoint: 'https://api.testnet.solana.com',
    websocket: 'wss://api.testnet.solana.com',
  },
  {
    id: 'mainnet-beta',
    label: 'Mainnet Beta',
    endpoint: 'https://api.mainnet-beta.solana.com',
    websocket: 'wss://api.mainnet-beta.solana.com',
  },
]

export function resolveCluster(endpoint: string | undefined): ClusterOption & { status?: string } {
  if (!endpoint) {
    return {
      id: 'custom',
      label: 'Custom',
      endpoint: '',
    }
  }
  const found = CLUSTERS.find((cluster) => cluster.endpoint === endpoint)
  if (found) return found
  return {
    id: 'custom',
    label: 'Custom',
    endpoint,
  }
}
