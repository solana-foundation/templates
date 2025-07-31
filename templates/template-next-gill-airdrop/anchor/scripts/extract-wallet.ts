#!/usr/bin/env ts-node

import * as fs from 'fs'

interface WalletInfo {
  name: string
  publicKey: string
  keypairFile: string
  secretKey: {
    hex: string
    base58: string
    array: number[]
  }
}

/**
 * Extract a specific wallet file from test-wallets.json
 * @param walletName Name of the wallet to extract (e.g., "test-wallet-1", "deploy-wallet")
 * @param outputPath Optional output path, defaults to the wallet's keypairFile
 */
export function extractWallet(walletName: string, outputPath?: string): boolean {
  try {
    if (!fs.existsSync('test-wallets.json')) {
      console.error('❌ test-wallets.json not found')
      return false
    }

    const testWalletsData = JSON.parse(fs.readFileSync('test-wallets.json', 'utf8'))
    const wallets: WalletInfo[] = testWalletsData.wallets || []

    const wallet = wallets.find((w: WalletInfo) => w.name === walletName)

    if (!wallet) {
      console.error(`❌ Wallet "${walletName}" not found in test-wallets.json`)
      console.log('Available wallets:')
      wallets.forEach((w) => console.log(`  - ${w.name}: ${w.publicKey}`))
      return false
    }

    const outputFile = outputPath || wallet.keypairFile
    fs.writeFileSync(outputFile, JSON.stringify(wallet.secretKey.array))

    console.log(`✅ Extracted ${walletName} to ${outputFile}`)
    console.log(`   Public Key: ${wallet.publicKey}`)

    return true
  } catch (error) {
    console.error('❌ Error extracting wallet:', error)
    return false
  }
}

/**
 * Extract all wallets from test-wallets.json to individual files
 */
export function extractAllWallets(): boolean {
  try {
    if (!fs.existsSync('test-wallets.json')) {
      console.error('❌ test-wallets.json not found')
      return false
    }

    const testWalletsData = JSON.parse(fs.readFileSync('test-wallets.json', 'utf8'))
    const wallets: WalletInfo[] = testWalletsData.wallets || []

    console.log(`🔧 Extracting ${wallets.length} wallets...`)

    let success = true
    for (const wallet of wallets) {
      try {
        fs.writeFileSync(wallet.keypairFile, JSON.stringify(wallet.secretKey.array))
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

/**
 * List all available wallets in test-wallets.json
 */
export function listWallets(): void {
  try {
    if (!fs.existsSync('test-wallets.json')) {
      console.error('❌ test-wallets.json not found')
      return
    }

    const testWalletsData = JSON.parse(fs.readFileSync('test-wallets.json', 'utf8'))
    const wallets: WalletInfo[] = testWalletsData.wallets || []

    console.log(`📋 Available wallets (${wallets.length}):`)
    wallets.forEach((wallet, i) => {
      const status = wallet.name === 'deploy-wallet' ? '🔑 Deploy' : '🧪 Test'
      console.log(`  ${i + 1}. ${status} - ${wallet.name}`)
      console.log(`     Public Key: ${wallet.publicKey}`)
      console.log(`     Keypair File: ${wallet.keypairFile}`)
      console.log('')
    })
  } catch (error) {
    console.error('❌ Error listing wallets:', error)
  }
}

// Command line interface
if (require.main === module) {
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
}
