import { View, Text, StyleSheet } from 'react-native'
import { ConnectButton } from '@/components/ConnectButton'
import { colors } from '@/lib/theme'

/**
 * Home screen - displays welcome message and connect button
 * This is the entry point of the app where users initiate Phantom Connect
 */
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phantom Embedded Wallet</Text>
      <Text style={styles.subtitle}>
        Starter kit for integrating the Phantom React Native SDK with embedded Solana wallets. Authenticate to create or
        connect your Phantom wallet and view balances instantly.
      </Text>
      <ConnectButton />
      <Text style={styles.footer}>
        Learn how embedded Phantom wallets work at <Text style={styles.link}>docs.phantom.app</Text>.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.paper,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.ink,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray400,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    marginTop: 24,
    fontSize: 14,
    color: colors.gray400,
    textAlign: 'center',
    lineHeight: 20,
  },
  link: {
    color: colors.brand,
    fontWeight: '600',
  },
})
