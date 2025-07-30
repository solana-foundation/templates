import { AppView } from '@/components/app-view'
import { AppText } from '@/components/app-text'
import { PublicKey } from '@solana/web3.js'
import { ActivityIndicator, Button, Snackbar, TextInput } from 'react-native-paper'
import { View } from 'react-native'
import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useWalletUi } from '@/components/solana/use-wallet-ui'
import { ellipsify } from '@/utils/ellipsify'
import { useAppTheme } from '@/components/app-theme'

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
  const [showSnackbar, setShowSnackbar] = React.useState(false)
  const { theme } = useAppTheme()
  return (
    <AppView>
      <AppText variant="headlineMedium">Sign message with connected wallet.</AppText>
      <Snackbar
        style={{ backgroundColor: theme.colors.background, zIndex: 1000 }}
        theme={{ colors: { surface: theme.colors.text } }}
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
      >
        <AppText>Signed message with {ellipsify(address.toString(), 8)}</AppText>
      </Snackbar>
      <View style={{ gap: 16 }}>
        <AppText>Message</AppText>
        <TextInput value={message} onChangeText={setMessage} />
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

                  setShowSnackbar(true)
                })
                .catch((err) => console.log(`Error signing message: ${err}`, err))
            }}
            mode="contained-tonal"
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
