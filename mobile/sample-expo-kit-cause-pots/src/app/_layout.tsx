import '../global.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Slot } from 'expo-router'
import {
  AppIdentity,
  createSolanaDevnet,
  createSolanaLocalnet,
  MobileWalletProvider,
} from '@wallet-ui/react-native-kit'
import { NetworkProvider } from '../features/network/network-provider'

// Localnet: run `npx solana-mobile localnet` to start it and forward it to the device.
const networks = [createSolanaDevnet(), createSolanaLocalnet({ url: 'http://localhost:8899' })]
const identity: AppIdentity = { name: 'Cause Pots' }
const queryClient = new QueryClient()

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <NetworkProvider
        networks={networks}
        render={({ selectedNetwork }) => (
          <MobileWalletProvider cluster={selectedNetwork} identity={identity}>
            <Slot />
          </MobileWalletProvider>
        )}
      />
    </QueryClientProvider>
  )
}
