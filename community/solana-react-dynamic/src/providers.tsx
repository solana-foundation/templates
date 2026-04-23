import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { SolanaWalletConnectors } from '@dynamic-labs/solana'

export function Providers({ children }: { children: React.ReactNode }) {
  const environmentId = import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID

  if (!environmentId) {
    throw new Error(
      'VITE_DYNAMIC_ENVIRONMENT_ID is not set. Copy .env.example to .env and add your Dynamic Environment ID.',
    )
  }

  return (
    <DynamicContextProvider
      settings={{
        environmentId,
        walletConnectors: [SolanaWalletConnectors],
      }}
    >
      {children}
    </DynamicContextProvider>
  )
}
