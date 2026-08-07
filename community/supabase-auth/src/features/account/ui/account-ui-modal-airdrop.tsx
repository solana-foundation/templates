'use client'
import { useState } from 'react'
import { address as toAddress, sol, solToLamports } from '@solana/kit'
import { useAppClient } from '@/components/provider'
import { useSend } from '@/hooks/use-send'
import { AppModal } from '@/components/app-modal'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function AccountUiModalAirdrop({ address }: { address: string }) {
  const client = useAppClient()
  const { run, isSending } = useSend()
  const [amount, setAmount] = useState('2')

  return (
    <AppModal
      title="Airdrop"
      submitDisabled={!amount || isSending}
      submitLabel="Request Airdrop"
      submit={async () => {
        if (Number.isNaN(Number(amount))) return
        await run(() => client.airdrop(toAddress(address), solToLamports(sol(amount))), 'Airdrop confirmed')
      }}
    >
      <Label htmlFor="amount">Amount</Label>
      <Input
        disabled={isSending}
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
