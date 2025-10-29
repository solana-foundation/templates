export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { signature as gillSignature } from 'gill'
import { getClient } from '@/lib/solana'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { payment, paymentRequirements } = body

    if (!payment || !paymentRequirements) {
      return NextResponse.json({ isValid: false, reason: 'Missing payment or paymentRequirements' }, { status: 200 })
    }

    const { payload } = payment
    if (!payload || !payload.signature) {
      return NextResponse.json({ isValid: false, reason: 'Missing signature in payment payload' }, { status: 200 })
    }

    const { signature, to, amount, token } = payload

    if (to !== paymentRequirements.payTo) {
      return NextResponse.json({ isValid: false, reason: 'Invalid payTo address' }, { status: 200 })
    }

    if (token !== paymentRequirements.asset) {
      return NextResponse.json({ isValid: false, reason: 'Invalid token mint' }, { status: 200 })
    }

    if (amount !== paymentRequirements.maxAmountRequired) {
      return NextResponse.json({ isValid: false, reason: 'Invalid amount' }, { status: 200 })
    }

    const { rpc } = getClient()
    const sig = gillSignature(signature)

    let transaction
    try {
      transaction = await rpc
        .getTransaction(sig, {
          encoding: 'jsonParsed',
          maxSupportedTransactionVersion: 0,
        })
        .send()
    } catch {
      return NextResponse.json({ isValid: false, reason: 'Transaction not found' }, { status: 200 })
    }

    if (!transaction) {
      return NextResponse.json({ isValid: false, reason: 'Transaction not found' }, { status: 200 })
    }

    if (transaction.meta?.err) {
      return NextResponse.json({ isValid: false, reason: 'Transaction failed on-chain' }, { status: 200 })
    }

    return NextResponse.json(
      {
        isValid: true,
        transactionId: signature,
      },
      { status: 200 },
    )
  } catch {
    return NextResponse.json({ isValid: false, reason: 'Internal server error' }, { status: 500 })
  }
}
