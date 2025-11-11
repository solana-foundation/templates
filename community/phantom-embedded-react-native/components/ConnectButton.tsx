import React from 'react'
import { View, TouchableOpacity, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native'
import { useConnect, useAccounts } from '@phantom/react-native-sdk'
import { useRouter } from 'expo-router'
import { colors } from '@/lib/theme'

/**
 * ConnectButton component handles Phantom wallet authentication
 * Uses Phantom Connect (OAuth) to create/connect an embedded user wallet
 * Supports Google and Apple authentication
 */
export function ConnectButton() {
  const { connect, isConnecting } = useConnect()
  const { isConnected } = useAccounts()
  const router = useRouter()

  /**
   * Initiates Phantom Connect flow with specific provider
   * On success, navigates to wallet screen
   */
  const handleConnect = async (provider: 'google' | 'apple') => {
    try {
      await connect({ provider })
      router.push('/wallet')
    } catch (error: any) {
      console.error('Connection failed:', error)
      // Only show alert if error is not user cancellation
      if (error?.message && !error.message.includes('cancelled')) {
        Alert.alert('Connection Failed', error.message)
      }
    }
  }

  // Hide button if already connected
  if (isConnected) {
    return null
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.googleButton]}
        onPress={() => handleConnect('google')}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={styles.buttonContent}>
            <Text style={styles.logo}>G</Text>
            <Text style={styles.buttonText}>Continue with Google</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.appleButton]}
        onPress={() => handleConnect('apple')}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={styles.buttonContent}>
            <Text style={styles.logo}></Text>
            <Text style={styles.buttonText}>Continue with Apple</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 300,
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.paper,
    shadowColor: '#00000014',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 20,
    marginRight: 8,
    fontWeight: 'bold',
    color: colors.paper,
  },
  googleButton: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  appleButton: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  buttonText: {
    color: colors.paper,
    fontSize: 16,
    fontWeight: '600',
  },
})
