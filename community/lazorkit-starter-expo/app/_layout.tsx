import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { LazorKitProvider } from '@lazorkit/wallet-mobile-adapter'
import { useColorScheme } from '@/hooks/use-color-scheme'

export default function RootLayout() {
  const colorScheme = useColorScheme()

  // Try passing props directly without useMemo and spreading
  return (
    <LazorKitProvider
      rpcUrl="https://api.devnet.solana.com"
      ipfsUrl="https://portal.lazor.sh"
      paymasterUrl="https://kora.devnet.lazorkit.com"
      isDebug={false}
    >
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </LazorKitProvider>
  )
}
