import { address, type Address } from '@solana/kit'
import fs from 'fs'
import path from 'path'

interface Recipient {
  address: Address
  amount: number
}

function loadRecipientsFromTestWallets(): Recipient[] {
  const walletsPath = path.join(__dirname, 'test-wallets.json')

  if (!fs.existsSync(walletsPath)) {
    console.log('\nNo test wallets found. Run: npx tsx scripts/generate-test-wallets.ts\n')
    process.exit(1)
  }

  const wallets: Array<{ name: string; address: string }> = JSON.parse(fs.readFileSync(walletsPath, 'utf-8'))

  return wallets.map((w, i) => ({
    address: address(w.address),
    amount: 100 * (i + 1),
  }))
}

const RECIPIENTS: Recipient[] = loadRecipientsFromTestWallets()

async function main() {
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'compressed-mint-config.json'), 'utf-8'))

  console.log('Generating airdrop recipients list...')
  console.log('Mint:', config.mintAddress)
  console.log('Recipients:', RECIPIENTS.length)

  const recipientData = RECIPIENTS.map((r, index) => {
    const amountLamports = BigInt(r.amount) * BigInt(10 ** config.decimals)

    return {
      recipient: r.address,
      amount: amountLamports.toString(),
      index,
    }
  })

  const totalAmount = recipientData.reduce((sum, r) => sum + BigInt(r.amount), BigInt(0))

  const airdropData = {
    mint: config.mintAddress,
    decimals: config.decimals,
    totalRecipients: RECIPIENTS.length,
    totalAmount: totalAmount.toString(),
    recipients: recipientData,
    generatedAt: new Date().toISOString(),
  }

  fs.writeFileSync(path.join(__dirname, 'airdrop-recipients.json'), JSON.stringify(airdropData, null, 2))

  console.log('\nRecipients list generated!')
  console.log('Total amount:', (Number(totalAmount) / 10 ** config.decimals).toLocaleString())
  console.log('Saved to scripts/airdrop-recipients.json')
}

main().catch(console.error)
