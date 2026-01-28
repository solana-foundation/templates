import { useLazorWallet } from '@lazorkit/wallet-mobile-adapter'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { Button, View, StyleSheet } from 'react-native'

import { HelloWave } from '@/components/hello-wave'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'

export default function LoginScreen() {
  const { connect, isConnecting, isConnected } = useLazorWallet()

  useEffect(() => {
    if (isConnected) {
      router.replace('/wallet')
    }
  }, [isConnected])

  const handleLogin = async () => {
    try {
      await connect({ redirectUrl: 'lazorkitstarterexpo://wallet-callback' })
    } catch (err) {
      console.error('Connection failed', err)
    }
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </View>
      <ThemedText>Connect your wallet to get started.</ThemedText>
      <View style={styles.buttonContainer}>
        <Button
          title={isConnecting ? 'Connecting...' : 'Login with LazorKit'}
          onPress={handleLogin}
          disabled={isConnecting}
        />
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonContainer: {
    marginTop: 20,
  },
})
