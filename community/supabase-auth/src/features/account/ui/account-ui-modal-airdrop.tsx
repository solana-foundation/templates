'use client'

import { useRef, useState } from 'react'
import { address as toAddress, lamports } from '@solana/kit'
import { useSolana } from '@/components/provider'
import { parseSol } from '@/lib/sol-amount'
import { AppModal } from '@/components/app-modal'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function AccountUiModalAirdrop({ address }: { address: string }) {
  const { client, cluster } = useSolana()
  const [amount, setAmount] = useState('2')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const busy = useRef(false)
  return (
    <AppModal
      title="Airdrop"
      submitDisabled={!amount || pending || cluster.id === 'mainnet-beta'}
      submitLabel="Request Airdrop"
      submit={async () => {
        if (busy.current || cluster.id === 'mainnet-beta') return
        busy.current = true
        setPending(true)
        setError('')
        try {
          await client.rpc.requestAirdrop(toAddress(address), lamports(parseSol(amount))).send()
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err))
        } finally {
          busy.current = false
          setPending(false)
        }
      }}
    >
      <Label htmlFor="airdrop-amount">Amount</Label>
      <Input id="airdrop-amount" disabled={pending} value={amount} onChange={(e) => setAmount(e.target.value)} />
      {error && <p role="alert">{error}</p>}
    </AppModal>
  )
}
