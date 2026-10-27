import { AppView } from '@/components/app-view'
import { AppText } from '@/components/app-text'
import { PublicKey } from '@solana/web3.js'
import { ActivityIndicator, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { Button } from '@react-navigation/elements'
import { useTransferSol } from '@/components/account/use-transfer-sol'
import { useThemeColor } from '@/hooks/use-theme-color'

export function AccountFeatureSend({ address }: { address: PublicKey }) {
  const transferSol = useTransferSol({ address })
  const [destinationAddress, setDestinationAddress] = useState('')
  const [amount, setAmount] = useState('1')
  const backgroundColor = useThemeColor({ light: '#f0f0f0', dark: '#333333' }, 'background')
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text')

  return (
    <AppView>
      <AppText type="subtitle">Send SOL from the connected wallet.</AppText>
      {transferSol.isPending ? (
        <ActivityIndicator />
      ) : (
        <View style={{ gap: 16 }}>
          <AppText>Amount (SOL)</AppText>
          <TextInput
            style={{
              backgroundColor,
              color: textColor,
              borderWidth: 1,
              borderRadius: 25,
              paddingHorizontal: 16,
            }}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <AppText>Destination Address</AppText>
          <TextInput
            style={{
              backgroundColor,
              color: textColor,
              borderWidth: 1,
              borderRadius: 25,
              paddingHorizontal: 16,
            }}
            value={destinationAddress}
            onChangeText={setDestinationAddress}
          />

          <Button
            disabled={transferSol.isPending}
            onPress={() => {
              transferSol
                .mutateAsync({ amount: parseFloat(amount), destination: new PublicKey(destinationAddress) })
                .then(() => {
                  console.log(`Sent ${amount} SOL to ${destinationAddress}`)
                })
                .catch((err) => console.log(`Error sending SOL: ${err}`, err))
            }}
            variant="filled"
          >
            Send SOL
          </Button>
        </View>
      )}
      {transferSol.isError ? (
        <AppText style={{ color: 'red', fontSize: 12 }}>{`${transferSol.error.message}`}</AppText>
      ) : null}
    </AppView>
  )
}
