'use client'

import { useState } from 'react'
import { address as toAddress, sol, solToLamports } from '@solana/kit'
import { useConnectedWallet } from '@solana/kit-plugin-wallet/react'
import { useAppClient } from '@/components/provider'
import { AppModal } from '@/components/app-modal'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toastTx } from '@/components/toast-tx'

export function AccountUiModalSend({ address }: { address: string }) {
  const client = useAppClient()
  const connected = useConnectedWallet(client)
  const [destination, setDestination] = useState('')
  const [amount, setAmount] = useState('1')
  const [isSending, setIsSending] = useState(false)

  if (!address || !connected?.signer) {
    return <div>Wallet not connected</div>
  }

  const signer = connected.signer

  return (
    <AppModal
      title="Send"
      submitDisabled={!destination || !amount || isSending}
      submitLabel="Send"
      submit={async () => {
        const target = destination.trim()
        if (!target || Number.isNaN(Number(amount))) return
        setIsSending(true)
        try {
          const result = await client.system.instructions
            .transferSol({ source: signer, destination: toAddress(target), amount: solToLamports(sol(amount)) })
            .sendTransaction()
          toastTx(result.context.signature)
        } catch (error) {
          console.error(error)
        } finally {
          setIsSending(false)
        }
      }}
    >
      <Label htmlFor="destination">Destination</Label>
      <Input
        disabled={isSending}
        id="destination"
        onChange={(e) => setDestination(e.target.value)}
        placeholder="Destination"
        type="text"
        value={destination}
      />
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
