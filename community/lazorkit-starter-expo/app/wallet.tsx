import { useLazorWallet, SmartWalletAction } from '@lazorkit/wallet-mobile-adapter'
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js'
import { Button, Text, View, StyleSheet, Alert } from 'react-native'
import { router } from 'expo-router'
import { useEffect } from 'react'

export default function WalletScreen() {
  const { smartWalletPubkey, isConnected, isSigning, disconnect, signMessage } = useLazorWallet()

  useEffect(() => {
    if (!isConnected) {
      router.replace('/')
    }
  }, [isConnected])

  const handleSend = async () => {
    if (!smartWalletPubkey) return

    // Replace with a valid recipient address
    const recipientAddress = 'YOUR_RECIPIENT_ADDRESS_HERE'

    if (recipientAddress === 'YOUR_RECIPIENT_ADDRESS_HERE') {
      Alert.alert('Update Required', 'Please set a recipient address in the code')
      return
    }

    try {
      const toPubkey = new PublicKey(recipientAddress)

      // Create the transfer instruction
      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: toPubkey,
        lamports: LAMPORTS_PER_SOL * 0.01,
      })

      // Sign using the instruction
      await signMessage(
        {
          type: SmartWalletAction.Execute,
          args: {
            policyInstruction: null,
            cpiInstruction: instruction,
          },
        },
        {
          redirectUrl: 'lazorkitstarterexpo://wallet-callback',
          onSuccess: (result) => {
            console.log('Transaction sent:', result)
            Alert.alert('Success', 'Transaction sent successfully')
          },
          onFail: (err) => {
            console.error('Transaction failed:', err)
            Alert.alert('Failed', err.message)
          },
        },
      )
    } catch (err: any) {
      console.error('Error:', err)
      Alert.alert('Error', err.message)
    }
  }

  const handleDisconnect = async () => {
    await disconnect()
    router.replace('/')
  }

  if (!isConnected) {
    return null
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet</Text>

      <Text style={styles.label}>Address</Text>
      <Text style={styles.address}>{smartWalletPubkey?.toString()}</Text>

      <View style={styles.buttons}>
        <Button title={isSigning ? 'Signing...' : 'Send 0.01 SOL'} onPress={handleSend} disabled={isSigning} />
        <Button title="Disconnect" onPress={handleDisconnect} color="#FF3B30" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    fontFamily: 'monospace',
    marginBottom: 30,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  buttons: {
    gap: 10,
  },
})
