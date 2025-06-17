import { Address } from 'gill'
import { useWalletUi } from '@wallet-ui/react'
import { AppAlert } from '@/components/app-alert'
import { Button } from '@/components/ui/button'

import { useGetBalanceQuery } from './use-get-balance-query'
import { useRequestAirdropMutation } from './use-request-airdrop-mutation'

export function AccountUiBalanceCheck({ address }: { address: Address }) {
  const { cluster } = useWalletUi()
  const mutation = useRequestAirdropMutation({ address })
  const query = useGetBalanceQuery({ address })

  if (query.isLoading) {
    return null
  }
  if (query.isError || !query.data?.value) {
    return (
      <AppAlert
        action={
          <Button variant="outline" onClick={() => mutation.mutateAsync(1).catch((err) => console.log(err))}>
            Request Airdrop
          </Button>
        }
      >
        You are connected to <strong>{cluster.label}</strong> but your account is not found on this cluster.
      </AppAlert>
    )
  }
  return null
}
