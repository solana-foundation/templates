'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { useConnectedWallet, useDisconnect } from '@solana/kit-plugin-wallet/react'
import { useSolana } from './solana/solana-provider'
import { toast } from 'sonner'

function WalletDisconnect(props: React.ComponentProps<typeof Button>) {
  const { client } = useSolana()
  const connected = useConnectedWallet(client)
  const { dispatchAsync: disconnect, isRunning } = useDisconnect(client)
  return (
    <Button
      variant="outline"
      className="cursor-pointer"
      {...props}
      onClick={async () => {
        try {
          await disconnect()
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Disconnect failed')
        }
      }}
      disabled={!connected || isRunning || props.disabled}
    >
      Disconnect
    </Button>
  )
}

export { WalletDisconnect }
