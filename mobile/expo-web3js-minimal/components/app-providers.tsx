import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { NetworkProvider } from '@/features/network/network-provider'
import { MobileWalletProvider } from '@wallet-ui/react-native-web3js'
import { useNetwork } from '@/features/network/use-network'

const identity = { name: 'Expo Web3js Minimal' }
const queryClient = new QueryClient()
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <NetworkProvider>
        <SolanaNetworkProvider>{children}</SolanaNetworkProvider>
      </NetworkProvider>
    </QueryClientProvider>
  )
}

// We have this SolanaNetworkProvider because of the network switching logic.
// If you only connect to a single network, use MobileWalletProvider directly.
function SolanaNetworkProvider({ children }: PropsWithChildren) {
  const { selectedNetwork } = useNetwork()
  return (
    <MobileWalletProvider chain={selectedNetwork.id} endpoint={selectedNetwork.url} identity={identity}>
      {children}
    </MobileWalletProvider>
  )
}
