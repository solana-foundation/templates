import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native'
import { ConnectButton } from '@/components/ConnectButton'
import { colors } from '@/lib/theme'

/**
 * Home screen - displays welcome message and connect button
 * This is the entry point of the app where users initiate Phantom Connect
 * Updated for SDK v1.0.0-beta.26 with modal support
 */
export default function HomeScreen() {
  /**
   * Opens the Phantom documentation in the browser
   */
  const openDocs = () => {
    Linking.openURL('https://docs.phantom.app')
  }

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/default.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Phantom Embedded Wallet</Text>
      <Text style={styles.subtitle}>
        Starter kit for integrating the Phantom React Native SDK with embedded wallets. Authenticate to create or
        connect your Phantom wallet and view balances instantly.
      </Text>
      <ConnectButton />
      <TouchableOpacity style={styles.linkButton} onPress={openDocs}>
        <Text style={styles.linkText}>View Documentation →</Text>
      </TouchableOpacity>
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
  logo: {
    width: 80,
    height: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
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
  linkButton: {
    marginTop: 24,
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 14,
    color: colors.brand,
    fontWeight: '600',
  },
})
