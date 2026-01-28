import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { NetworkProvider } from '@/features/network/network-provider'
import { MobileWalletProvider } from '@wallet-ui/react-native-kit'
import { AppConfig } from '@/constants/app-config'

const queryClient = new QueryClient()
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <NetworkProvider
        networks={AppConfig.networks}
        render={({ selectedNetwork }) => (
          <MobileWalletProvider cluster={selectedNetwork} identity={AppConfig.identity}>
            {children}
          </MobileWalletProvider>
        )}
      />
    </QueryClientProvider>
  )
}
