import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { ReactNativeExtension } from '@dynamic-labs/react-native-extension'
import { SolanaWalletConnectors, isSolanaWallet } from '@dynamic-labs/solana'
import { DynamicWidget, useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import * as Clipboard from 'expo-clipboard'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

const ENV_ID = process.env.EXPO_PUBLIC_DYNAMIC_ENVIRONMENT_ID

export default function App() {
  if (!ENV_ID) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Missing EXPO_PUBLIC_DYNAMIC_ENVIRONMENT_ID</Text>
          <Text style={styles.errorBody}>
            Copy .env.example to .env and add your Dynamic Environment ID from
            https://app.dynamic.xyz/dashboard/developer
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <DynamicContextProvider
      settings={{
        environmentId: ENV_ID,
        walletConnectors: [SolanaWalletConnectors],
      }}
    >
      <ReactNativeExtension>
        <Home />
      </ReactNativeExtension>
    </DynamicContextProvider>
  )
}

function Home() {
  const isLoggedIn = useIsLoggedIn()
  const { primaryWallet, sdkHasLoaded } = useDynamicContext()

  const [balance, setBalance] = useState<number | null>(null)
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('0.01')
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    if (!isLoggedIn || !primaryWallet || !isSolanaWallet(primaryWallet)) {
      setBalance(null)
      return
    }
    async function fetchBalance() {
      if (!primaryWallet || !isSolanaWallet(primaryWallet)) return
      const connection = await primaryWallet.getConnection()
      const pubkey = new PublicKey(primaryWallet.address)
      const lamports = await connection.getBalance(pubkey)
      setBalance(lamports / LAMPORTS_PER_SOL)
    }
    fetchBalance()
  }, [isLoggedIn, primaryWallet])

  const handleCopy = async () => {
    if (!primaryWallet?.address) return
    await Clipboard.setStringAsync(primaryWallet.address)
    Alert.alert('Copied', 'Wallet address copied to clipboard')
  }

  const handleSend = async () => {
    if (!primaryWallet || !isSolanaWallet(primaryWallet)) return
    setIsSending(true)
    try {
      let recipientPubkey: PublicKey
      try {
        recipientPubkey = new PublicKey(recipient)
      } catch {
        Alert.alert('Invalid recipient', 'That is not a valid Solana address')
        return
      }
      const connection = await primaryWallet.getConnection()
      const signer = await primaryWallet.getSigner()
      const { blockhash } = await connection.getLatestBlockhash()

      const tx = new Transaction()
      tx.recentBlockhash = blockhash
      tx.feePayer = new PublicKey(primaryWallet.address)
      tx.add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(primaryWallet.address),
          toPubkey: recipientPubkey,
          lamports: Math.round(parseFloat(amount) * LAMPORTS_PER_SOL),
        }),
      )

      const sig = await signer.signAndSendTransaction(tx)
      Alert.alert('Success', `Signature: ${sig.signature}`)
      setRecipient('')
      setAmount('0.01')
      const lamports = await connection.getBalance(new PublicKey(primaryWallet.address))
      setBalance(lamports / LAMPORTS_PER_SOL)
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsSending(false)
    }
  }

  const shortAddress = primaryWallet?.address
    ? `${primaryWallet.address.slice(0, 4)}...${primaryWallet.address.slice(-4)}`
    : ''

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Solana <Text style={styles.accent}>×</Text> Dynamic
          </Text>
          <DynamicWidget />
        </View>

        {!sdkHasLoaded ? (
          <View style={styles.centered}>
            <ActivityIndicator color="#a78bfa" />
          </View>
        ) : !isLoggedIn ? (
          <View style={styles.centered}>
            <Text style={styles.heading}>Sign in with Dynamic</Text>
            <Text style={styles.body}>Email, SMS, or social login provisions an MPC wallet on Solana.</Text>
          </View>
        ) : (
          <View>
            <View style={styles.card}>
              <Text style={styles.label}>Wallet</Text>
              <Text style={styles.address}>{shortAddress}</Text>
              {balance !== null && <Text style={styles.balance}>{balance.toFixed(4)} SOL</Text>}
              <TouchableOpacity style={styles.secondaryBtn} onPress={handleCopy}>
                <Text style={styles.secondaryBtnText}>Copy address</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Send SOL</Text>
              <TextInput
                style={styles.input}
                placeholder="Recipient address"
                placeholderTextColor="#6b7280"
                autoCapitalize="none"
                autoCorrect={false}
                value={recipient}
                onChangeText={setRecipient}
              />
              <TextInput
                style={styles.input}
                placeholder="Amount (SOL)"
                placeholderTextColor="#6b7280"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />
              <TouchableOpacity
                style={[styles.primaryBtn, (!recipient || isSending) && styles.btnDisabled]}
                disabled={!recipient || isSending}
                onPress={handleSend}
              >
                <Text style={styles.primaryBtnText}>{isSending ? 'Sending...' : 'Send SOL'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030712' },
  content: { padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  accent: { color: '#a78bfa' },
  heading: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 8 },
  body: { color: '#9ca3af', fontSize: 14, textAlign: 'center' },
  centered: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  card: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  label: { color: '#9ca3af', fontSize: 14, marginBottom: 8 },
  address: { color: '#fff', fontSize: 24, fontFamily: 'Menlo', fontWeight: '700' },
  balance: { color: '#9ca3af', fontSize: 14, marginTop: 4 },
  input: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
  },
  primaryBtn: {
    backgroundColor: '#9333ea',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  primaryBtnText: { color: '#fff', fontWeight: '600' },
  secondaryBtn: {
    backgroundColor: '#1f2937',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  secondaryBtnText: { color: '#fff', fontSize: 13 },
  btnDisabled: { backgroundColor: '#374151' },
  errorTitle: { color: '#f87171', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  errorBody: { color: '#9ca3af', fontSize: 14, textAlign: 'center', marginTop: 8 },
})
