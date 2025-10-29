'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { PriceBox } from './price-box'
import { StatusMessage } from './status-message'
import { ActionButton } from './action-button'
import { WalletAddress } from './wallet-address'
import { env } from '@/lib/env'
import { usePaymentCheck } from './hooks/use-payment-check'
import { useWalletConnection } from './hooks/use-wallet-connection'
import { usePaymentFlow } from './hooks/use-payment-flow'

export function PaywallContainer() {
  const { publicKey } = useWallet()
  const formattedAmount = env.NEXT_PUBLIC_PAYMENT_AMOUNT_USD.toFixed(2)

  usePaymentCheck()

  const walletConnection = useWalletConnection(formattedAmount)

  const paymentFlow = usePaymentFlow()

  const statusMessage = walletConnection.statusMessage || paymentFlow.statusMessage
  const statusType = walletConnection.statusType || paymentFlow.statusType

  const isLoading = walletConnection.isLoading || paymentFlow.isLoading

  const buttonText = paymentFlow.buttonText || walletConnection.buttonText

  const handleAction = async () => {
    if (!publicKey) {
      await walletConnection.handleConnect()
    } else {
      await paymentFlow.handlePayment()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-[linear-gradient(135deg,#14F195_0%,#9945FF_100%)]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-[480px] w-full p-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Required</h1>

        <p className="text-base text-gray-600 mb-8 leading-relaxed">
          Connect your Solana wallet and pay with USDC to access this protected content
        </p>

        <PriceBox />

        {publicKey && <WalletAddress address={publicKey.toString()} />}

        <StatusMessage message={statusMessage} type={statusType} />

        <ActionButton text={buttonText} onClick={handleAction} disabled={false} isLoading={isLoading} />

        <div className="mt-8 pt-6 border-t-2 border-gray-100 text-xs text-gray-500">
          <div className="font-semibold text-gray-600 mb-1.5">Network: Solana Devnet</div>
          <div>Powered by Custom x402 Solana Protocol</div>
        </div>
      </div>
    </div>
  )
}
