const fs = require('fs')
const os = require('os')
const path = require('path')
const anchor = require('@coral-xyz/anchor')
const { Connection, Keypair, PublicKey } = require('@solana/web3.js')
const { TOKEN_PROGRAM_ID, getMint, getOrCreateAssociatedTokenAccount, mintTo } = require('@solana/spl-token')

const GLOBAL_STATE_DISCRIMINATOR = Buffer.from([163, 46, 74, 168, 216, 123, 133, 98])

function readArg(flag) {
  const idx = process.argv.indexOf(flag)
  if (idx === -1 || idx + 1 >= process.argv.length) return null
  return process.argv[idx + 1]
}

function loadWallet() {
  const walletPath =
    process.env.ANCHOR_WALLET ||
    process.env.ADMIN_KEYPAIR_PATH ||
    path.join(os.homedir(), '.config', 'solana', 'id.json')
  const secretKey = JSON.parse(fs.readFileSync(walletPath, 'utf8'))
  return {
    walletPath,
    keypair: Keypair.fromSecretKey(Uint8Array.from(secretKey)),
  }
}

function loadIdl() {
  const idlPath = path.join(__dirname, '..', 'target', 'idl', 'staking_program.json')
  return JSON.parse(fs.readFileSync(idlPath, 'utf8'))
}

function toBaseUnits(value, decimals) {
  const normalized = String(value).trim()
  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    throw new Error(`Invalid numeric value "${value}"`)
  }

  const [whole, fractional = ''] = normalized.split('.')
  const paddedFractional = `${fractional}${'0'.repeat(decimals)}`.slice(0, decimals)
  return new anchor.BN(`${whole}${paddedFractional}`)
}

function parseGlobalState(accountData) {
  if (accountData.length < 136) return null
  if (!accountData.subarray(0, 8).equals(GLOBAL_STATE_DISCRIMINATOR)) return null

  const data = accountData.subarray(8)
  return {
    admin: new PublicKey(data.subarray(0, 32)),
    mint: new PublicKey(data.subarray(32, 64)),
  }
}

async function main() {
  const amountArg = readArg('--amount') || process.env.REWARD_AMOUNT
  const rewardRateArg = readArg('--rate') || process.env.REWARD_RATE
  const skipMint = process.argv.includes('--skip-mint')

  if (!amountArg) {
    throw new Error('Missing amount. Pass --amount <TOKENS> or set REWARD_AMOUNT.')
  }

  if (!rewardRateArg) {
    throw new Error('Missing rate. Pass --rate <TOKENS_PER_SECOND> or set REWARD_RATE.')
  }

  const providerUrl = process.env.ANCHOR_PROVIDER_URL || 'https://api.devnet.solana.com'
  const { walletPath, keypair } = loadWallet()
  const wallet = new anchor.Wallet(keypair)
  const connection = new Connection(providerUrl, 'confirmed')
  const provider = new anchor.AnchorProvider(connection, wallet, { commitment: 'confirmed' })
  const idl = loadIdl()
  const programId = new PublicKey(idl.address)
  const program = new anchor.Program(idl, provider)

  const [globalState] = PublicKey.findProgramAddressSync([Buffer.from('global_state')], programId)
  const [rewardPool] = PublicKey.findProgramAddressSync([Buffer.from('reward_pool')], programId)
  const [rewardPoolAuthority] = PublicKey.findProgramAddressSync([Buffer.from('reward_pool_authority')], programId)

  const globalStateInfo = await connection.getAccountInfo(globalState)
  if (!globalStateInfo) {
    throw new Error('Pool not initialized. Run initialize-pool.js first.')
  }

  const parsed = parseGlobalState(globalStateInfo.data)
  if (!parsed) {
    throw new Error('Invalid global state account. Ensure the pool was initialized for this program ID.')
  }

  if (!parsed.admin.equals(wallet.publicKey)) {
    throw new Error(`Current wallet ${wallet.publicKey.toBase58()} is not the pool admin ${parsed.admin.toBase58()}.`)
  }

  const mintInfo = await getMint(connection, parsed.mint)
  const amount = toBaseUnits(amountArg, mintInfo.decimals)
  const rewardRate = toBaseUnits(rewardRateArg, mintInfo.decimals)

  const adminTokenAccount = await getOrCreateAssociatedTokenAccount(connection, keypair, parsed.mint, wallet.publicKey)

  if (!skipMint) {
    console.log(`Minting ${amountArg} tokens to admin ATA ${adminTokenAccount.address.toBase58()}`)
    await mintTo(
      connection,
      keypair,
      parsed.mint,
      adminTokenAccount.address,
      wallet.publicKey,
      BigInt(amount.toString()),
    )
  }

  console.log(`Funding rewards on ${providerUrl}`)
  console.log(`Admin wallet: ${wallet.publicKey.toBase58()} (${walletPath})`)
  console.log(`Mint: ${parsed.mint.toBase58()}`)
  console.log(`Amount: ${amountArg}`)
  console.log(`Reward rate: ${rewardRateArg} tokens/sec`)

  const signature = await program.methods
    .addRewards(amount, rewardRate)
    .accounts({
      admin: wallet.publicKey,
      adminTokenAccount: adminTokenAccount.address,
      globalState,
      rewardPoolAuthority,
      rewardPool,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc()

  console.log(`Add rewards signature: ${signature}`)
  console.log(`RewardPool: ${rewardPool.toBase58()}`)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
