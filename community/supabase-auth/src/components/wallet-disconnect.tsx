'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useConnectedWallet } from '@solana/kit-plugin-wallet/react'
import { useSolana } from './provider'
import { useCombinedSignOut } from '@/hooks/use-combined-signout'
import { toast } from 'sonner'

export function WalletDisconnect(props: React.ComponentProps<typeof Button>) {
  const { client } = useSolana()
  const connected = useConnectedWallet(client)
  const { handleSignOut } = useCombinedSignOut()
  const router = useRouter()
  const [pending, setPending] = React.useState(false)
  const busy = React.useRef(false)
  return (
    <Button
      variant="outline"
      {...props}
      disabled={!connected || pending || props.disabled}
      onClick={async () => {
        if (busy.current) return
        busy.current = true
        setPending(true)
        try {
          await handleSignOut()
          router.replace('/')
        } catch (error) {
          toast.error(`Sign out failed: ${error instanceof Error ? error.message : String(error)}`)
        } finally {
          busy.current = false
          setPending(false)
        }
      }}
    >
      {pending ? 'Disconnecting...' : 'Disconnect'}
    </Button>
  )
}
