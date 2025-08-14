#!/usr/bin/env ts-node

import { createGillWalletClient } from '../lib/wallet-manager'
import { address } from 'gill'
import * as fs from 'fs'
import type { TestWalletsData } from '../lib/types'

/**
 * Extract a specific wallet file from test-wallets.json
 * @param walletName Name of the wallet to extract (e.g., "test-wallet-1", "deploy-wallet")
 * @param outputPath Optional output path, defaults to the wallet's keypairFile
 */
export function extractWallet(walletName: string, outputPath?: string): boolean {
  try {
    const { deployWallet, testWallets } = loadWallets()
    const allWallets = deployWallet ? [deployWallet, ...testWallets] : testWallets

    const wallet = allWallets.find((w) => w.name === walletName)
    if (!wallet) {
      console.error(`❌ Wallet '${walletName}' not found`)
      return false
    }

    const output = outputPath || wallet.keypairFile
    const keypairArray = wallet.secretKey.array
    fs.writeFileSync(output, JSON.stringify(keypairArray, null, 2))

    console.log(`✅ Extracted ${walletName} to ${output}`)
    return true
  } catch (error) {
    console.error(`❌ Error extracting wallet '${walletName}':`, error)
    return false
  }
}

function loadWallets(): { deployWallet: any | null; testWallets: any[] } {
  try {
    if (!fs.existsSync('test-wallets.json')) {
      return { deployWallet: null, testWallets: [] }
    }

    const data = fs.readFileSync('test-wallets.json', 'utf8')
    const walletsData: TestWalletsData = JSON.parse(data)

    const deployWallet = walletsData.wallets.find((w) => w.isDeployWallet || w.name === 'deploy-wallet')
    const testWallets = walletsData.wallets.filter((w) => !w.isDeployWallet && w.name !== 'deploy-wallet')

    return { deployWallet: deployWallet || null, testWallets }
  } catch (error) {
    console.error('❌ Error loading wallets:', error)
    return { deployWallet: null, testWallets: [] }
  }
}

export function extractAllWallets(): boolean {
  try {
    const { deployWallet, testWallets } = loadWallets()
    const allWallets = deployWallet ? [deployWallet, ...testWallets] : testWallets

    if (allWallets.length === 0) {
      console.error('❌ No wallets found in test-wallets.json')
      return false
    }

    console.log(`🔧 Extracting ${allWallets.length} wallets...`)

    let success = true
    for (const wallet of allWallets) {
      try {
        const keypairArray = wallet.secretKey.array
        fs.writeFileSync(wallet.keypairFile, JSON.stringify(keypairArray, null, 2))
        console.log(`✅ ${wallet.name} → ${wallet.keypairFile}`)
      } catch (error) {
        console.error(`❌ Failed to extract ${wallet.name}:`, error)
        success = false
      }
    }

    return success
  } catch (error) {
    console.error('❌ Error extracting wallets:', error)
    return false
  }
}

export function listWallets(): void {
  try {
    const { deployWallet, testWallets } = loadWallets()
    const allWallets = deployWallet ? [deployWallet, ...testWallets] : testWallets

    if (allWallets.length === 0) {
      console.error('❌ No wallets found in test-wallets.json')
      return
    }

    console.log(`📋 Available wallets (${allWallets.length}):`)
    allWallets.forEach((wallet, i) => {
      const status = wallet.isDeployWallet || wallet.name === 'deploy-wallet' ? '🔑 Deploy' : '🧪 Test'
      console.log(`  ${i + 1}. ${status} - ${wallet.name}`)
      console.log(`     Public Key: ${wallet.address}`)
      console.log(`     Keypair File: ${wallet.keypairFile}`)
      console.log(`     Balance: ${wallet.balance || 'Unknown'}`)
      console.log('')
    })
  } catch (error) {
    console.error('❌ Error listing wallets:', error)
  }
}

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log('🔧 Wallet Extraction Utility\n')
    console.log('Usage:')
    console.log('  extract-wallet <wallet-name>           # Extract specific wallet')
    console.log('  extract-wallet --all                   # Extract all wallets')
    console.log('  extract-wallet --list                  # List available wallets')
    console.log('')
    console.log('Examples:')
    console.log('  extract-wallet test-wallet-1')
    console.log('  extract-wallet deploy-wallet')
    console.log('  extract-wallet --all')
    process.exit(0)
  }

  const command = args[0]

  try {
    if (command === '--list') {
      listWallets()
    } else if (command === '--all') {
      const success = extractAllWallets()
      process.exit(success ? 0 : 1)
    } else {
      const walletName = command
      const outputPath = args[1] // Optional
      const success = extractWallet(walletName, outputPath)
      process.exit(success ? 0 : 1)
    }
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

export async function listGillWallets(): Promise<void> {
  try {
    const { deployWallet, testWallets } = loadWallets()

    const allWallets = deployWallet ? [deployWallet, ...testWallets] : testWallets

    if (allWallets.length === 0) {
      console.error('❌ No wallets found in test-wallets.json')
      return
    }

    console.log(`📋 Available wallets (${allWallets.length}) - Gill version:`)

    const client = createGillWalletClient({ network: 'devnet' })

    for (let i = 0; i < allWallets.length; i++) {
      const wallet = allWallets[i]
      const status = wallet.isDeployWallet || wallet.name === 'deploy-wallet' ? '🔑 Deploy' : '🧪 Test'
      console.log(`  ${i + 1}. ${status} - ${wallet.name}`)
      console.log(`     Public Key: ${wallet.address}`)
      console.log(`     Keypair File: ${wallet.keypairFile}`)

      try {
        // Check balance using Gill
        const balance = await client.rpc.getBalance(address(wallet.address)).send()
        const balanceSol = Number(balance.value) / 1e9
        console.log(`     Balance: ${balanceSol.toFixed(4)} SOL (via Gill)`)
      } catch {
        console.log(`     Balance: Unable to fetch (via Gill)`)
      }

      console.log('')
    }
  } catch (error) {
    console.error('❌ Error listing wallets with Gill:', error)
  }
}

if (require.main === module) {
  if (process.argv.includes('--list')) {
    // Use Gill version for listing
    listGillWallets()
  } else {
    main()
  }
}
