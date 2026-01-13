import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { useAccounts, useDisconnect, usePhantom } from '@phantom/react-native-sdk'
import { useRouter } from 'expo-router'
import { getBalance } from '@/lib/solana'
import { truncateAddress, copyToClipboard } from '@/lib/utils'
import { colors } from '@/lib/theme'

/**
 * WalletInfo component - Dashboard for connected wallet
 * Displays Solana wallet address, SOL balance, and logout functionality
 * Updated for SDK v1.0.0-beta.26 with modal support
 */
export function WalletInfo() {
  const { addresses, isConnected } = useAccounts()
  const { disconnect, isDisconnecting } = useDisconnect()
  const { modal } = usePhantom()
  const router = useRouter()
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)

  const solanaAccount = addresses?.[0]

  /**
   * Redirect to home if not connected
   */
  useEffect(() => {
    if (!isConnected) {
      router.replace('/')
    }
  }, [isConnected])

  /**
   * Fetch balance when wallet connects
   */
  useEffect(() => {
    if (solanaAccount?.address) {
      fetchBalance(solanaAccount.address)
    }
  }, [solanaAccount?.address])

  /**
   * Fetches SOL balance for the connected wallet
   */
  const fetchBalance = async (address: string) => {
    setIsLoadingBalance(true)
    try {
      const bal = await getBalance(address)
      setBalance(bal)
    } catch (error) {
      console.error('Failed to fetch balance:', error)
    } finally {
      setIsLoadingBalance(false)
    }
  }

  /**
   * Copies wallet address to clipboard
   */
  const handleCopy = async () => {
    if (solanaAccount?.address) {
      await copyToClipboard(solanaAccount?.address)
      Alert.alert('Copied!', 'Address copied to clipboard')
    }
  }

  /**
   * Disconnects wallet and returns to home screen
   */
  const handleDisconnect = async () => {
    try {
      await disconnect()
      router.replace('/')
    } catch (error) {
      console.error('Disconnect failed:', error)
    }
  }

  if (!solanaAccount) return null

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Embedded Phantom Wallet</Text>

        {/* Account Settings Button - Opens SDK Modal */}
        <TouchableOpacity style={styles.manageButton} onPress={() => modal.open()}>
          <Text style={styles.manageButtonText}>Account Settings</Text>
        </TouchableOpacity>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Wallet Address</Text>
          <TouchableOpacity onPress={handleCopy} style={styles.addressContainer}>
            <Text style={styles.address}>{truncateAddress(solanaAccount?.address || '')}</Text>
            <Text style={styles.copyChip}>Copy</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>SOL Balance</Text>
          <View style={styles.balanceContainer}>
            {isLoadingBalance ? (
              <ActivityIndicator size="small" color={colors.brand} />
            ) : (
              <Text style={styles.balance}>{balance?.toFixed(4) ?? '0.0000'} SOL</Text>
            )}
            <TouchableOpacity
              onPress={() => solanaAccount?.address && fetchBalance(solanaAccount.address)}
              disabled={isLoadingBalance}
              style={styles.refreshButton}
            >
              <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleDisconnect} disabled={isDisconnecting}>
          {isDisconnecting ? (
            <ActivityIndicator color={colors.paper} />
          ) : (
            <Text style={styles.logoutText}>Log Out</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.paper,
  },
  card: {
    backgroundColor: colors.paper,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.gray200,
    shadowColor: '#00000017',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.ink,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray400,
    marginBottom: 16,
  },
  manageButton: {
    marginBottom: 16,
    backgroundColor: colors.brand,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  manageButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  infoRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  label: {
    fontSize: 12,
    color: colors.gray400,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  address: {
    fontSize: 16,
    color: colors.ink,
    flex: 1,
    fontWeight: '500',
  },
  copyChip: {
    fontSize: 12,
    color: colors.brand,
    marginLeft: 12,
    fontWeight: '600',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.vanilla,
    borderRadius: 6,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balance: {
    fontSize: 20,
    color: colors.ink,
    flex: 1,
    fontWeight: 'bold',
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.gray100,
    borderRadius: 6,
    marginLeft: 12,
  },
  refreshText: {
    fontSize: 12,
    color: colors.brand,
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: colors.coral,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#f8717114',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 3,
  },
  logoutText: {
    color: colors.paper,
    fontSize: 16,
    fontWeight: '600',
  },
})
