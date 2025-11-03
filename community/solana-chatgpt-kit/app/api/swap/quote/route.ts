import { NextResponse } from 'next/server'
import { JUPITER_API, TOKENS, TOKEN_DECIMALS } from '@/lib/solana-config'
import { resolveTokenParam } from '@/lib/token-resolver'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const inputToken = searchParams.get('inputToken') || 'SOL'
    const outputToken = searchParams.get('outputToken') || 'USDC'
    const amount = searchParams.get('amount')

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 })
    }

    // Resolve symbols or mint addresses
    const inputResolved = await resolveTokenParam(inputToken, 'SOL')
    const outputResolved = await resolveTokenParam(outputToken, 'USDC')
    const inputMint = inputResolved.mint
    const outputMint = outputResolved.mint

    // Convert amount to smallest unit (lamports for SOL)
    const inputDecimals = inputResolved.decimals || 9
    const scaledAmount = Math.floor(parseFloat(amount) * Math.pow(10, inputDecimals))

    // Build Jupiter quote URL
    const quoteUrl =
      `${JUPITER_API.QUOTE}?` +
      `inputMint=${inputMint}` +
      `&outputMint=${outputMint}` +
      `&amount=${scaledAmount}` +
      `&slippageBps=50`

    console.log('Fetching Jupiter quote:', quoteUrl)

    const response = await fetch(quoteUrl)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Jupiter quote error:', errorText)
      return NextResponse.json({ error: `Failed to fetch quote: ${errorText}` }, { status: response.status })
    }

    const quoteData = await response.json()

    // Calculate output amount in human-readable format
    const outputDecimals = outputResolved.decimals || 6
    const outputAmount = parseFloat(quoteData.outAmount) / Math.pow(10, outputDecimals)

    return NextResponse.json({
      inputAmount: parseFloat(amount),
      inputToken: inputResolved.symbol,
      outputAmount,
      outputToken: outputResolved.symbol,
      priceImpact: quoteData.priceImpactPct,
      quote: quoteData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching quote:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch quote' },
      { status: 500 },
    )
  }
}
