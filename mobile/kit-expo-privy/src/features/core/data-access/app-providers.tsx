import { PrivyProvider } from '@privy-io/expo'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppIdentity, createSolanaDevnet, MobileWalletProvider } from '@wallet-ui/react-native-kit'
import { HeroUINativeProvider } from 'heroui-native/provider'
import { ReactNode } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const cluster = createSolanaDevnet()
const identity: AppIdentity = { name: 'Kit Expo Privy', uri: 'kit-expo-privy://kit-expo-privy' }
const privyAppId = process.env.EXPO_PUBLIC_PRIVY_APP_ID
const privyClientId = process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID
const queryClient = new QueryClient()

export function AppProviders({ children }: { children: ReactNode }) {
  if (!privyAppId || !privyClientId) {
    throw new Error('Missing Privy environment variables')
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <HeroUINativeProvider config={{ devInfo: { stylingPrinciples: false } }}>
        <QueryClientProvider client={queryClient}>
          <PrivyProvider appId={privyAppId} clientId={privyClientId}>
            <MobileWalletProvider cluster={cluster} identity={identity}>
              {children}
            </MobileWalletProvider>
          </PrivyProvider>
        </QueryClientProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  )
}
