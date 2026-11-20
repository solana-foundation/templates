'use client'

import { useEffect, useRef, useState } from 'react'
import { useConnectedWallet } from '@solana/kit-plugin-wallet/react'
import { useSolana } from '@/components/provider'
import { prepareTransfer } from '@/lib/prepare-transfer'
import { describeWalletVersions } from '@/lib/wallet-versions'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { AppModal } from '@/components/app-modal'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function AccountUiModalSend({ address }: { address: string }) {
  const { client } = useSolana()
  const wallet = useConnectedWallet(client)
  const [destination, setDestination] = useState('')
  const [amount, setAmount] = useState('1')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [signature, setSignature] = useState('')
  const [selection, setSelection] = useState({ client, signer: wallet?.signer, address: wallet?.account.address })
  if (
    selection.client !== client ||
    selection.signer !== wallet?.signer ||
    selection.address !== wallet?.account.address
  ) {
    setSelection({ client, signer: wallet?.signer, address: wallet?.account.address })
    setPending(false)
    setError('')
    setSignature('')
  }
  const busy = useRef(false)
  const lifecycle = useRef<AbortController | null>(null)
  useEffect(() => {
    const controller = new AbortController()
    lifecycle.current = controller
    busy.current = false
    return () => controller.abort()
  }, [client, wallet?.signer, wallet?.account.address])
  return (
    <AppModal
      title="Send"
      busy={pending}
      submitDisabled={
        !destination || !amount || pending || !wallet?.signer || !wallet.supportedTransactionVersions.has(1)
      }
      submitLabel="Send"
      submit={async () => {
        const controller = lifecycle.current
        if (!address || busy.current || !controller || controller.signal.aborted) return
        busy.current = true
        setPending(true)
        setError('')
        setSignature('')
        try {
          const instructions = await prepareTransfer(client, destination, amount, controller.signal)
          controller.signal.throwIfAborted()
          const result = await client.sendTransaction(instructions, { abortSignal: controller.signal })
          if (!controller.signal.aborted) setSignature(result.context.signature)
        } catch (err) {
          if (!controller.signal.aborted) setError(err instanceof Error ? err.message : String(err))
        } finally {
          if (lifecycle.current === controller && !controller.signal.aborted) {
            busy.current = false
            setPending(false)
          }
        }
      }}
    >
      <Label htmlFor="destination">Destination</Label>
      <Input disabled={pending} id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
      <Label htmlFor="amount">Amount</Label>
      <Input
        disabled={pending}
        id="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        inputMode="decimal"
      />
      {wallet && !wallet.supportedTransactionVersions.has(1) && (
        <p role="alert">
          {wallet.wallet.name} does not advertise V1 support for all signing methods on this account.{' '}
          {describeWalletVersions(wallet)}
        </p>
      )}
      {error && <p role="alert">{error}</p>}
      {signature && <AppExplorerLink transaction={signature} label="Transfer confirmed" />}
    </AppModal>
  )
}
