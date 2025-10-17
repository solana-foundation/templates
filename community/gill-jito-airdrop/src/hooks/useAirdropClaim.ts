'use client'

import { useState } from 'react'
import { checkClaimStatus, claimAirdrop, type AirdropClaimConfig } from '../lib/airdrop-client'
import { AIRDROP_CONFIG, validateConfig } from '@/lib/config'

interface UseAirdropClaimResult {
  isLoading: boolean
  status: string
  handleClaimAirdrop: () => Promise<void>
}

export function useAirdropClaim(): UseAirdropClaimResult {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState('')

  const handleClaimAirdrop = async () => {
    setIsLoading(true)
    setStatus('Initializing...')

    try {
      validateConfig()

      const config: AirdropClaimConfig = {
        privateKey: AIRDROP_CONFIG.PRIVATE_KEY!,
        network: AIRDROP_CONFIG.NETWORK,
      }

      setStatus('Checking if airdrop has already been claimed...')

      const alreadyClaimed = await checkClaimStatus(config, AIRDROP_CONFIG.PRIVATE_KEY!)

      if (alreadyClaimed) {
        setStatus('Already claimed')
        return
      }

      setStatus('Claiming airdrop...')

      const result = await claimAirdrop(config, AIRDROP_CONFIG.PRIVATE_KEY!)

      setStatus('Success!')
      console.log('Claim result:', result)
      alert(
        `Airdrop claimed successfully!\nAmount: ${parseInt(result.amount) / 1e9} SOL\nSignature: ${result.signature}`,
      )
    } catch (error) {
      console.error('Error:', error)
      setStatus('Error occurred')
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    status,
    handleClaimAirdrop,
  }
}
