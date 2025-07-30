import { AppView } from '@/components/app-view'
import { AppText } from '@/components/app-text'
import { PublicKey } from '@solana/web3.js'
import { useWalletUi } from '@/components/solana/use-wallet-ui'
import { Button } from '@react-navigation/elements'
import React from 'react'
import { ActivityIndicator } from 'react-native'
import { useRequestAirdrop } from '@/components/account/use-request-airdrop'

export function AccountFeatureAirdrop({ back }: { back: () => void }) {
  const { account } = useWalletUi()
  const amount = 1
  const requestAirdrop = useRequestAirdrop({ address: account?.publicKey as PublicKey })

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
                console.log(`Requested airdrop of ${amount} SOL to ${account?.publicKey}`)
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
