import { createDynamicClient } from '@dynamic-labs-sdk/client'
import { addSolanaWalletStandardExtension } from '@dynamic-labs-sdk/solana/walletStandard'
import { addWaasSolanaExtension } from '@dynamic-labs-sdk/solana/waas'

const environmentId = import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID
if (!environmentId) {
  throw new Error(
    'VITE_DYNAMIC_ENVIRONMENT_ID is not set. Copy .env.example to .env and add your Dynamic Environment ID.',
  )
}

export const dynamicClient = createDynamicClient({
  environmentId,
  metadata: {
    name: 'Solana + Dynamic',
    universalLink: window.location.origin,
  },
})

addSolanaWalletStandardExtension()
addWaasSolanaExtension()
