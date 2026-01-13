// THIS MUST BE THE FIRST IMPORT!
// Required for cryptographic operations in React Native
import 'react-native-get-random-values'

import { Stack } from 'expo-router'
import {
  PhantomProvider,
  AddressType,
  darkTheme,
  type PhantomSDKConfig,
  type PhantomDebugConfig,
} from '@phantom/react-native-sdk'
import { colors } from '@/lib/theme'

/**
 * Root layout component that wraps the entire app
 * Configures PhantomProvider for embedded user wallets
 * Supports both Solana and Ethereum chains (multi-chain)
 * Updated for SDK v1.0.0-beta.26 with modal support
 */
export default function RootLayout() {
  const appId = process.env.EXPO_PUBLIC_PHANTOM_APP_ID || ''
  const scheme = process.env.EXPO_PUBLIC_APP_SCHEME || 'phantomwallet'

  // SDK configuration - static, won't change when debug settings change
  const config: PhantomSDKConfig = {
    appId,
    scheme,
    // Supported authentication providers
    providers: ['google', 'apple'],
    // Multi-chain support: Solana and Ethereum
    addressTypes: [AddressType.solana, AddressType.ethereum],
    authOptions: {
      redirectUrl: `${scheme}://phantom-auth-callback`,
    },
  }

  // Debug configuration - enable logging in development
  const debugConfig: PhantomDebugConfig = {
    enabled: __DEV__, // Enable debug logging in development mode
  }

  // Custom theme matching brand colors while extending dark theme
  const customTheme = {
    ...darkTheme,
    brand: colors.brand, // Use brand color
    borderRadius: 12,
  }

  return (
    <PhantomProvider config={config} debugConfig={debugConfig} theme={customTheme} appName="Phantom Wallet">
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.paper,
          },
          headerTintColor: colors.ink,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShadowVisible: false,
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
