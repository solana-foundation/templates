import { NextResponse } from 'next/server'
import { getSolanaConnection } from '@/lib/solana-config'
import { resolveAddressOrDomain } from '@/lib/address-resolver'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const account = searchParams.get('account')

    if (!account) {
      return NextResponse.json({ error: 'account is required' }, { status: 400 })
    }

    const connection = getSolanaConnection()
    const pubkey = await resolveAddressOrDomain(account, connection)

    const lamports = await connection.getBalance(pubkey, { commitment: 'confirmed' })
    const sol = lamports / LAMPORTS_PER_SOL

    return NextResponse.json({
      account: account,
      resolvedAddress: pubkey.toBase58(),
      sol,
      lamports,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch balance' },
      { status: 500 },
    )
  }
}
