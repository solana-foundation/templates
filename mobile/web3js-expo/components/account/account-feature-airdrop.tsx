import { AppView } from '@/components/app-view'
import { AppText } from '@/components/app-text'
import { PublicKey } from '@solana/web3.js'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { Button } from '@react-navigation/elements'
import React from 'react'
import { ActivityIndicator } from 'react-native'
import { useRequestAirdrop } from '@/components/account/use-request-airdrop'

export function AccountFeatureAirdrop({ back }: { back: () => void }) {
  const { account } = useMobileWallet()
  const amount = 1
  const requestAirdrop = useRequestAirdrop({ address: account?.address as PublicKey })

  return (
    <AppView>
      <AppText type="subtitle">Request a 1 SOL airdrop to the connected wallet.</AppText>
      {requestAirdrop.isPending ? (
        <ActivityIndicator />
      ) : (
        <Button
          disabled={requestAirdrop.isPending}
          onPress={() => {
            requestAirdrop
              .mutateAsync(amount)
              .then(() => {
                console.log(`Requested airdrop of ${amount} SOL to ${account?.address}`)
                back()
              })
              .catch((err) => console.log(`Error requesting airdrop: ${err}`, err))
          }}
          variant="filled"
        >
          Request Airdrop
        </Button>
      )}
      {requestAirdrop.isError ? (
        <AppText style={{ color: 'red', fontSize: 12 }}>{`${requestAirdrop.error.message}`}</AppText>
      ) : null}
    </AppView>
  )
}
