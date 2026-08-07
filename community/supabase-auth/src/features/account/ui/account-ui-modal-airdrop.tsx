'use client'
import { useState } from 'react'
import { address as toAddress, sol, solToLamports } from '@solana/kit'
import { useAppClient } from '@/components/provider'
import { AppModal } from '@/components/app-modal'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function AccountUiModalAirdrop({ address }: { address: string }) {
  const client = useAppClient()
  const [amount, setAmount] = useState('2')
  const [isPending, setIsPending] = useState(false)

  return (
    <AppModal
      title="Airdrop"
      submitDisabled={!amount || isPending}
      submitLabel="Request Airdrop"
      submit={async () => {
        if (Number.isNaN(Number(amount))) return
        setIsPending(true)
        await client
          .airdrop(toAddress(address), solToLamports(sol(amount)))
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
