import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { env } from '@/lib/env'
import { getConnection, getUsdcMintPk, getTreasuryPk, getAssociatedTokenAddressAsync } from '@/lib/solana'

const paymentHeaderSchema = z.object({
  x402Version: z.number().int().positive(),
  scheme: z.literal('exact'),
  network: z.string(),
  payload: z.object({
    signature: z.string(),
    from: z.string(),
    to: z.string(),
    amount: z.string(),
    token: z.string(),
  }),
})

async function verifyPayment(request: NextRequest) {
  try {
    const paymentHeader = request.headers.get('X-PAYMENT')
    if (!paymentHeader) {
      return NextResponse.json({ error: 'Missing X-PAYMENT header' }, { status: 400 })
    }

    let paymentData
    try {
      paymentData = JSON.parse(paymentHeader)
    } catch {
      return NextResponse.json({ error: 'Invalid X-PAYMENT header format' }, { status: 400 })
    }

    const validation = paymentHeaderSchema.safeParse(paymentData)
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid payment data structure', details: validation.error }, { status: 400 })
    }

    const { payload } = validation.data

    // Basic checks
    if (payload.to !== env.NEXT_PUBLIC_TREASURY_ADDRESS) {
      return NextResponse.json({ error: 'Invalid treasury address' }, { status: 400 })
    }

    if (payload.token !== env.NEXT_PUBLIC_USDC_DEVNET_MINT) {
      return NextResponse.json({ error: 'Invalid token mint' }, { status: 400 })
    }

    if (validation.data.network !== 'solana-devnet') {
      return NextResponse.json({ error: 'Invalid network' }, { status: 400 })
    }

    const expectedAmount = Math.floor(
      env.NEXT_PUBLIC_PAYMENT_AMOUNT_USD * Math.pow(10, env.NEXT_PUBLIC_USDC_DECIMALS),
    ).toString()

    if (payload.amount !== expectedAmount) {
      return NextResponse.json({ error: 'Invalid payment amount' }, { status: 400 })
    }

    try {
      const connection = getConnection()
      const transaction = await connection.getTransaction(payload.signature, {
        maxSupportedTransactionVersion: 0,
      })

      if (!transaction) {
        return NextResponse.json({ error: 'Transaction not found on-chain' }, { status: 404 })
      }

      if (transaction.meta?.err) {
        return NextResponse.json({ error: 'Transaction failed on-chain' }, { status: 400 })
      }

      const treasuryPk = getTreasuryPk()
      const usdcMint = getUsdcMintPk()
      const { PublicKey: PublicKeyClass } = await import('@solana/web3.js')
      const fromPk = new PublicKeyClass(payload.from)

      const expectedSenderAta = await getAssociatedTokenAddressAsync(usdcMint, fromPk)
      const expectedTreasuryAta = await getAssociatedTokenAddressAsync(usdcMint, treasuryPk)

      const instructions =
        'instructions' in transaction.transaction.message ? transaction.transaction.message.instructions : []

      let foundTransfer = false

      if (Array.isArray(instructions)) {
        for (const ix of instructions) {
          const ixObj = ix as {
            programId?: { equals?: (pk: unknown) => boolean }
            keys?: Array<{ pubkey?: { toString: () => string } }>
          }
          if (ixObj.programId?.equals?.(TOKEN_PROGRAM_ID)) {
            const keys = ixObj.keys
            if (Array.isArray(keys) && keys.length >= 4) {
              const sourceStr = keys[0]?.pubkey?.toString()
              const destinationStr = keys[2]?.pubkey?.toString()

              if (sourceStr === expectedSenderAta.toString() && destinationStr === expectedTreasuryAta.toString()) {
                foundTransfer = true
                break
              }
            }
          }
        }
      }

      if (!foundTransfer) {
        const innerInstructions = transaction.meta?.innerInstructions || []
        for (const innerIx of innerInstructions) {
          if (Array.isArray(innerIx.instructions)) {
            for (const ix of innerIx.instructions) {
              const ixObj = ix as unknown as { programIdIndex?: number; accounts?: number[] }
              if (typeof ixObj.programIdIndex === 'number') {
                const msg = transaction.transaction.message as unknown as {
                  getAccountKeys?: () => { get?: (index: number) => { pubkey?: { equals?: (pk: unknown) => boolean } } }
                  staticAccountKeys?: Array<{ pubkey?: { equals?: (pk: unknown) => boolean } }>
                }

                let accountKeys: Array<{ pubkey?: { equals?: (pk: unknown) => boolean; toString?: () => string } }> = []
                if (msg.getAccountKeys) {
                  const keys = msg.getAccountKeys()
                  accountKeys = Array.from({ length: 256 }, (_, i) => keys.get?.(i)).filter(Boolean) as Array<{
                    pubkey?: { equals?: (pk: unknown) => boolean; toString?: () => string }
                  }>
                } else if (msg.staticAccountKeys) {
                  accountKeys = msg.staticAccountKeys
                }

                const programId = accountKeys[ixObj.programIdIndex]?.pubkey
                if (programId?.equals?.(TOKEN_PROGRAM_ID)) {
                  const accounts = ixObj.accounts
                  if (Array.isArray(accounts) && accounts.length >= 4) {
                    const sourceKey = accountKeys[accounts[0]]?.pubkey
                    const destKey = accountKeys[accounts[2]]?.pubkey
                    const sourceStr = sourceKey?.toString?.() || ''
                    const destStr = destKey?.toString?.() || ''

                    if (sourceStr === expectedSenderAta.toString() && destStr === expectedTreasuryAta.toString()) {
                      foundTransfer = true
                      break
                    }
                  }
                }
              }
            }
          }
          if (foundTransfer) break
        }
      }

      if (!foundTransfer) {
        return NextResponse.json(
          { error: 'Transaction does not contain expected transfer instruction' },
          { status: 400 },
        )
      }
    } catch (verifyError) {
      console.error('Transaction verification error:', verifyError)
    }

    return NextResponse.json({ verified: true, signature: payload.signature }, { status: 200 })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  return verifyPayment(request)
}

export async function POST(request: NextRequest) {
  // Support POST for flexibility - same logic as GET
  return verifyPayment(request)
}
