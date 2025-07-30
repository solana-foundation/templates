import { AppView } from '@/components/app-view'
import { AppText } from '@/components/app-text'
import { PublicKey } from '@solana/web3.js'
import Snackbar from 'react-native-snackbar'
import { ActivityIndicator, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { Button } from '@react-navigation/elements'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useMutation } from '@tanstack/react-query'
import { useWalletUi } from '@/components/solana/use-wallet-ui'
import { ellipsify } from '@/utils/ellipsify'

function useSignMessage({ address }: { address: PublicKey }) {
  const { signMessage } = useWalletUi()
  return useMutation({
    mutationFn: async (input: { message: string }) => {
      return signMessage(Buffer.from(input.message, 'utf8')).then((signature) => signature.toString())
    },
  })
}

export function DemoFeatureSignMessage({ address }: { address: PublicKey }) {
  const signMessage = useSignMessage({ address })
  const [message, setMessage] = useState('Hello world')
  const backgroundColor = useThemeColor({ light: '#f0f0f0', dark: '#333333' }, 'background')
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text')

  return (
    <AppView>
      <AppText type="subtitle">Sign message with connected wallet.</AppText>

      <View style={{ gap: 16 }}>
        <AppText>Message</AppText>
        <TextInput
          style={{
            backgroundColor,
            color: textColor,
            borderWidth: 1,
            borderRadius: 25,
            paddingHorizontal: 16,
          }}
          value={message}
          onChangeText={setMessage}
        />
        {signMessage.isPending ? (
          <ActivityIndicator />
        ) : (
          <Button
            disabled={signMessage.isPending || message?.trim() === ''}
            onPress={() => {
              signMessage
                .mutateAsync({ message })
                .then(() => {
                  console.log(`Signed message: ${message} with ${address.toString()}`)
                  Snackbar.show({
                    text: `Signed message with ${ellipsify(address.toString(), 8)}`,
                    duration: Snackbar.LENGTH_SHORT,
                  })
                })
                .catch((err) => console.log(`Error signing message: ${err}`, err))
            }}
            variant="filled"
          >
            Sign Message
          </Button>
        )}
      </View>
      {signMessage.isError ? (
        <AppText style={{ color: 'red', fontSize: 12 }}>{`${signMessage.error.message}`}</AppText>
      ) : null}
    </AppView>
  )
}
