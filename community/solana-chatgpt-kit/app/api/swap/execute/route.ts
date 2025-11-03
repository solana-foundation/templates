import { NextResponse } from 'next/server'
import { VersionedTransaction } from '@solana/web3.js'
import { getSolanaConnection, getWalletKeypair, JUPITER_API, externalWallet } from '@/lib/solana-config'
import { resolveTokenParam } from '@/lib/token-resolver'

export async function POST(request: Request) {
  try {
    console.log('Starting Jupiter swap execution...')

    const { inputToken, outputToken, amount, userPublicKey } = await request.json()

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 })
    }

    // Validate userPublicKey when using external wallet
    if (externalWallet && !userPublicKey) {
      return NextResponse.json({ error: 'userPublicKey is required when using external wallet' }, { status: 400 })
    }

    // Get wallet and connection
    const connection = getSolanaConnection()
    const wallet = externalWallet ? null : getWalletKeypair()
    const publicKeyString = externalWallet ? userPublicKey : wallet!.publicKey.toString()

    // Resolve token params (accept ticker or mint)
    const inputResolved = await resolveTokenParam(inputToken, 'SOL')
    const outputResolved = await resolveTokenParam(outputToken, 'USDC')
    const inputMint = inputResolved.mint
    const outputMint = outputResolved.mint

    // Convert amount to smallest unit
    const inputDecimals = inputResolved.decimals || 9
    const scaledAmount = Math.floor(parseFloat(amount) * Math.pow(10, inputDecimals))

    console.log('Swap parameters:', {
      inputMint,
      outputMint,
      amount: scaledAmount,
      userPublicKey: publicKeyString,
      externalWallet,
    })

    // Step 1: Get quote
    const quoteUrl =
      `${JUPITER_API.QUOTE}?` +
      `inputMint=${inputMint}` +
      `&outputMint=${outputMint}` +
      `&amount=${scaledAmount}` +
      `&slippageBps=50`

    console.log('Fetching quote...')
    const quoteResponse = await fetch(quoteUrl)

    if (!quoteResponse.ok) {
      const errorText = await quoteResponse.text()
      throw new Error(`Failed to get quote: ${errorText}`)
    }

    const quoteData = await quoteResponse.json()
    console.log('Got quote, outAmount:', quoteData.outAmount)

    // Step 2: Get swap transaction
    console.log('Creating swap transaction...')
    const swapResponse = await fetch(JUPITER_API.SWAP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quoteResponse: quoteData,
        userPublicKey: publicKeyString,
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
        prioritizationFeeLamports: 'auto',
      }),
    })

    if (!swapResponse.ok) {
      const errorText = await swapResponse.text()
      throw new Error(`Failed to create swap transaction: ${errorText}`)
    }

    const { swapTransaction } = await swapResponse.json()

    // If using external wallet, return unsigned transaction for client to sign
    if (externalWallet) {
      console.log('Prepared unsigned transaction for client signing.')
      const outputAmount = parseFloat(quoteData.outAmount) / Math.pow(10, outputResolved.decimals || 6)

      return NextResponse.json({
        success: true,
        swapTransaction, // base64 encoded unsigned transaction
        expectedOutputAmount: outputAmount,
        inputAmount: parseFloat(amount),
        inputToken: inputResolved.symbol,
        outputToken: outputResolved.symbol,
        timestamp: new Date().toISOString(),
      })
    }

    // Step 3: Deserialize and sign transaction (server wallet mode)
    console.log('Signing transaction with server wallet...')
    const transactionBuf = Buffer.from(swapTransaction, 'base64')
    const transaction = VersionedTransaction.deserialize(transactionBuf)

    // Sign the transaction
    transaction.sign([wallet!])

    // Step 4: Send transaction
    console.log('Sending transaction to Solana network...')
    const rawTransaction = transaction.serialize()
    const txid = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: true,
      maxRetries: 2,
    })

    console.log('Transaction sent:', txid)

    // Wait for confirmation
    console.log('Waiting for confirmation...')
    const confirmation = await connection.confirmTransaction(txid, 'confirmed')

    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`)
    }

    // Calculate output amount for response
    const outputAmount = parseFloat(quoteData.outAmount) / Math.pow(10, outputResolved.decimals || 6)

    return NextResponse.json({
      success: true,
      signature: txid,
      explorerUrl: `https://solscan.io/tx/${txid}`,
      inputAmount: parseFloat(amount),
      inputToken: inputResolved.symbol,
      outputAmount,
      outputToken: outputResolved.symbol,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error executing swap:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to execute swap',
      },
      { status: 500 },
    )
  }
}
