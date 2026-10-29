import { useSendTransaction } from '@solana/react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppClient } from '@/features/core/data-access/use-app-client'
import { WalletUiActionCard } from '@/features/wallet/ui/wallet-ui-action-card'

/**
 * The end-to-end path, and the one to copy when building something real: an instruction from a
 * program client, handed to `sendTransaction`, which plans the transaction, has the connected
 * wallet sign it, submits it, and waits for confirmation.
 *
 * Swap `client.memo.instructions.addMemo(...)` for any other program client's instruction and the
 * surrounding code is unchanged.
 */
export function WalletFeatureSendMemo() {
  const client = useAppClient()
  const { data, dispatch, error, isRunning } = useSendTransaction(client)
  const [memo, setMemo] = useState('gm from Solana Kit')

  return (
    <WalletUiActionCard
      description="Builds a Memo Program instruction, signs it with the connected wallet, and submits it."
      error={error}
      result={data?.context.signature}
      signature={data?.context.signature}
      title="Send a transaction"
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input onChange={(event) => setMemo(event.target.value)} placeholder="Memo text" value={memo} />
        <Button
          disabled={isRunning || memo.length === 0}
          onClick={() => dispatch(client.memo.instructions.addMemo({ memo }))}
        >
          {isRunning ? 'Sending…' : 'Send memo'}
        </Button>
      </div>
    </WalletUiActionCard>
  )
}
