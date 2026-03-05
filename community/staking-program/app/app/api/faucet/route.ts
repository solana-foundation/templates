import { NextRequest, NextResponse } from 'next/server'
import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

const PROGRAM_ID = new PublicKey('55UVMV1TKf7qMeY66xffEeTzom9BSt6oeaoVQMZkZXCp')
const AMOUNT = 100 // 100 tokens per faucet request

export async function POST(req: NextRequest) {
  try {
    const { wallet } = await req.json()
    if (!wallet) {
      return NextResponse.json({ error: 'Missing wallet address' }, { status: 400 })
    }

    const recipient = new PublicKey(wallet)
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')

    // Load admin keypair (mint authority)
    const keypairPath = process.env.ADMIN_KEYPAIR_PATH || path.join(os.homedir(), '.config', 'solana', 'id.json')
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'))
    const admin = Keypair.fromSecretKey(Uint8Array.from(keypairData))

    // Get mint from GlobalState
    const [globalState] = PublicKey.findProgramAddressSync([Buffer.from('global_state')], PROGRAM_ID)
    const gsInfo = await connection.getAccountInfo(globalState)
    if (!gsInfo) {
      return NextResponse.json({ error: 'Pool not initialized. Run initialize-pool.ts first.' }, { status: 500 })
    }
    const mint = new PublicKey(gsInfo.data.slice(8 + 32, 8 + 64))

    // Create ATA if needed and mint tokens
    const ata = await getOrCreateAssociatedTokenAccount(connection, admin, mint, recipient)

    await mintTo(
      connection,
      admin,
      mint,
      ata.address,
      admin.publicKey,
      AMOUNT * 1e6, // 6 decimals
    )

    return NextResponse.json({
      success: true,
      amount: AMOUNT,
      mint: mint.toBase58(),
      ata: ata.address.toBase58(),
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
