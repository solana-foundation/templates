import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { address, type Address, type Instruction } from 'gill'
import { env } from '@/lib/env'
import {
  getUsdcMintPk,
  getTreasuryPk,
  getAssociatedTokenAddress,
  createTransferCheckedInstruction,
  confirmTransaction,
  getClient,
} from '@/lib/solana'
import { buildPaymentHeader } from '@/lib/x402'

const CONFIRMATION_DELAY_MS = 2000
const REDIRECT_DELAY_MS = 1500

type StatusType = 'success' | 'error' | 'info' | null

interface UsePaymentFlowReturn {
  isLoading: boolean
  buttonText: string
  handlePayment: () => Promise<void>
  showStatus: (message: string, type: StatusType) => void
  statusMessage: string
  statusType: StatusType
}

/**
 * Converts a Gill instruction to a web3.js Transaction for wallet adapter compatibility.
 * This is necessary because wallet adapters (Phantom, Solflare, etc.) only accept
 * web3.js Transaction objects for signing.
 *
 * @param gillInstruction - The Gill instruction to convert
 * @param feePayer - The wallet's PublicKey (from wallet adapter, which uses web3.js types)
 * @param recentBlockhash - Recent blockhash for the transaction
 */
async function convertGillInstructionToWeb3Transaction(
  gillInstruction: Instruction,
  feePayer: unknown, // web3.js PublicKey from wallet adapter
  recentBlockhash: string,
) {
  const { Transaction, PublicKey, TransactionInstruction } = await import('@solana/web3.js')

  const web3Instruction = new TransactionInstruction({
    programId: new PublicKey(gillInstruction.programAddress),
    keys: (gillInstruction.accounts || []).map((acc) => ({
      pubkey: new PublicKey(acc.address),
      isSigner: acc.role === 2,
      isWritable: acc.role === 1 || acc.role === 2,
    })),
    data: Buffer.from(gillInstruction.data || new Uint8Array()),
  })

  const transaction = new Transaction()
  transaction.feePayer = feePayer as InstanceType<typeof PublicKey>
  transaction.recentBlockhash = recentBlockhash
  transaction.add(web3Instruction)

  return transaction
}

function getErrorMessage(error: unknown): string {
  const errorMsg = error instanceof Error ? error.message : ''

  if (errorMsg.includes('already been processed')) {
    return 'Transaction was already sent. Please manually refresh the page.'
  }

  if (errorMsg.includes('0x1') || errorMsg.includes('insufficient')) {
    return 'Insufficient USDC balance. Get devnet USDC at: https://faucet.circle.com/'
  }

  if (errorMsg.includes('User rejected') || errorMsg.includes('cancelled')) {
    return 'Transaction cancelled by user.'
  }

  if (errorMsg.includes('Payment verification failed')) {
    return 'Payment was sent but verification failed. Check console for details, then manually refresh to see if it worked.'
  }

  return `Payment failed: ${errorMsg || 'Unknown error'}`
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

      const ownerAddress: Address = address(publicKey.toString())

      const senderTokenAccount = await getAssociatedTokenAddress(usdcMint, ownerAddress)
      const treasuryTokenAccount = await getAssociatedTokenAddress(usdcMint, treasuryPk)

      showStatus('Building transaction...', 'info')

      const transferInstruction = createTransferCheckedInstruction({
        source: senderTokenAccount,
        mint: usdcMint,
        destination: treasuryTokenAccount,
        owner: ownerAddress,
        amount: BigInt(usdcAmount),
        decimals: env.NEXT_PUBLIC_USDC_DECIMALS,
      })

      const { rpc } = getClient()
      const { value: latestBlockhash } = await rpc.getLatestBlockhash().send()

      const transaction = await convertGillInstructionToWeb3Transaction(
        transferInstruction,
        publicKey,
        latestBlockhash.blockhash,
      )

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

      await new Promise((resolve) => setTimeout(resolve, CONFIRMATION_DELAY_MS))

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
        }, REDIRECT_DELAY_MS)
      } else {
        const errorText = await response.text()
        console.error('❌ Payment verification failed!')
        console.error('Response Status:', response.status)
        console.error('Response Body:', errorText)

        throw new Error('Payment verification failed. Check console for details.')
      }
    } catch (error) {
      console.error('Payment error:', error)
      showStatus(getErrorMessage(error), 'error')
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
