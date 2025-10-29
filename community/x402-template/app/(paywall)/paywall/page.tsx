import type { Metadata } from 'next'
import { WalletProvider } from '@/providers/WalletProvider'
import { PaywallContainer } from '@/components/paywall/paywall-container'

export const metadata: Metadata = {
  title: 'Payment Required – Solana',
  description: 'Connect your Solana wallet and pay with USDC to access protected content',
}

/**
 * Paywall Page
 *
 * Environment Variables:
 * - NEXT_PUBLIC_RPC_ENDPOINT: Solana RPC endpoint (default: https://api.devnet.solana.com)
 * - NEXT_PUBLIC_USDC_DEVNET_MINT: USDC devnet mint address
 * - NEXT_PUBLIC_TREASURY_ADDRESS: Treasury address to receive payments
 * - NEXT_PUBLIC_PAYMENT_AMOUNT_USD: Payment amount in USD (default: 0.01)
 * - NEXT_PUBLIC_USDC_DECIMALS: USDC decimals (default: 6)
 *
 * To customize:
 * - Price: Update NEXT_PUBLIC_PAYMENT_AMOUNT_USD in .env
 * - Mint: Update NEXT_PUBLIC_USDC_DEVNET_MINT
 * - Treasury: Update NEXT_PUBLIC_TREASURY_ADDRESS
 * - Network: Change RPC endpoint and update WalletAdapterNetwork in WalletProvider
 */
export default function PaywallPage() {
  return (
    <WalletProvider>
      <PaywallContainer />
    </WalletProvider>
  )
}


