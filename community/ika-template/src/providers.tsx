import { type ReactNode } from 'react'
import { Toaster } from 'sonner'

import { SolanaWalletProvider } from '@/lib/solana-wallet'
import { ThemeProvider } from '@/components/theme-provider'

/**
 * App providers. The Sui operator is a generated keypair (lib/operator.ts) that
 * signs via our own SuiClient, so there's no Sui wallet provider here. The only
 * connected wallet is the user's Solana wallet (Phantom), handled by our small
 * Wallet-Standard context.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SolanaWalletProvider>
        {children}
        <Toaster richColors position="bottom-right" />
      </SolanaWalletProvider>
    </ThemeProvider>
  )
}
