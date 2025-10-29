export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { address, signature as gillSignature, type Address } from 'gill'
import { env } from '@/lib/env'
import { getClient, getUsdcMintPk, getTreasuryPk, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@/lib/solana'

const paymentHeaderSchema = z.object({
  x402Version: z.number().int().positive(),
  scheme: z.string(),
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

    if (payload.to !== env.NEXT_PUBLIC_TREASURY_ADDRESS) {
      return NextResponse.json({ error: 'Invalid treasury address' }, { status: 400 })
    }

    if (payload.token !== env.NEXT_PUBLIC_USDC_DEVNET_MINT) {
      return NextResponse.json({ error: 'Invalid token mint' }, { status: 400 })
    }

    if (validation.data.scheme !== env.NEXT_PUBLIC_PAYMENT_SCHEME) {
      return NextResponse.json({ error: 'Invalid payment scheme' }, { status: 400 })
    }

    if (validation.data.network !== env.NEXT_PUBLIC_NETWORK) {
      return NextResponse.json({ error: 'Invalid network' }, { status: 400 })
    }

    const expectedAmount = Math.floor(
      env.NEXT_PUBLIC_PAYMENT_AMOUNT_USD * Math.pow(10, env.NEXT_PUBLIC_USDC_DECIMALS),
    ).toString()

    if (payload.amount !== expectedAmount) {
      return NextResponse.json({ error: 'Invalid payment amount' }, { status: 400 })
    }

    try {
      const { rpc } = getClient()
      const sig = gillSignature(payload.signature)
      const transaction = await rpc
        .getTransaction(sig, {
          encoding: 'jsonParsed',
          maxSupportedTransactionVersion: 0,
        })
        .send()

      if (!transaction) {
        return NextResponse.json({ error: 'Transaction not found on-chain' }, { status: 404 })
      }

      if (transaction.meta?.err) {
        return NextResponse.json({ error: 'Transaction failed on-chain' }, { status: 400 })
      }

      const treasuryPk = getTreasuryPk()
      const usdcMint = getUsdcMintPk()
      const fromAddr: Address = address(payload.from)

      const expectedSenderAta = await getAssociatedTokenAddress(usdcMint, fromAddr)
      const expectedTreasuryAta = await getAssociatedTokenAddress(usdcMint, treasuryPk)

      const instructions =
        'instructions' in transaction.transaction.message ? transaction.transaction.message.instructions : []

      let foundTransfer = false

      if (Array.isArray(instructions)) {
        for (const ix of instructions) {
          const ixObj = ix as {
            programId?: string
            keys?: Array<{ pubkey?: string }>
          }
          if (ixObj.programId === TOKEN_PROGRAM_ID) {
            const keys = ixObj.keys
            if (Array.isArray(keys) && keys.length >= 4) {
              const sourceStr = keys[0]?.pubkey
              const destinationStr = keys[2]?.pubkey

              if (sourceStr === expectedSenderAta && destinationStr === expectedTreasuryAta) {
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
                  getAccountKeys?: () => { get?: (index: number) => string }
                  staticAccountKeys?: Array<string>
                }

                let accountKeys: Array<string> = []
                if (msg.getAccountKeys) {
                  const keys = msg.getAccountKeys()
                  accountKeys = Array.from({ length: 256 }, (_, i) => keys.get?.(i)).filter(Boolean) as Array<string>
                } else if (msg.staticAccountKeys) {
                  accountKeys = msg.staticAccountKeys
                }

                const programId = accountKeys[ixObj.programIdIndex]
                if (programId === TOKEN_PROGRAM_ID) {
                  const accounts = ixObj.accounts
                  if (Array.isArray(accounts) && accounts.length >= 4) {
                    const sourceStr = accountKeys[accounts[0]] || ''
                    const destStr = accountKeys[accounts[2]] || ''

                    if (sourceStr === expectedSenderAta && destStr === expectedTreasuryAta) {
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
  return verifyPayment(request)
}
