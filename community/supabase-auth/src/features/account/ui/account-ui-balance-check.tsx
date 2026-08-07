'use client'

import { useState } from 'react'
import { address as toAddress, lamports } from '@solana/kit'
import { AppAlert } from '@/components/app-alert'
import { Button } from '@/components/ui/button'
import { useAppClient } from '@/components/provider'
import { useCluster } from '@/components/solana/cluster-provider'
import { useBalance } from '@/hooks/use-balance'

export function AccountUiBalanceCheck({ address }: { address: string }) {
  const client = useAppClient()
  const { cluster } = useCluster()
  const balance = useBalance(address ? toAddress(address) : undefined)
  const [isPending, setIsPending] = useState(false)

  if (balance.isLoading) {
    return null
  }
  if (balance.error || balance.lamports == null) {
    return (
      <AppAlert
        action={
          <Button
            variant="outline"
            disabled={isPending}
            onClick={async () => {
              setIsPending(true)
              await client
                .airdrop(toAddress(address), lamports(1_000_000_000n))
                .catch((err) => console.log(err))
                .finally(() => setIsPending(false))
            }}
          >
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
