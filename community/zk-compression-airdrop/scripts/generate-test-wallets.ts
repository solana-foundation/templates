import { Keypair } from '@solana/web3.js'
import { address, type Address } from '@solana/kit'
import bs58 from 'bs58'
import fs from 'fs'
import path from 'path'

interface WalletInfo {
  name: string
  publicKey: string
  address: Address
  privateKey: string
  secretKey: number[]
}

function generateWallet(name: string): WalletInfo {
  const keypair = Keypair.generate()
  return {
    name,
    publicKey: keypair.publicKey.toBase58(),
    address: address(keypair.publicKey.toBase58()),
    privateKey: bs58.encode(keypair.secretKey),
    secretKey: Array.from(keypair.secretKey),
  }
}

async function main() {
  const walletsPath = path.join(__dirname, 'test-wallets.json')
  const count = parseInt(process.env.WALLET_COUNT || '3')

  if (fs.existsSync(walletsPath)) {
    const existingWallets = JSON.parse(fs.readFileSync(walletsPath, 'utf-8'))
    if (existingWallets.length >= count) {
      console.log(`${existingWallets.length} test wallets already exist`)
      console.log('Delete scripts/test-wallets.json to regenerate\n')

      existingWallets.forEach((w: WalletInfo, i: number) => {
        console.log(`${i + 1}. ${w.name}: ${w.address}`)
      })

      return
    }
  }

  console.log(`🔑 Generating ${count} test wallets...\n`)

  const wallets: WalletInfo[] = []

  for (let i = 1; i <= count; i++) {
    const wallet = generateWallet(`test-wallet-${i}`)
    wallets.push(wallet)
    console.log(`${wallet.name}`)
    console.log(`   Public:  ${wallet.publicKey}`)
    console.log(`   Private: ${wallet.privateKey}\n`)
  }

  fs.writeFileSync(walletsPath, JSON.stringify(wallets, null, 2))

  console.log(`Saved ${count} wallets to scripts/test-wallets.json`)
  console.log('\n Each wallet contains:')
  console.log('   • publicKey: Base58 encoded public key')
  console.log('   • privateKey: Base58 encoded private key (import to Phantom/Solflare)')
  console.log('   • secretKey: Byte array for programmatic use')
  console.log('\n  These are test wallets - do not use in production!')
}

main().catch(console.error)
