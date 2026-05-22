'use client'
import { createDynamicClient } from '@dynamic-labs-sdk/client'
import { addSolanaWalletStandardExtension } from '@dynamic-labs-sdk/solana/walletStandard'
import { addWaasSolanaExtension } from '@dynamic-labs-sdk/solana/waas'

export const dynamicClient = createDynamicClient({
  environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
  metadata: {
    name: 'Solana + Dynamic',
    universalLink: typeof window !== 'undefined' ? window.location.origin : '',
  },
})

addSolanaWalletStandardExtension()
addWaasSolanaExtension()
