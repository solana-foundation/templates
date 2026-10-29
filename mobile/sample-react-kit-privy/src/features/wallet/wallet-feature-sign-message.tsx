import { getBase58Decoder } from '@solana/kit'
import { useSignMessage } from '@solana/kit-plugin-wallet/react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppClient } from '@/features/core/data-access/use-app-client'
import { WalletUiActionCard } from '@/features/wallet/ui/wallet-ui-action-card'

/**
 * Signs a message with the connected account.
 */
export function WalletFeatureSignMessage() {
  const client = useAppClient()
  const { data, dispatch, error, isRunning } = useSignMessage(client)
  const [message, setMessage] = useState('Hello from Solana Kit')

  return (
    <WalletUiActionCard
      description="Signs arbitrary bytes. Nothing is sent to the network, and no fee is paid."
      error={error}
      result={data ? getBase58Decoder().decode(data) : undefined}
      title="Sign message"
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input onChange={(event) => setMessage(event.target.value)} placeholder="Message to sign" value={message} />
        <Button
          disabled={isRunning || message.length === 0}
          onClick={() => dispatch(new TextEncoder().encode(message))}
          variant="outline"
        >
          {isRunning ? 'Waiting for wallet…' : 'Sign message'}
        </Button>
      </div>
    </WalletUiActionCard>
  )
}
