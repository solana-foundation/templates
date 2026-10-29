import { SolanaCluster, SolanaClusterId } from '@wallet-ui/react-native-kit'
import { createContext, ReactNode, useMemo, useState } from 'react'

export interface NetworkProviderContextValue {
  chain: SolanaClusterId
  endpoint: string
  getExplorerUrl(path: string): string
  getFaucetUrl(address?: string): string
  networks: SolanaCluster[]
  selectedNetwork: SolanaCluster
  setSelectedNetwork: (network: SolanaCluster) => void
}

export const NetworkProviderContext = createContext<NetworkProviderContextValue>({} as NetworkProviderContextValue)

export function NetworkProvider({
  networks,
  render,
}: {
  networks: SolanaCluster[]
  render: (value: NetworkProviderContextValue) => ReactNode
}) {
  const [selectedNetwork, setSelectedNetwork] = useState<SolanaCluster>(networks[0])
  const value: NetworkProviderContextValue = useMemo(
    () => ({
      chain: selectedNetwork.id,
      endpoint: selectedNetwork.url,
      getExplorerUrl: (path: string) => `https://explorer.solana.com/${path}${getExplorerUrlParam(selectedNetwork)}`,
      getFaucetUrl: (address?: string) => `https://faucet.solana.com/${getFaucetUrlParams(selectedNetwork, address)}`,
      networks: [...networks].sort((a, b) => a.label.localeCompare(b.label)),
      selectedNetwork,
      setSelectedNetwork: (network: SolanaCluster) => setSelectedNetwork(network),
    }),
    [networks, selectedNetwork, setSelectedNetwork],
  )
  return <NetworkProviderContext.Provider value={value}>{render(value)}</NetworkProviderContext.Provider>
}

function getExplorerUrlParam(network: SolanaCluster): string {
  switch (network.id) {
    case 'solana:devnet':
      return `?cluster=devnet`
    case 'solana:testnet':
      return `?cluster=testnet`
    case 'solana:localnet':
      return `?cluster=custom&customUrl=${encodeURIComponent(network.url)}`
    default:
      return ''
  }
}

/** The faucet pre-fills its form from these params. It only funds devnet and testnet. */
function getFaucetUrlParams(network: SolanaCluster, address?: string): string {
  const walletAddressParam = address ? `&walletAddress=${address}` : ''
  switch (network.id) {
    case 'solana:devnet':
      return `?cluster=devnet${walletAddressParam}`
    case 'solana:testnet':
      return `?cluster=testnet${walletAddressParam}`
    default:
      return address ? `?walletAddress=${address}` : ''
  }
}
