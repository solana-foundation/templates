import { AppView } from '@/components/app-view'
import { AppText } from '@/components/app-text'
import { PublicKey } from '@solana/web3.js'
import { ActivityIndicator, Button, Snackbar, TextInput } from 'react-native-paper'
import { View } from 'react-native'
import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { ellipsify } from '@/utils/ellipsify'
import { useAppTheme } from '@/components/app-theme'

function useSignMessage() {
  const { signMessages } = useMobileWallet()
  return useMutation({
    mutationFn: async (input: { message: string }) => {
      return signMessages(new TextEncoder().encode(input.message)).then((signature) => signature.toString())
    },
  })
}

export function DemoFeatureSignMessage({ address }: { address: PublicKey }) {
  const signMessagesMutation = useSignMessage()
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
        {signMessagesMutation.isPending ? (
          <ActivityIndicator />
        ) : (
          <Button
            disabled={signMessagesMutation.isPending || message?.trim() === ''}
            onPress={() => {
              signMessagesMutation
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
      {signMessagesMutation.isError ? (
        <AppText style={{ color: 'red', fontSize: 12 }}>{`${signMessagesMutation.error.message}`}</AppText>
      ) : null}
    </AppView>
  )
}
