'use client'
import { useState } from 'react'
import { lamportsFromSol, toAddress } from '@solana/client'
import { useSolanaClient } from '@solana/react-hooks'
import { AppModal } from '@/components/app-modal'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function AccountUiModalAirdrop({ address }: { address: string }) {
  const client = useSolanaClient()
  const [amount, setAmount] = useState('2')
  const [isPending, setIsPending] = useState(false)

  return (
    <AppModal
      title="Airdrop"
      submitDisabled={!amount || isPending}
      submitLabel="Request Airdrop"
      submit={async () => {
        const parsedAmount = Number(amount)
        if (Number.isNaN(parsedAmount)) return
        setIsPending(true)
        await client.actions
          .requestAirdrop(toAddress(address), lamportsFromSol(parsedAmount))
          .catch((error) => console.error(error))
          .finally(() => setIsPending(false))
      }}
    >
      <Label htmlFor="amount">Amount</Label>
      <Input
        disabled={isPending}
        id="amount"
        min="1"
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        step="any"
        type="number"
        value={amount}
      />
    </AppModal>
  )
}
