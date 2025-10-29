import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { env } from '@/lib/env'
import {
  getUsdcMintPk,
  getTreasuryPk,
  getAssociatedTokenAddressAsync,
  createUsdcTransferCheckedIx,
  confirmTransaction,
} from '@/lib/solana'
import { buildPaymentHeader } from '@/lib/x402'

type StatusType = 'success' | 'error' | 'info' | null

interface UsePaymentFlowReturn {
  isLoading: boolean
  buttonText: string
  handlePayment: () => Promise<void>
  showStatus: (message: string, type: StatusType) => void
  statusMessage: string
  statusType: StatusType
}

export function usePaymentFlow(): UsePaymentFlowReturn {
  const router = useRouter()
  const { connection } = useConnection()
  const { publicKey, wallet, sendTransaction } = useWallet()
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [statusType, setStatusType] = useState<StatusType>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [buttonText, setButtonText] = useState('')

  const showStatus = (message: string, type: StatusType) => {
    setStatusMessage(message)
    setStatusType(type)
    if (type === 'error') {
      console.error(message)
    }
  }

  const handlePayment = async () => {
    if (!publicKey || !wallet) {
      showStatus('Please connect your wallet first', 'error')
      return
    }

    setIsLoading(true)
    setButtonText('Processing Payment...')
    showStatus('Creating transaction...', 'info')

    try {
      const treasuryPk = getTreasuryPk()
      const usdcMint = getUsdcMintPk()
      const usdcAmount = Math.floor(env.NEXT_PUBLIC_PAYMENT_AMOUNT_USD * Math.pow(10, env.NEXT_PUBLIC_USDC_DECIMALS))

      showStatus('Finding token accounts...', 'info')

      const senderTokenAccount = await getAssociatedTokenAddressAsync(usdcMint, publicKey)
      const treasuryTokenAccount = await getAssociatedTokenAddressAsync(usdcMint, treasuryPk)

      showStatus('Building transaction...', 'info')

      const transaction = new Transaction()
      transaction.feePayer = publicKey

      const transferInstruction = await createUsdcTransferCheckedIx({
        source: senderTokenAccount,
        destination: treasuryTokenAccount,
        owner: publicKey,
        amount: usdcAmount,
      })

      transaction.add(transferInstruction)

      const { blockhash } = await connection.getLatestBlockhash('confirmed')
      transaction.recentBlockhash = blockhash

      showStatus('Please approve the transaction in Phantom...', 'info')

      let signature: string
      try {
        signature = await sendTransaction(transaction, connection, { skipPreflight: false })
      } catch (sendError) {
        const errorMsg = sendError instanceof Error ? sendError.message : ''
        if (errorMsg.includes('User rejected') || errorMsg.includes('cancelled')) {
          throw new Error('Transaction cancelled by user.')
        }
        throw sendError
      }

      showStatus('Confirming transaction...', 'info')

      await confirmTransaction(signature)

      await new Promise((resolve) => setTimeout(resolve, 2000))

      const paymentHeader = buildPaymentHeader({
        signature,
        from: publicKey.toString(),
        to: env.NEXT_PUBLIC_TREASURY_ADDRESS,
        amount: usdcAmount.toString(),
        token: env.NEXT_PUBLIC_USDC_DEVNET_MINT,
        network: 'solana-devnet',
      })

      showStatus('Verifying payment with server...', 'info')

      const resource = '/protected'

      const response = await fetch(resource, {
        method: 'GET',
        headers: {
          'X-PAYMENT': paymentHeader,
        },
      })

      if (response.ok) {
        showStatus('Payment successful! Redirecting...', 'success')
        setButtonText('Success! Redirecting...')

        setTimeout(() => {
          router.push('/protected')
        }, 1500)
      } else {
        const errorText = await response.text()
        console.error('❌ Payment verification failed!')
        console.error('Response Status:', response.status)
        console.error('Response Body:', errorText)

        throw new Error('Payment verification failed. Check console for details.')
      }
    } catch (error) {
      console.error('Payment error:', error)

      let errorMessage = `Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`

      const errorMsg = error instanceof Error ? error.message : ''
      if (errorMsg.includes('already been processed')) {
        errorMessage = 'Transaction was already sent. Please manually refresh the page.'
      } else if (errorMsg.includes('0x1') || errorMsg.includes('insufficient')) {
        errorMessage = 'Insufficient USDC balance. Get devnet USDC at: https://faucet.circle.com/'
      } else if (errorMsg.includes('User rejected') || errorMsg.includes('cancelled')) {
        errorMessage = 'Transaction cancelled by user.'
      } else if (errorMsg.includes('Payment verification failed')) {
        errorMessage =
          'Payment was sent but verification failed. Check console for details, then manually refresh to see if it worked.'
      }

      showStatus(errorMessage, 'error')
      setButtonText('Retry Payment')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    buttonText,
    handlePayment,
    showStatus,
    statusMessage,
    statusType,
  }
}
