import { BaseAPI } from './BaseAPI'
import { Buffer } from 'buffer'
import {
  PublicKey,
  VersionedTransaction,
  TransactionMessage,
  ComputeBudgetProgram,
  Keypair,
  Connection,
} from '@solana/web3.js'
import {
  getAssociatedTokenAddress,
  createTransferCheckedInstruction,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token'
import { getWallet, getConnection } from '../utils/wallet'
import { getCurrentNetwork } from '../utils/network'
import { log } from '../utils/logger'

interface PaymentRequirement {
  scheme: string
  network: string
  payTo: string
  maxAmountRequired: string
  asset: string
  resource: string
  description?: string
  mimeType?: string
}

interface Payment402Response {
  error: string
  paymentRequirements: PaymentRequirement[]
}

interface PaymentPayload {
  x402Version: number
  scheme: string
  network: string
  payload: {
    transaction: string
  }
}

/**
 * Paid Endpoint API
 * Requires payment via x402 protocol
 */
export class PaidAPI extends BaseAPI {
  constructor() {
    super({
      name: 'Paid Endpoint',
      path: '/api/paid',
      method: 'GET',
      description: 'Protected endpoint - requires x402 payment',
      requiresPayment: true,
      buttonId: 'test-paid-no-payment-btn',
      responseId: 'paid-response',
    })
  }

  /**
   * Override setup to handle multiple buttons
   */
  setup(apiBaseUrl: string): void {
    const noPaymentBtn = document.getElementById('test-paid-no-payment-btn')
    const withPaymentBtn = document.getElementById('test-paid-with-payment-btn')

    if (noPaymentBtn) {
      noPaymentBtn.addEventListener('click', () => this.testWithoutPayment(apiBaseUrl))
    }

    if (withPaymentBtn) {
      withPaymentBtn.addEventListener('click', () => this.testWithPayment(apiBaseUrl))
    }
  }

  /**
   * Test without payment (expect 402)
   */
  async testWithoutPayment(apiBaseUrl: string): Promise<void> {
    const responseEl = document.getElementById(this.responseId)
    if (responseEl) {
      responseEl.classList.remove('show', 'success', 'error')
    }

    try {
      log('info', 'Testing paid endpoint without payment...')
      const response = await fetch(`${apiBaseUrl}${this.path}`, {
        method: this.method,
      })

      const data = await response.json()

      if (responseEl) {
        responseEl.textContent = JSON.stringify(data, null, 2)
        if (response.status === 402) {
          responseEl.classList.add('show', 'error')
          log('info', 'Received 402 Payment Required (expected)')
        } else {
          responseEl.classList.add('show', 'success')
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      if (responseEl) {
        responseEl.textContent = `Error: ${errorMessage}`
        responseEl.classList.add('show', 'error')
      }
      log('error', `Request failed: ${errorMessage}`)
    }
  }

  /**
   * Test with payment
   */
  async testWithPayment(apiBaseUrl: string): Promise<void> {
    const responseEl = document.getElementById(this.responseId)
    if (responseEl) {
      responseEl.classList.remove('show', 'success', 'error')
    }

    const wallet = getWallet()
    if (!wallet) {
      alert('Please load your wallet first!')
      log('error', 'No wallet loaded. Click "Load Wallet from .env" first.')
      return
    }

    const connection = getConnection()
    if (!connection) {
      log('error', 'No connection available')
      return
    }

    const currentNetwork = getCurrentNetwork()

    try {
      log('info', 'Creating payment transaction (user pays fees)...')

      // Get payment requirements first
      const reqResponse = await fetch(`${apiBaseUrl}${this.path}`, {
        method: this.method,
      })
      const requirements: Payment402Response = await reqResponse.json()

      if (reqResponse.status !== 402 || !requirements.paymentRequirements) {
        throw new Error('Failed to get payment requirements')
      }

      const paymentReq = requirements.paymentRequirements[0]
      log('info', `Payment required: ${paymentReq.maxAmountRequired} of ${paymentReq.asset}`)

      // Verify network matches
      const expectedNetwork = currentNetwork === 'devnet' ? 'solana-devnet' : 'solana-mainnet'
      if (paymentReq.network !== expectedNetwork) {
        throw new Error(`Network mismatch: API expects ${paymentReq.network} but you're on ${expectedNetwork}`)
      }

      // Build payment transaction
      const paymentPayload = await this.buildPaymentTransaction(wallet, connection, paymentReq)

      log('info', 'Sending payment with X-PAYMENT header...')

      // Send request with payment
      const response = await fetch(`${apiBaseUrl}${this.path}`, {
        method: this.method,
        headers: {
          'Content-Type': 'application/json',
          'X-PAYMENT': btoa(JSON.stringify(paymentPayload)),
        },
      })

      const data = await response.json()

      if (responseEl) {
        responseEl.textContent = JSON.stringify(data, null, 2)
        if (response.ok) {
          responseEl.classList.add('show', 'success')
          log('success', 'Payment verified! Access granted to paid content.')
        } else {
          responseEl.classList.add('show', 'error')
          log('error', `Payment verification failed: ${response.status}`)
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      if (responseEl) {
        responseEl.textContent = `Error: ${errorMessage}`
        responseEl.classList.add('show', 'error')
      }
      log('error', `Payment failed: ${errorMessage}`)
    }
  }

  /**
   * Build x402 payment transaction
   */
  private async buildPaymentTransaction(
    wallet: Keypair,
    connection: Connection,
    paymentReq: PaymentRequirement,
  ): Promise<PaymentPayload> {
    const receiverPubkey = new PublicKey(paymentReq.payTo)
    const usdcMint = new PublicKey(paymentReq.asset)
    const amount = parseInt(paymentReq.maxAmountRequired)

    // USER PAYS FEES - User is the fee payer (simpler, faster, no server signing)
    const feePayerPubkey = wallet.publicKey

    log('info', `Amount: ${amount} (${amount / 1_000_000} USDC)`)
    log('info', 'Note: User needs SOL for transaction fees (~0.000005 SOL + potential ~0.002 SOL for ATA creation)')

    // Get associated token accounts
    const fromTokenAccount = await getAssociatedTokenAddress(usdcMint, wallet.publicKey)
    const toTokenAccount = await getAssociatedTokenAddress(usdcMint, receiverPubkey)

    // Check if recipient's token account exists, create if needed
    // NOTE: In production, receivers typically already have USDC ATAs set up.
    // This check ensures the payment succeeds even if the receiver doesn't have an ATA yet.
    // The sender pays a one-time fee (~0.00203928 SOL) to create the receiver's ATA.
    // This fee is only paid once - subsequent transactions to the same receiver won't need this.
    const recipientAccountInfo = await connection.getAccountInfo(toTokenAccount)

    const instructions = [
      ComputeBudgetProgram.setComputeUnitLimit({ units: 200_000 }),
      ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1 }),
    ]

    // Add ATA creation instruction if recipient doesn't have one
    if (!recipientAccountInfo) {
      log('info', 'Recipient ATA does not exist. Adding creation instruction (sender pays ~0.002 SOL fee)')
      instructions.push(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey, // payer (sender pays the ATA creation fee)
          toTokenAccount, // ATA address
          receiverPubkey, // owner (payment recipient wallet)
          usdcMint, // USDC mint
        ),
      )
    }

    // Add the USDC transfer instruction
    instructions.push(
      createTransferCheckedInstruction(
        fromTokenAccount, // from (sender's USDC account)
        usdcMint, // mint
        toTokenAccount, // to (receiver's USDC account)
        wallet.publicKey, // owner (sender)
        amount, // amount in smallest units
        6, // decimals for USDC
      ),
    )

    // Get latest blockhash RIGHT before creating transaction (minimize time window)
    log('info', 'Getting fresh blockhash...')
    const { blockhash } = await connection.getLatestBlockhash('confirmed')
    log('info', `Got blockhash: ${blockhash.substring(0, 8)}...`)

    // Create V0 message immediately after getting blockhash
    const messageV0 = new TransactionMessage({
      payerKey: feePayerPubkey,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message()

    // Create VersionedTransaction
    const transaction = new VersionedTransaction(messageV0)

    // Client signs the transaction
    transaction.sign([wallet])

    log('info', 'Transaction signed by client wallet')

    // Serialize and encode to base64
    const serializedTx = transaction.serialize()
    const base64Tx = Buffer.from(serializedTx).toString('base64')

    // Create payment payload (x402 format)
    return {
      x402Version: 1,
      scheme: paymentReq.scheme,
      network: paymentReq.network,
      payload: {
        transaction: base64Tx,
      },
    }
  }
}
