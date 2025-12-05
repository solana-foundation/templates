'use client'

import { useState } from 'react'
import { toAddress } from '@solana/client'
import { useBalance, useClusterState, useSolanaClient } from '@solana/react-hooks'
import { AppAlert } from '@/components/app-alert'
import { Button } from '@/components/ui/button'
import { resolveCluster } from '@/components/solana/clusters'

export function AccountUiBalanceCheck({ address }: { address: string }) {
  const clusterState = useClusterState()
  const cluster = resolveCluster(clusterState.endpoint)
  const client = useSolanaClient()
  const balance = useBalance(address ? toAddress(address) : undefined, { watch: true })
  const [isPending, setIsPending] = useState(false)

  if (balance.fetching) {
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
              await client.actions
                .requestAirdrop(toAddress(address), BigInt(1_000_000_000))
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
