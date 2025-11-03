import { NextResponse } from 'next/server'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, type Connection } from '@solana/web3.js'
import { getSolanaConnection, getWalletKeypair, externalWallet } from '@/lib/solana-config'
import { resolveAddressOrDomain } from '@/lib/address-resolver'
import { getX402Handler, X402_FEE_CONFIG } from '@/lib/x402-config'
import { baseURL } from '@/baseUrl'

export async function POST(request: Request) {
  try {
    const { toAddress, amount, userPublicKey } = await request.json()

    // x402 Payment Protocol (only for external wallet mode)
    let paymentHeader: string | null = null
    let paymentRequirements: any = null
    let x402: any = null

    if (externalWallet) {
      x402 = getX402Handler()
      paymentHeader = x402.extractPayment(Object.fromEntries(request.headers.entries()))

      // Create payment requirements for 0.001 SOL fee
      const resourceUrl = baseURL.startsWith('http') ? `${baseURL}/api/transfer` : `https://${baseURL}/api/transfer`

      paymentRequirements = await x402.createPaymentRequirements({
        price: {
          amount: X402_FEE_CONFIG.amount,
          asset: X402_FEE_CONFIG.solAsset,
        },
        network: X402_FEE_CONFIG.network,
        config: {
          description: X402_FEE_CONFIG.description,
          resource: resourceUrl as `${string}://${string}`,
          mimeType: 'application/json',
          maxTimeoutSeconds: 300,
        },
      })

      // If no payment header, return 402 Payment Required
      if (!paymentHeader) {
        const response = x402.create402Response(paymentRequirements)
        return NextResponse.json(response.body, { status: response.status })
      }

      // Verify payment with facilitator
      const verified = await x402.verifyPayment(paymentHeader, paymentRequirements)
      if (!verified) {
        return NextResponse.json({ error: 'Invalid or expired payment' }, { status: 402 })
      }
    }

    // Payment verified (or not required), proceed with transfer logic

    if (!toAddress || !amount) {
      return NextResponse.json({ error: 'toAddress and amount are required' }, { status: 400 })
    }

    // Validate userPublicKey when using external wallet
    if (externalWallet && !userPublicKey) {
      return NextResponse.json({ error: 'userPublicKey is required when using external wallet' }, { status: 400 })
    }

    const connection = getSolanaConnection()
    const wallet = externalWallet ? null : getWalletKeypair()
    const fromPublicKey = externalWallet ? new PublicKey(userPublicKey) : wallet!.publicKey

    // Resolve destination (address or domain)
    let destination: PublicKey
    try {
      destination = await resolveAddressOrDomain(toAddress, connection)
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : 'Invalid destination wallet or domain' },
        { status: 400 },
      )
    }

    const solAmount = parseFloat(amount)
    if (!Number.isFinite(solAmount) || solAmount <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 })
    }

    // Build transfer transaction
    const lamports = Math.round(solAmount * LAMPORTS_PER_SOL)

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromPublicKey,
        toPubkey: destination,
        lamports,
      }),
    )

    transaction.feePayer = fromPublicKey
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash

    // If using external wallet, return unsigned transaction for client to sign
    if (externalWallet) {
      console.log('Prepared unsigned transfer transaction for client signing.')
      const serialized = transaction.serialize({ requireAllSignatures: false })
      const transferTransaction = Buffer.from(serialized).toString('base64')

      // Settle x402 payment after preparing transaction
      if (x402 && paymentHeader) {
        await x402.settlePayment(paymentHeader, paymentRequirements)
      }

      return NextResponse.json({
        success: true,
        transferTransaction, // base64 encoded unsigned transaction
        from: fromPublicKey.toString(),
        to: destination.toString(),
        amount: solAmount,
        unit: 'SOL',
        timestamp: new Date().toISOString(),
      })
    }

    // Sign and send (server wallet mode)
    transaction.sign(wallet!)
    const signature = await connection.sendRawTransaction(transaction.serialize(), {
      skipPreflight: false,
      maxRetries: 2,
    })

    const confirmation = await connection.confirmTransaction(
      { signature, blockhash, lastValidBlockHeight },
      'confirmed',
    )
    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`)
    }

    // Note: No x402 settlement here because server wallet mode doesn't use x402

    return NextResponse.json({
      success: true,
      signature,
      explorerUrl: `https://solscan.io/tx/${signature}`,
      from: fromPublicKey.toString(),
      to: destination.toString(),
      amount: solAmount,
      unit: 'SOL',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error sending SOL:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to send SOL' }, { status: 500 })
  }
}
