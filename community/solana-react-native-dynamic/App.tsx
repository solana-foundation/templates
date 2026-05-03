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
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

const ENV_ID = process.env.EXPO_PUBLIC_DYNAMIC_ENVIRONMENT_ID

const COLORS = {
  bg: '#F9F9F9',
  surface: '#FFFFFF',
  border: '#DADADA',
  primary: '#4779FF',
  primaryHover: '#3366EE',
  textPrimary: '#030303',
  textSecondary: '#606060',
  errorBg: '#FCE8E6',
  errorText: '#C5221F',
}

const FOOTER_LINKS = [
  { text: 'GitHub', url: 'https://github.com/dynamic-labs-oss' },
  { text: 'Docs', url: 'https://docs.dynamic.xyz' },
  { text: 'Dashboard', url: 'https://app.dynamic.xyz' },
]

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
      <View style={styles.header}>
        <Text style={styles.brand}>
          <Text style={styles.brandSolana}>Solana</Text>
          <Text style={styles.brandDivider}> × </Text>
          <Text style={styles.brandDynamic}>Dynamic</Text>
        </Text>
        <DynamicWidget />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!sdkHasLoaded ? (
          <View style={styles.centered}>
            <ActivityIndicator color={COLORS.primary} />
          </View>
        ) : !isLoggedIn ? (
          <View style={styles.centered}>
            <Text style={styles.heading}>Sign in with Dynamic</Text>
            <Text style={styles.body}>
              Email, SMS, social login, or any Solana wallet — embedded wallets and 100+ external wallets out of the
              box.
            </Text>
          </View>
        ) : (
          <View>
            <View style={styles.card}>
              <Text style={styles.label}>WALLET</Text>
              <Text style={styles.address}>{shortAddress}</Text>
              {balance !== null && <Text style={styles.balance}>{balance.toFixed(4)} SOL</Text>}
              <TouchableOpacity style={styles.secondaryBtn} onPress={handleCopy}>
                <Text style={styles.secondaryBtnText}>Copy address</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>SEND SOL</Text>
              <TextInput
                style={styles.input}
                placeholder="Recipient address"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
                autoCorrect={false}
                value={recipient}
                onChangeText={setRecipient}
              />
              <TextInput
                style={styles.input}
                placeholder="Amount (SOL)"
                placeholderTextColor="#9ca3af"
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

      <View style={styles.footer}>
        <Text style={styles.footerPowered}>powered by Dynamic</Text>
        <View style={styles.footerLinks}>
          {FOOTER_LINKS.map((link) => (
            <TouchableOpacity key={link.url} onPress={() => Linking.openURL(link.url)}>
              <Text style={styles.footerLink}>{link.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  brand: { fontSize: 18, fontWeight: '700' },
  brandSolana: { color: COLORS.textPrimary },
  brandDivider: { color: COLORS.textSecondary },
  brandDynamic: { color: COLORS.primary },
  heading: { color: COLORS.textPrimary, fontSize: 24, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  body: { color: COLORS.textSecondary, fontSize: 15, textAlign: 'center', lineHeight: 22 },
  centered: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  address: { color: COLORS.textPrimary, fontSize: 22, fontFamily: 'Menlo', fontWeight: '700' },
  balance: { color: COLORS.textSecondary, fontSize: 14, marginTop: 4 },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    color: COLORS.textPrimary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
    fontSize: 15,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  primaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  secondaryBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  secondaryBtnText: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '500' },
  btnDisabled: { opacity: 0.5 },
  errorTitle: { color: COLORS.errorText, fontSize: 16, fontWeight: '700', textAlign: 'center' },
  errorBody: { color: COLORS.textSecondary, fontSize: 14, textAlign: 'center', marginTop: 8 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerPowered: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '500' },
  footerLinks: { flexDirection: 'row', gap: 16 },
  footerLink: { color: COLORS.textSecondary, fontSize: 12 },
})
