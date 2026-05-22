import { createDynamicClient, initializeClient } from '@dynamic-labs-sdk/client'
import { addSolanaExtension } from '@dynamic-labs-sdk/solana'

export const dynamicClient = createDynamicClient({
  autoInitialize: false,
  environmentId: import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID,
  metadata: {
    name: 'Solana + Dynamic',
    universalLink: window.location.origin,
  },
})

addSolanaExtension()
void initializeClient()
