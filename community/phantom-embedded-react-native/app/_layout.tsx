// THIS MUST BE THE FIRST IMPORT!
// Required for cryptographic operations in React Native
import 'react-native-get-random-values';

import { Stack } from 'expo-router';
import {
  PhantomProvider,
  AddressType,
  type PhantomSDKConfig,
  type PhantomDebugConfig
} from '@phantom/react-native-sdk';
import { colors } from '@/lib/theme';

/**
 * Root layout component that wraps the entire app
 * Configures PhantomProvider for embedded user wallets
 * Supports both Solana and Ethereum chains (multi-chain)
 */
export default function RootLayout() {
  const appId = process.env.EXPO_PUBLIC_PHANTOM_APP_ID || '';
  const scheme = process.env.EXPO_PUBLIC_APP_SCHEME || 'phantomwallet';

  // SDK configuration - static, won't change when debug settings change
  const config: PhantomSDKConfig = {
    appId,
    scheme,
    // Multi-chain support: Solana and Ethereum
    addressTypes: [AddressType.solana, AddressType.ethereum],
    authOptions: {
      redirectUrl: `${scheme}://phantom-auth-callback`,
    },
    appName: 'Phantom Embedded Wallet',
  };

  // Debug configuration - enable logging in development
  const debug: PhantomDebugConfig = {
    enableLogging: __DEV__,
  };

  return (
    <PhantomProvider config={config} debug={debug}>
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
  );
}
