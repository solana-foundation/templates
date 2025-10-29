export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { signature as gillSignature, address, type Address } from 'gill'
import { env } from '@/lib/env'
import { getClient, getUsdcMintPk, getTreasuryPk, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@/lib/solana'

/**
 * Settle endpoint for x402 protocol
 * POST /api/facilitator/settle
 *
 * This endpoint is called after payment verification to settle/finalize the payment.
 * Verifies the transaction on-chain before acknowledging settlement.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { transactionId, payment } = body

    if (!transactionId) {
      return NextResponse.json({ success: false, reason: 'Missing transactionId' }, { status: 400 })
    }

    if (!payment?.payload) {
      return NextResponse.json({ success: false, reason: 'Missing payment payload' }, { status: 400 })
    }

    console.log('Facilitator settle request:', { transactionId, payment: payment.payload })

    const { rpc } = getClient()
    const sig = gillSignature(transactionId)

    let transaction
    try {
      transaction = await rpc
        .getTransaction(sig, {
          encoding: 'jsonParsed',
          maxSupportedTransactionVersion: 0,
        })
        .send()
    } catch (error) {
      console.error('Failed to fetch transaction:', error)
      return NextResponse.json({ success: false, reason: 'Transaction not found on-chain' }, { status: 404 })
    }

    if (!transaction) {
      return NextResponse.json({ success: false, reason: 'Transaction not found on-chain' }, { status: 404 })
    }

    if (transaction.meta?.err) {
      return NextResponse.json({ success: false, reason: 'Transaction failed on-chain' }, { status: 400 })
    }

    const { payload } = payment
    const { from, to, amount, token } = payload

    if (to !== env.NEXT_PUBLIC_TREASURY_ADDRESS) {
      console.error('Treasury address mismatch:', { expected: env.NEXT_PUBLIC_TREASURY_ADDRESS, received: to })
      return NextResponse.json({ success: false, reason: 'Invalid treasury address' }, { status: 400 })
    }

    if (token !== env.NEXT_PUBLIC_USDC_DEVNET_MINT) {
      console.error('Token mint mismatch:', { expected: env.NEXT_PUBLIC_USDC_DEVNET_MINT, received: token })
      return NextResponse.json({ success: false, reason: 'Invalid token mint' }, { status: 400 })
    }

    const expectedAmount = Math.floor(
      env.NEXT_PUBLIC_PAYMENT_AMOUNT_USD * Math.pow(10, env.NEXT_PUBLIC_USDC_DECIMALS),
    ).toString()

    if (amount !== expectedAmount) {
      console.error('Payment amount mismatch:', { expected: expectedAmount, received: amount })
      return NextResponse.json({ success: false, reason: 'Invalid payment amount' }, { status: 400 })
    }

    const treasuryPk = getTreasuryPk()
    const usdcMint = getUsdcMintPk()
    const fromAddr: Address = address(from)

    const expectedSenderAta = await getAssociatedTokenAddress(usdcMint, fromAddr)
    const expectedTreasuryAta = await getAssociatedTokenAddress(usdcMint, treasuryPk)

    const instructions =
      'instructions' in transaction.transaction.message ? transaction.transaction.message.instructions : []

    let foundTransfer = false

    if (Array.isArray(instructions)) {
      for (let i = 0; i < instructions.length; i++) {
        const ixObj = instructions[i] as {
          programId?: string
          keys?: Array<{ pubkey?: string }>
          parsed?: {
            type?: string
            info?: {
              source?: string
              destination?: string
            }
          }
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

        if (ixObj.parsed?.type === 'transferChecked') {
          if (
            ixObj.parsed.info?.source === expectedSenderAta &&
            ixObj.parsed.info?.destination === expectedTreasuryAta
          ) {
            foundTransfer = true
            break
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
      console.error('Transfer instruction not found:', {
        expectedSender: expectedSenderAta,
        expectedTreasury: expectedTreasuryAta,
        transactionSignature: transactionId,
      })
      return NextResponse.json(
        { success: false, reason: 'Transaction does not contain expected transfer instruction' },
        { status: 400 },
      )
    }

    console.log('Payment settled successfully:', transactionId)
    return NextResponse.json(
      {
        success: true,
        message: 'Payment settled',
        transactionId,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Facilitator settle error:', error)
    return NextResponse.json(
      {
        success: false,
        reason: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
