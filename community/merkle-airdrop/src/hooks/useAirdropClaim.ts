'use client'

import { useEffect, useRef, useState } from 'react'
import { useClient } from '@solana/react'
import { useConnectedWallet } from '@solana/kit-plugin-wallet/react'
import type { AppClient } from '@/lib/solana-client'
import { prepareClaim } from '@/lib/airdrop-client'

export function useAirdropClaim() {
  const client = useClient<AppClient>()
  const wallet = useConnectedWallet(client)
  const [isLoading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [signature, setSignature] = useState<string | null>(null)
  const [selection, setSelection] = useState({ signer: wallet?.signer, address: wallet?.account.address })
  if (selection.signer !== wallet?.signer || selection.address !== wallet?.account.address) {
    setSelection({ signer: wallet?.signer, address: wallet?.account.address })
    setLoading(false)
    setStatus('')
    setSignature(null)
  }
  const lifecycle = useRef<AbortController | null>(null)
  const busy = useRef(false)
  useEffect(() => {
    const controller = new AbortController()
    lifecycle.current = controller
    busy.current = false
    return () => controller.abort()
  }, [wallet?.signer, wallet?.account.address])
  const canClaim = Boolean(wallet?.signer && wallet.supportedTransactionVersions.has(1))
  async function handleClaimAirdrop() {
    const controller = lifecycle.current
    if (!canClaim || busy.current || !controller || controller.signal.aborted) return
    busy.current = true
    setLoading(true)
    setStatus('Preparing claim...')
    setSignature(null)
    try {
      const prepared = await prepareClaim(client, controller.signal)
      controller.signal.throwIfAborted()
      setStatus('Approve the claim in your wallet...')
      const sent = await client.sendTransaction(prepared.message, { abortSignal: controller.signal })
      if (!controller.signal.aborted) {
        setSignature(sent.context.signature)
        setStatus('Airdrop claim confirmed.')
      }
    } catch (error) {
      if (!controller.signal.aborted) setStatus(error instanceof Error ? error.message : 'Claim failed. Please retry.')
    } finally {
      if (lifecycle.current === controller && !controller.signal.aborted) {
        busy.current = false
        setLoading(false)
      }
    }
  }
  return { isLoading, status, signature, canClaim, handleClaimAirdrop }
}
