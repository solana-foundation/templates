'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { useWalletConnection } from '@solana/react-hooks'

function WalletDisconnect(props: React.ComponentProps<typeof Button>) {
  const { connected, disconnect } = useWalletConnection()
  return (
    <Button variant="outline" className="cursor-pointer" {...props} onClick={disconnect} disabled={!connected}>
      Disconnect
    </Button>
  )
}

export { WalletDisconnect }
