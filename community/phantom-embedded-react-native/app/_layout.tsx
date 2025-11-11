// THIS MUST BE THE FIRST IMPORT!
// Required for cryptographic operations in React Native
import 'react-native-get-random-values'

import { Stack } from 'expo-router'
import { PhantomProvider, AddressType } from '@phantom/react-native-sdk'
import { colors } from '@/lib/theme'

/**
 * Root layout component that wraps the entire app
 * Configures PhantomProvider for embedded user wallets on Solana
 */
export default function RootLayout() {
  const appId = process.env.EXPO_PUBLIC_PHANTOM_APP_ID || ''
  const scheme = process.env.EXPO_PUBLIC_APP_SCHEME || 'phantomwallet'

  return (
    <PhantomProvider
      config={
        {
          providerType: 'embedded',
          appId,
          scheme,
          addressTypes: [AddressType.solana],
          authOptions: {
            redirectUrl: `${scheme}://phantom-auth-callback`,
          },
          appName: 'Phantom Embedded Wallet',
        } as any
      }
    >
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.paper,
            borderBottomWidth: 1,
            borderBottomColor: colors.gray200,
          },
          headerTintColor: colors.ink,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Phantom Wallet',
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="wallet"
          options={{
            title: 'Dashboard',
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
      </Stack>
    </PhantomProvider>
  )
}
