import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { ClusterProvider, useCluster } from './cluster/cluster-provider'
import { AppTheme } from '@/components/app-theme'
import { MobileWalletProvider } from '@wallet-ui/react-native-web3js'

const queryClient = new QueryClient()
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AppTheme>
      <QueryClientProvider client={queryClient}>
        <ClusterProvider>
          <SolanaProvider>{children}</SolanaProvider>
        </ClusterProvider>
      </QueryClientProvider>
    </AppTheme>
  )
}

// We have this SolanaProvider because of the network switching logic.
// If you only connect to a single network, use MobileWalletProvider directly.
function SolanaProvider({ children }: PropsWithChildren) {
  const { selectedCluster } = useCluster()
  return (
    <MobileWalletProvider
      chain={selectedCluster.id}
      endpoint={selectedCluster.endpoint}
      identity={{ name: 'Wallet UI Example Web3js Expo' }}
    >
      {children}
    </MobileWalletProvider>
  )
}
