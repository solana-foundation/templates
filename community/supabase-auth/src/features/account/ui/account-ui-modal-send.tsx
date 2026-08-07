'use client'

import { useState } from 'react'
import { address as toAddress, sol, solToLamports } from '@solana/kit'
import { useConnectedWallet } from '@solana/kit-plugin-wallet/react'
import { useAppClient } from '@/components/provider'
import { useSend } from '@/hooks/use-send'
import { AppModal } from '@/components/app-modal'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function AccountUiModalSend({ address }: { address: string }) {
  const client = useAppClient()
  const connected = useConnectedWallet(client)
  const { run, isSending } = useSend()
  const [destination, setDestination] = useState('')
  const [amount, setAmount] = useState('1')

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
        await run(
          () =>
            client.system.instructions
              .transferSol({ source: signer, destination: toAddress(target), amount: solToLamports(sol(amount)) })
              .sendTransaction()
              .then((result) => result.context.signature),
          'SOL transfer sent',
        )
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
