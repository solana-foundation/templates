'use client'

import { useState } from 'react'
import { lamportsFromSol, toAddress } from '@solana/client'
import { useSolTransfer } from '@solana/react-hooks'
import { AppModal } from '@/components/app-modal'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function AccountUiModalSend({ address }: { address: string }) {
  const transfer = useSolTransfer()
  const [destination, setDestination] = useState('')
  const [amount, setAmount] = useState('1')

  if (!address) {
    return <div>Wallet not connected</div>
  }

  return (
    <AppModal
      title="Send"
      submitDisabled={!destination || !amount || transfer.isSending}
      submitLabel="Send"
      submit={async () => {
        const target = destination.trim()
        const parsedAmount = Number(amount)
        if (!target || Number.isNaN(parsedAmount)) return
        await transfer
          .send({ destination: toAddress(target), amount: lamportsFromSol(parsedAmount) })
          .catch((error) => console.error(error))
      }}
    >
      <Label htmlFor="destination">Destination</Label>
      <Input
        disabled={transfer.isSending}
        id="destination"
        onChange={(e) => setDestination(e.target.value)}
        placeholder="Destination"
        type="text"
        value={destination}
      />
      <Label htmlFor="amount">Amount</Label>
      <Input
        disabled={transfer.isSending}
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
