const fs = require('fs')
const os = require('os')
const path = require('path')
const anchor = require('@coral-xyz/anchor')
const { Connection, Keypair, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } = require('@solana/web3.js')
const { TOKEN_PROGRAM_ID } = require('@solana/spl-token')

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

async function main() {
  const mintArg = readArg('--mint') || process.env.STAKING_MINT
  if (!mintArg) {
    throw new Error('Missing mint address. Pass --mint <TOKEN_MINT_ADDRESS> or set STAKING_MINT.')
  }

  const mint = new PublicKey(mintArg)
  const providerUrl = process.env.ANCHOR_PROVIDER_URL || 'http://127.0.0.1:8899'
  const { walletPath, keypair } = loadWallet()
  const wallet = new anchor.Wallet(keypair)
  const connection = new Connection(providerUrl, 'confirmed')
  const provider = new anchor.AnchorProvider(connection, wallet, { commitment: 'confirmed' })
  const idl = loadIdl()
  const programId = new PublicKey(idl.address)
  const program = new anchor.Program(idl, provider)

  const [globalState] = PublicKey.findProgramAddressSync([Buffer.from('global_state')], programId)
  const [vault] = PublicKey.findProgramAddressSync([Buffer.from('staking_vault')], programId)
  const [rewardPool] = PublicKey.findProgramAddressSync([Buffer.from('reward_pool')], programId)
  const [vaultAuthority] = PublicKey.findProgramAddressSync([Buffer.from('vault_authority')], programId)
  const [rewardPoolAuthority] = PublicKey.findProgramAddressSync([Buffer.from('reward_pool_authority')], programId)

  const mintInfo = await connection.getAccountInfo(mint)
  if (!mintInfo || !mintInfo.owner.equals(TOKEN_PROGRAM_ID)) {
    throw new Error(`Mint ${mint.toBase58()} does not exist or is not an SPL token mint.`)
  }

  const globalStateInfo = await connection.getAccountInfo(globalState)
  if (globalStateInfo) {
    const isInitialized =
      globalStateInfo.owner.equals(programId) &&
      globalStateInfo.data.length >= 8 &&
      globalStateInfo.data.subarray(0, 8).equals(GLOBAL_STATE_DISCRIMINATOR)

    if (isInitialized) {
      console.log('Pool already initialized.')
      console.log(`Program ID: ${programId.toBase58()}`)
      console.log(`Cluster RPC: ${providerUrl}`)
      console.log(`Admin: ${wallet.publicKey.toBase58()}`)
      console.log(`Mint: ${mint.toBase58()}`)
      console.log(`GlobalState: ${globalState.toBase58()}`)
      console.log(`Vault: ${vault.toBase58()}`)
      console.log(`RewardPool: ${rewardPool.toBase58()}`)
      return
    }

    throw new Error(
      `Global state PDA ${globalState.toBase58()} already exists but is not a valid initialized pool for ${programId.toBase58()}.`,
    )
  }

  console.log(`Initializing pool on ${providerUrl}`)
  console.log(`Admin wallet: ${wallet.publicKey.toBase58()} (${walletPath})`)
  console.log(`Mint: ${mint.toBase58()}`)

  const signature = await program.methods
    .initialize()
    .accounts({
      admin: wallet.publicKey,
      vaultAuthority,
      rewardPoolAuthority,
      mint,
      globalState,
      vault,
      rewardPool,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .rpc()

  console.log(`Initialize signature: ${signature}`)
  console.log(`GlobalState: ${globalState.toBase58()}`)
  console.log(`Vault: ${vault.toBase58()}`)
  console.log(`RewardPool: ${rewardPool.toBase58()}`)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
