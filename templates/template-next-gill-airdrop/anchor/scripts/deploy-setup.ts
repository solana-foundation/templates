#!/usr/bin/env ts-node

import * as fs from 'fs'
import * as path from 'path'
import { Keypair, Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import bs58 from 'bs58'
import { execSync } from 'child_process'
import * as readline from 'readline'
import { keccak_256 } from 'js-sha3'

interface WalletInfo {
  name: string
  publicKey: string
  keypairFile: string
  privateKey: {
    hex: string
    base58: string
    array: number[]
  }
  secretKey: {
    hex: string
    base58: string
    array: number[]
  }
  balance?: string
  funded?: boolean
  seedPhrase?: string
  isDeployWallet?: boolean
}

interface Recipient {
  recipient: PublicKey
  amount: number
}

class SimpleMerkleTree {
  public root: Uint8Array
  private leaves: Uint8Array[]
  private tree: Uint8Array[][]

  constructor(recipients: Recipient[]) {
    // Create leaves
    this.leaves = recipients.map((r) => this.createLeaf(r.recipient, r.amount))

    // Build tree
    this.tree = [this.leaves]
    let currentLevel = this.leaves

    while (currentLevel.length > 1) {
      const nextLevel: Uint8Array[] = []

      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i]
        const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left
        const parent = this.hashPair(left, right)
        nextLevel.push(parent)
      }

      this.tree.push(nextLevel)
      currentLevel = nextLevel
    }

    this.root = currentLevel[0]
  }

  private createLeaf(recipient: PublicKey, amount: number): Uint8Array {
    const data = Buffer.concat([
      recipient.toBuffer(),
      Buffer.from(new Uint8Array(new BigUint64Array([BigInt(amount)]).buffer)),
      Buffer.from([0]), // isClaimed = false
    ])
    return new Uint8Array(keccak_256.arrayBuffer(data))
  }

  private hashPair(left: Uint8Array, right: Uint8Array): Uint8Array {
    const data = Buffer.concat([Buffer.from(left), Buffer.from(right)])
    return new Uint8Array(keccak_256.arrayBuffer(data))
  }

  public getProof(leafIndex: number): Uint8Array[] {
    const proof: Uint8Array[] = []
    let index = leafIndex

    for (let level = 0; level < this.tree.length - 1; level++) {
      const currentLevel = this.tree[level]
      const siblingIndex = index % 2 === 0 ? index + 1 : index - 1

      if (siblingIndex < currentLevel.length) {
        proof.push(currentLevel[siblingIndex])
      }

      index = Math.floor(index / 2)
    }

    return proof
  }

  public getRootHex(): string {
    return '0x' + Buffer.from(this.root).toString('hex')
  }

  public getLeafCount(): number {
    return this.leaves.length
  }
}

interface TestWalletsData {
  network: string
  description: string
  createdAt: string
  wallets: WalletInfo[]
  usage: {
    description: string
    loadWallet: string
    checkBalance: string
    fundWallet: string
    transferFunds: string
    privateKeyFormats: {
      hex: string
      base58: string
      array: string
    }
    security: {
      warning: string
      note: string
    }
  }
}

class SolanaDeploymentSetup {
  private connection: Connection
  private rl: readline.Interface
  private wallets: WalletInfo[] = []

  constructor() {
    this.connection = new Connection('https://api.devnet.solana.com', 'confirmed')
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
  }

  private question(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve)
    })
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private generateWallet(name: string): WalletInfo {
    const keypair = Keypair.generate()
    const secretKey = keypair.secretKey
    const privateKey = secretKey.slice(0, 32)

    return {
      name,
      publicKey: keypair.publicKey.toString(),
      keypairFile: `${name}.json`,
      privateKey: {
        hex: Buffer.from(privateKey).toString('hex'),
        base58: bs58.encode(privateKey),
        array: Array.from(privateKey),
      },
      secretKey: {
        hex: Buffer.from(secretKey).toString('hex'),
        base58: bs58.encode(secretKey),
        array: Array.from(secretKey),
      },
      balance: '0 SOL',
      funded: false,
    }
  }

  private saveWalletFile(wallet: WalletInfo): void {
    // Only save deploy wallet file (others are stored in test-wallets.json)
    if (wallet.isDeployWallet) {
      const walletPath = `anchor/${wallet.keypairFile}`
      fs.writeFileSync(walletPath, JSON.stringify(wallet.secretKey.array))
      console.log(`💾 Saved wallet file: ${walletPath}`)
    }
  }

  private async checkBalance(publicKey: string): Promise<number> {
    try {
      const balance = await this.connection.getBalance(new PublicKey(publicKey))
      return balance / LAMPORTS_PER_SOL
    } catch (error) {
      console.error(`❌ Error checking balance for ${publicKey}:`, error)
      return 0
    }
  }

  private async requestAirdrop(publicKey: string, amount: number = 2): Promise<boolean> {
    try {
      console.log(`💧 Requesting ${amount} SOL airdrop for ${publicKey}...`)
      const signature = await this.connection.requestAirdrop(new PublicKey(publicKey), amount * LAMPORTS_PER_SOL)

      // Wait for confirmation
      await this.connection.confirmTransaction(signature)
      console.log(`✅ Airdrop successful! Signature: ${signature}`)

      // Wait a bit for balance to update
      await this.delay(2000)

      return true
    } catch (error) {
      console.error(`❌ Airdrop failed for ${publicKey}:`, error)
      return false
    }
  }

  private loadExistingWallets(): { deployWallet: WalletInfo | null; testWallets: WalletInfo[] } {
    try {
      const testWalletsPath = 'anchor/test-wallets.json'
      if (!fs.existsSync(testWalletsPath)) {
        return { deployWallet: null, testWallets: [] }
      }

      const testWalletsData = JSON.parse(fs.readFileSync(testWalletsPath, 'utf8'))
      const wallets = testWalletsData.wallets || []

      const deployWallet = wallets.find((w: WalletInfo) => w.isDeployWallet || w.name === 'deploy-wallet')
      const testWallets = wallets.filter((w: WalletInfo) => !w.isDeployWallet && w.name !== 'deploy-wallet')

      return { deployWallet, testWallets }
    } catch (error) {
      console.error('⚠️  Error loading existing wallets:', error)
      return { deployWallet: null, testWallets: [] }
    }
  }

  private createDeployWalletFile(wallet: WalletInfo): void {
    // Only create individual file for deploy wallet (needed by Anchor)
    const walletPath = `anchor/${wallet.keypairFile}`
    if (wallet.isDeployWallet && !fs.existsSync(walletPath)) {
      fs.writeFileSync(walletPath, JSON.stringify(wallet.secretKey.array))
      console.log(`💾 Created deploy wallet file: ${walletPath}`)
    }
  }

  private async setupDeployWallet(): Promise<WalletInfo> {
    console.log('\n🚀 Setting up deployment wallet...\n')

    // Check for existing wallets first
    const { deployWallet: existingDeployWallet } = this.loadExistingWallets()

    if (existingDeployWallet) {
      const useExisting = await this.question(
        `Found existing deploy wallet: ${existingDeployWallet.publicKey}\n` +
          'Do you want to use this existing wallet? (y/n): ',
      )

      if (useExisting.toLowerCase() === 'y' || useExisting.toLowerCase() === 'yes') {
        console.log(`✅ Using existing deployment wallet: ${existingDeployWallet.publicKey}`)

        // Create deploy wallet file if it doesn't exist (needed by Anchor)
        this.createDeployWalletFile(existingDeployWallet)

        // Check balance
        const balance = await this.checkBalance(existingDeployWallet.publicKey)
        existingDeployWallet.balance = `${balance} SOL`

        console.log(`💰 Current balance: ${balance} SOL`)

        if (balance < 1) {
          console.log('💧 Requesting devnet SOL...')
          const airdropSuccess = await this.requestAirdrop(existingDeployWallet.publicKey, 2)
          if (airdropSuccess) {
            const newBalance = await this.checkBalance(existingDeployWallet.publicKey)
            existingDeployWallet.balance = `${newBalance} SOL`
            existingDeployWallet.funded = true
            console.log(`✅ Wallet funded! New balance: ${newBalance} SOL`)
          } else {
            console.log('⚠️  Automatic airdrop failed. Please fund your wallet manually:')
            console.log(`solana airdrop 2 ${existingDeployWallet.publicKey} --url devnet`)
          }
        } else {
          existingDeployWallet.funded = true
        }

        return existingDeployWallet
      }
    }

    const choice = await this.question(
      'Do you want to:\n' +
        '1. Use an existing wallet (provide private key)\n' +
        '2. Create a new wallet\n' +
        'Enter choice (1 or 2): ',
    )

    let deployWallet: WalletInfo

    if (choice === '1') {
      const privateKeyInput = await this.question('Enter your private key (base58 or hex): ')

      try {
        let secretKeyArray: number[]

        if (privateKeyInput.length === 128) {
          // Hex format (64 bytes)
          const secretKeyBuffer = Buffer.from(privateKeyInput, 'hex')
          secretKeyArray = Array.from(secretKeyBuffer)
        } else if (privateKeyInput.length === 88) {
          // Base58 format (64 bytes)
          const secretKeyBuffer = bs58.decode(privateKeyInput)
          secretKeyArray = Array.from(secretKeyBuffer)
        } else {
          throw new Error('Invalid private key format')
        }

        const keypair = Keypair.fromSecretKey(new Uint8Array(secretKeyArray))
        const privateKey = secretKeyArray.slice(0, 32)

        deployWallet = {
          name: 'deploy-wallet',
          publicKey: keypair.publicKey.toString(),
          keypairFile: 'deploy-wallet.json',
          privateKey: {
            hex: Buffer.from(privateKey).toString('hex'),
            base58: bs58.encode(new Uint8Array(privateKey)),
            array: privateKey,
          },
          secretKey: {
            hex: privateKeyInput.length === 128 ? privateKeyInput : Buffer.from(secretKeyArray).toString('hex'),
            base58: privateKeyInput.length === 88 ? privateKeyInput : bs58.encode(new Uint8Array(secretKeyArray)),
            array: secretKeyArray,
          },
          isDeployWallet: true,
        }

        console.log(`✅ Using existing wallet: ${deployWallet.publicKey}`)
      } catch {
        console.error('❌ Invalid private key format. Please try again.')
        process.exit(1)
      }
    } else {
      deployWallet = this.generateWallet('deploy-wallet')
      deployWallet.isDeployWallet = true
      console.log(`✅ Generated new deployment wallet: ${deployWallet.publicKey}`)
    }

    // Save deploy wallet file (needed by Anchor)
    this.createDeployWalletFile(deployWallet)

    // Check balance
    const balance = await this.checkBalance(deployWallet.publicKey)
    deployWallet.balance = `${balance} SOL`

    console.log(`💰 Current balance: ${balance} SOL`)

    if (balance < 1) {
      console.log('💧 Requesting devnet SOL...')
      const airdropSuccess = await this.requestAirdrop(deployWallet.publicKey, 2)
      if (airdropSuccess) {
        const newBalance = await this.checkBalance(deployWallet.publicKey)
        deployWallet.balance = `${newBalance} SOL`
        deployWallet.funded = true
        console.log(`✅ Wallet funded! New balance: ${newBalance} SOL`)
      } else {
        console.log('⚠️  Automatic airdrop failed. Please fund your wallet manually:')
        console.log(`solana airdrop 2 ${deployWallet.publicKey} --url devnet`)
      }
    } else {
      deployWallet.funded = true
    }

    return deployWallet
  }

  private async setupTestWallets(): Promise<WalletInfo[]> {
    console.log('\n🧪 Setting up test wallets...\n')

    // Check for existing test wallets first
    const { testWallets: existingTestWallets } = this.loadExistingWallets()

    if (existingTestWallets.length > 0) {
      console.log(`Found ${existingTestWallets.length} existing test wallets:`)
      existingTestWallets.forEach((wallet, i) => {
        console.log(`  ${i + 1}. ${wallet.name}: ${wallet.publicKey} (${wallet.funded ? 'Funded' : 'Unfunded'})`)
      })

      const useExisting = await this.question('\nDo you want to use these existing test wallets? (y/n): ')

      if (useExisting.toLowerCase() === 'y' || useExisting.toLowerCase() === 'yes') {
        console.log('✅ Using existing test wallets (no individual files needed - all data in test-wallets.json)')

        // Check balances for existing wallets
        for (const wallet of existingTestWallets) {
          const balance = await this.checkBalance(wallet.publicKey)
          wallet.balance = `${balance} SOL`
          console.log(`💰 ${wallet.name}: ${balance} SOL`)

          if (balance > 0) {
            wallet.funded = true
          } else {
            wallet.funded = false
            console.log(`⚠️  ${wallet.name} has no funds. You can fund it manually if needed.`)
          }
        }

        return existingTestWallets
      }
    }

    const numWallets = await this.question('How many test wallets do you want to create? (default: 3): ')
    const walletCount = parseInt(numWallets) || 3

    const testWallets: WalletInfo[] = []

    for (let i = 1; i <= walletCount; i++) {
      console.log(`\n📱 Creating test wallet ${i}...`)

      const wallet = this.generateWallet(`test-wallet-${i}`)

      console.log(`✅ Created: ${wallet.publicKey}`)

      // Try to fund the wallet
      const fundSuccess = await this.requestAirdrop(wallet.publicKey, 1)
      if (fundSuccess) {
        const balance = await this.checkBalance(wallet.publicKey)
        wallet.balance = `${balance} SOL`
        wallet.funded = true
        console.log(`💰 Funded with ${balance} SOL`)
      } else {
        wallet.balance = '0 SOL'
        wallet.funded = false
        console.log(`⚠️  Failed to fund wallet ${i} (rate limiting)`)
      }

      testWallets.push(wallet)

      // Add delay between airdrops to avoid rate limiting
      if (i < walletCount) {
        console.log('⏳ Waiting 3 seconds before next wallet...')
        await this.delay(3000)
      }
    }

    return testWallets
  }

  private saveTestWalletsJson(allWallets: WalletInfo[]): void {
    const testWalletsData: TestWalletsData = {
      network: 'devnet',
      description: 'Test wallets for Solana distributor development',
      createdAt: new Date().toISOString(),
      wallets: allWallets,
      usage: {
        description: 'These test wallets can be used for development and testing',
        loadWallet: 'solana config set --keypair <keypairFile>',
        checkBalance: 'solana balance <publicKey>',
        fundWallet: 'solana airdrop <amount> <publicKey>',
        transferFunds: 'solana transfer <recipient> <amount> --keypair <keypairFile>',
        privateKeyFormats: {
          hex: '32-byte hexadecimal string (lowercase)',
          base58: 'Base58 encoded string (most common format for Solana)',
          array: 'Array of 32 integers (0-255)',
        },
        security: {
          warning: '⚠️ NEVER share private keys publicly or commit them to public repositories!',
          note: 'These are test wallets for devnet only. Do not use for mainnet or real funds.',
        },
      },
    }

    const testWalletsPath = 'anchor/test-wallets.json'
    fs.writeFileSync(testWalletsPath, JSON.stringify(testWalletsData, null, 2))
    console.log('💾 Saved anchor/test-wallets.json')
  }

  private updateAnchorConfig(deployWallet: WalletInfo): void {
    // Get the current program ID dynamically instead of hardcoding it
    const currentProgramId = this.getCurrentProgramId()

    const anchorToml = `[toolchain]
anchor_version = "0.31.1"
package_manager = "pnpm"

[features]
resolution = true
skip-lint = false

[programs.devnet]
solana_distributor = "${currentProgramId}"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "devnet"
wallet = "${deployWallet.keypairFile}"

[scripts]
test = "pnpm run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
`

    const anchorTomlPath = 'anchor/Anchor.toml'
    fs.writeFileSync(anchorTomlPath, anchorToml)
    console.log(`✅ Updated anchor/Anchor.toml to use ${deployWallet.keypairFile}`)
  }

  private generateRecipientsJson(testWallets: WalletInfo[]): void {
    const recipients = testWallets.map((wallet, index) => ({
      publicKey: wallet.publicKey,
      amount: '75000000', // 0.075 SOL
      index,
      description: `${wallet.name} - ${wallet.funded ? 'Funded' : 'Unfunded'}`,
    }))

    const totalAmount = (recipients.length * 75000000).toString()

    // Check if recipients.json already exists with the same wallets
    const recipientsPath = 'anchor/recipients.json'
    let shouldUpdate = true
    if (fs.existsSync(recipientsPath)) {
      try {
        const existingData = JSON.parse(fs.readFileSync(recipientsPath, 'utf8'))
        const existingPublicKeys = existingData.recipients?.map((r: { publicKey: string }) => r.publicKey) || []
        const newPublicKeys = recipients.map((r) => r.publicKey)

        // If the wallets are the same, just update descriptions and keep existing merkle root
        if (JSON.stringify(existingPublicKeys.sort()) === JSON.stringify(newPublicKeys.sort())) {
          console.log('📋 Recipients unchanged, updating descriptions only')
          existingData.recipients = recipients
          existingData.description = 'Deployment setup airdrop for testing purposes'
          fs.writeFileSync(recipientsPath, JSON.stringify(existingData, null, 2))
          shouldUpdate = false
        }
      } catch {
        // If there's an error reading existing file, proceed with generating new one
      }
    }

    if (shouldUpdate) {
      const recipientsData = {
        airdropId: 'solana-distributor-airdrop-' + new Date().getFullYear(),
        description: 'Deployment setup airdrop for testing purposes',
        merkleRoot: '0x0000000000000000000000000000000000000000000000000000000000000000', // Will be updated after tree generation
        totalAmount,
        network: 'devnet',
        programId: this.getCurrentProgramId(),
        recipients,
        metadata: {
          createdAt: new Date().toISOString(),
          version: '1.0.0',
          algorithm: 'keccak256',
          leafFormat: 'recipient_pubkey(32) + amount(8) + is_claimed(1)',
        },
      }

      fs.writeFileSync(recipientsPath, JSON.stringify(recipientsData, null, 2))
      console.log('📋 Generated anchor/recipients.json')
    }
  }

  private generateMerkleTree(): { merkleRoot: string; merkleTree: SimpleMerkleTree } {
    try {
      console.log('🌳 Generating Merkle tree...')

      // Load recipients data
      const recipientsPath = 'anchor/recipients.json'
      const recipientsData = JSON.parse(fs.readFileSync(recipientsPath, 'utf8'))

      // Convert to format expected by merkle tree
      const recipients: Recipient[] = recipientsData.recipients.map((r: { publicKey: string; amount: string }) => ({
        recipient: new PublicKey(r.publicKey),
        amount: parseInt(r.amount),
      }))

      // Generate merkle tree
      const merkleTree = new SimpleMerkleTree(recipients)
      const merkleRootHex = merkleTree.getRootHex()

      console.log(`✅ Merkle tree generated!`)
      console.log(`   Leaves: ${merkleTree.getLeafCount()}`)
      console.log(`   Root: ${merkleRootHex}`)

      // Update recipients.json with the computed root
      recipientsData.merkleRoot = merkleRootHex
      recipientsData.metadata.algorithm = 'keccak256'
      recipientsData.metadata.leafFormat = 'recipient_pubkey(32) + amount(8) + is_claimed(1)'

      // Write back to file
      fs.writeFileSync(recipientsPath, JSON.stringify(recipientsData, null, 2))
      console.log(`✅ Updated anchor/recipients.json with merkle root`)

      return {
        merkleRoot: merkleRootHex,
        merkleTree,
      }
    } catch (error) {
      console.error('❌ Error generating merkle tree:', error)
      throw error
    }
  }

  private generateNewProgramId(): { programId: string; keypairPath: string } {
    try {
      console.log('🆔 Generating new program ID...')

      // Generate new program keypair
      const keypairPath = 'new-program-keypair.json'

      // Remove existing keypair if it exists
      if (fs.existsSync(keypairPath)) {
        fs.unlinkSync(keypairPath)
      }

      execSync(`solana-keygen new --outfile ${keypairPath} --no-bip39-passphrase --force`, { stdio: 'pipe' })

      // Get the program ID
      const programId = execSync(`solana address -k ${keypairPath}`, { encoding: 'utf8' }).trim()

      console.log(`✅ Generated new program ID: ${programId}`)
      return { programId, keypairPath }
    } catch (error) {
      console.error('❌ Error generating program ID:', error)
      throw error
    }
  }

  private getCurrentProgramId(): string {
    try {
      // Try to read from Anchor.toml first
      const anchorContent = fs.readFileSync('anchor/Anchor.toml', 'utf8')
      const match = anchorContent.match(/solana_distributor = "([^"]+)"/)
      if (match) {
        return match[1]
      }

      // Fallback to reading from lib.rs
      const libContent = fs.readFileSync('anchor/programs/solana-distributor/src/lib.rs', 'utf8')
      const libMatch = libContent.match(/declare_id!\("([^"]+)"\);/)
      if (libMatch) {
        return libMatch[1]
      }

      throw new Error('Could not find program ID in configuration files')
    } catch (error) {
      console.error('❌ Error getting current program ID:', error)
      return '2SJSD8SwrGJRqkDUfcbmkuibEMygjiVm68fLyonUvXma' // fallback
    }
  }

  private updateProgramReferences(newProgramId: string): void {
    try {
      console.log('📝 Updating program references...')

      // Update lib.rs
      const libPath = 'anchor/programs/solana-distributor/src/lib.rs'
      let libContent = fs.readFileSync(libPath, 'utf8')
      libContent = libContent.replace(/declare_id!\(".*"\);/, `declare_id!("${newProgramId}");`)
      fs.writeFileSync(libPath, libContent)
      console.log('   ✅ Updated anchor/programs/solana-distributor/src/lib.rs')

      // Update Anchor.toml
      const anchorTomlPath = 'anchor/Anchor.toml'
      let anchorContent = fs.readFileSync(anchorTomlPath, 'utf8')
      anchorContent = anchorContent.replace(/solana_distributor = ".*"/, `solana_distributor = "${newProgramId}"`)
      fs.writeFileSync(anchorTomlPath, anchorContent)
      console.log('   ✅ Updated anchor/Anchor.toml')

      // Update recipients.json if it exists
      const recipientsPath = 'anchor/recipients.json'
      if (fs.existsSync(recipientsPath)) {
        const recipientsData = JSON.parse(fs.readFileSync(recipientsPath, 'utf8'))
        recipientsData.programId = newProgramId
        fs.writeFileSync(recipientsPath, JSON.stringify(recipientsData, null, 2))
        console.log('   ✅ Updated anchor/recipients.json')

        // Also update the frontend TypeScript file
        console.log('   📝 Updating frontend recipients.ts...')
        this.updateRecipientsTypeScript()
      }

      console.log('✅ All program references updated!')
    } catch (error) {
      console.error('❌ Error updating program references:', error)
      throw error
    }
  }

  private updateRecipientsTypeScript(): void {
    try {
      console.log('📝 Updating src/lib/recipients.ts...')

      // Read the generated recipients.json
      const recipientsPath = 'anchor/recipients.json'
      if (!fs.existsSync(recipientsPath)) {
        console.log('⚠️  anchor/recipients.json not found, skipping TypeScript update')
        return
      }

      const recipientsData = JSON.parse(fs.readFileSync(recipientsPath, 'utf8'))

      // Generate the TypeScript file content
      const tsContent = `/**
 * Recipients Data
 * 
 * ✅ GENERATED: This file was automatically generated by the deploy-setup script.
 * 
 * This file contains REAL data from your deployment:
 * - Real program ID: ${recipientsData.programId}
 * - Actual test wallet addresses (${recipientsData.recipients.length} recipients)
 * - Computed merkle root: ${recipientsData.merkleRoot}
 * - Generated at: ${recipientsData.metadata.createdAt}
 * 
 * Do not edit this file manually - it will be overwritten when you run deploy-setup again.
 */

interface RecipientFromJson {
  publicKey: string
  amount: string
  index: number
  description: string
}

interface RecipientsFile {
  airdropId: string
  description: string
  merkleRoot: string
  totalAmount: string
  network: string
  programId: string
  recipients: RecipientFromJson[]
  metadata: {
    createdAt: string
    version: string
    algorithm: string
    leafFormat: string
  }
}

export const RECIPIENTS_DATA: RecipientsFile = ${JSON.stringify(recipientsData, null, 2)}

export type { RecipientFromJson, RecipientsFile } `

      // Write to the TypeScript file
      const recipientsTsPath = 'src/lib/recipients.ts'
      if (!fs.existsSync(path.dirname(recipientsTsPath))) {
        fs.mkdirSync(path.dirname(recipientsTsPath), { recursive: true })
      }

      fs.writeFileSync(recipientsTsPath, tsContent)
      console.log('   ✅ Updated src/lib/recipients.ts with generated data')
    } catch (error) {
      console.error('❌ Error updating recipients TypeScript file:', error)
      console.log('⚠️  You may need to manually update src/lib/recipients.ts')
    }
  }

  private updateEnvironmentFile(programId: string): void {
    try {
      console.log('📝 Updating environment file with program ID...')

      // Check for .env.local first (takes precedence in Next.js)
      let envFile = '../.env.local'
      if (!fs.existsSync(envFile)) {
        // Check for .env
        envFile = '../.env'
        if (!fs.existsSync(envFile)) {
          // Create .env.local if neither exists
          envFile = '../.env.local'
        }
      }

      let envContent = ''
      const envVar = `NEXT_PUBLIC_PROGRAM_ID=${programId}`

      if (fs.existsSync(envFile)) {
        envContent = fs.readFileSync(envFile, 'utf8')

        // Check if NEXT_PUBLIC_PROGRAM_ID already exists
        if (envContent.includes('NEXT_PUBLIC_PROGRAM_ID=')) {
          // Update existing
          envContent = envContent.replace(/NEXT_PUBLIC_PROGRAM_ID=.*/, envVar)
          console.log(`   ✅ Updated existing ${path.basename(envFile)}`)
        } else {
          // Add new line
          envContent = envContent.trim() + `\n${envVar}\n`
          console.log(`   ✅ Added NEXT_PUBLIC_PROGRAM_ID to ${path.basename(envFile)}`)
        }
      } else {
        // Create new file
        envContent = `# Solana Airdrop Configuration\n# Generated by deploy-setup script\n${envVar}\n`
        console.log(`   ✅ Created new ${path.basename(envFile)} with program ID`)
      }

      fs.writeFileSync(envFile, envContent)
      console.log(`   📍 Program ID: ${programId}`)
    } catch (error) {
      console.error('❌ Error updating environment file:', error)
      console.log('⚠️  You may need to manually add NEXT_PUBLIC_PROGRAM_ID to your .env.local file')
    }
  }

  private getDeployedProgramId(): string {
    try {
      // Get the program ID from the deployed program binary
      const output = execSync('solana address -k anchor/target/deploy/solana_distributor-keypair.json', {
        encoding: 'utf8',
      })
      return output.trim()
    } catch (error) {
      console.error('⚠️  Could not get deployed program ID:', error)
      return ''
    }
  }

  private getDeclaredProgramId(): string {
    try {
      // Get the program ID declared in the Rust source code
      const libContent = fs.readFileSync('anchor/programs/solana-distributor/src/lib.rs', 'utf8')
      const match = libContent.match(/declare_id!\("([^"]+)"\);/)
      if (match) {
        return match[1]
      }
      throw new Error('Could not find declare_id! in lib.rs')
    } catch (error) {
      console.error('⚠️  Could not get declared program ID:', error)
      return ''
    }
  }

  private async verifyAndFixProgramId(): Promise<void> {
    try {
      console.log('🔍 Verifying program ID consistency...')

      const deployedId = this.getDeployedProgramId()
      const declaredId = this.getDeclaredProgramId()

      if (!deployedId || !declaredId) {
        console.log('⚠️  Could not verify program IDs - skipping verification')
        return
      }

      console.log(`📍 Deployed program ID:  ${deployedId}`)
      console.log(`📋 Declared program ID:  ${declaredId}`)

      if (deployedId !== declaredId) {
        console.log('⚠️  Program ID mismatch detected!')
        console.log('🔧 Updating all program references to match deployed program...')

        // Update all program references
        this.updateProgramReferences(deployedId)

        // Clean and rebuild with the correct program ID to ensure it's compiled into the binary
        console.log('🧹 Cleaning previous builds...')
        execSync('anchor clean', { stdio: 'inherit', cwd: 'anchor' })

        console.log('🔨 Rebuilding program with correct ID...')
        execSync('anchor build', { stdio: 'inherit', cwd: 'anchor' })

        console.log('✅ Program ID mismatch fixed and program rebuilt!')
        console.log('💡 The program is now consistent and ready for initialization.')
      } else {
        console.log('✅ Program ID consistency verified!')

        // Even if IDs match, do a clean rebuild to ensure the binary is consistent
        console.log('🔄 Ensuring clean build with current program ID...')
        execSync('anchor clean', { stdio: 'inherit', cwd: 'anchor' })
        execSync('anchor build', { stdio: 'inherit', cwd: 'anchor' })
        console.log('✅ Clean rebuild completed!')
      }
    } catch (error) {
      console.error('❌ Error verifying program ID:', error)
      console.log('⚠️  You may need to manually check program ID consistency')
    }
  }

  private async deployProgram(): Promise<boolean> {
    try {
      console.log('\n🚀 Deploying Solana program...\n')

      // Check if we need a new program ID
      const needNewProgram = await this.question('Do you want to deploy with a new program ID? (y/n): ')

      let newKeypairPath: string | null = null

      if (needNewProgram.toLowerCase() === 'y' || needNewProgram.toLowerCase() === 'yes') {
        const { programId, keypairPath } = this.generateNewProgramId()
        this.updateProgramReferences(programId)
        newKeypairPath = keypairPath
      }

      // Ensure deploy wallet has sufficient funds
      await this.ensureDeployWalletFunded()

      // Build the program first to create target/deploy directory
      console.log('🔨 Building program...')
      execSync('anchor build', { stdio: 'inherit', cwd: 'anchor' })

      // Now copy the program keypair after build creates the directory
      if (newKeypairPath) {
        console.log('📋 Setting up program keypair...')
        // Ensure target/deploy directory exists
        execSync('mkdir -p anchor/target/deploy')
        execSync(`cp ${newKeypairPath} anchor/target/deploy/solana_distributor-keypair.json`)
        console.log('✅ Program keypair configured')
      }

      // Deploy the program
      console.log('📡 Deploying program...')
      execSync('anchor deploy', { stdio: 'inherit', cwd: 'anchor' })

      // After deployment, check for program ID mismatch and fix it
      await this.verifyAndFixProgramId()

      console.log('✅ Program deployed successfully!')
      return true
    } catch (error) {
      console.error('❌ Deployment failed:', error)
      console.log('\n🔧 Troubleshooting tips:')
      console.log('1. Make sure you have sufficient SOL in your deploy wallet')
      console.log('2. Check network connectivity to devnet')
      console.log('3. Try manual deployment: anchor build && anchor deploy')
      return false
    }
  }

  private async ensureDeployWalletFunded(): Promise<void> {
    try {
      // Check if deploy wallet exists and extract it
      const { deployWallet } = this.loadExistingWallets()
      if (deployWallet) {
        this.createDeployWalletFile(deployWallet)

        const balance = await this.checkBalance(deployWallet.publicKey)
        console.log(`💰 Deploy wallet balance: ${balance} SOL`)

        if (balance < 2) {
          console.log('💧 Deploy wallet needs more SOL for deployment...')
          const fundSuccess = await this.requestAirdrop(deployWallet.publicKey, 2)
          if (!fundSuccess) {
            console.log('⚠️  Please fund your deploy wallet manually:')
            console.log(`   solana airdrop 2 ${deployWallet.publicKey} --url devnet`)
            console.log('   Or visit: https://faucet.solana.com')
          }
        }
      }
    } catch {
      console.log('⚠️  Could not check deploy wallet balance')
    }
  }

  public async fixProgramIdMismatch(): Promise<void> {
    try {
      console.log('🔧 Program ID Mismatch Fixer\n')
      console.log('This will check and fix any program ID mismatches between:')
      console.log('- Deployed program keypair')
      console.log('- Rust source code (declare_id!)')
      console.log('- Anchor.toml configuration')
      console.log('- Recipients.json')
      console.log('- Frontend TypeScript files')
      console.log('\n' + '='.repeat(50) + '\n')

      await this.verifyAndFixProgramId()

      console.log('\n✅ Program ID verification completed!')
      console.log('💡 You can now run initialization: npm run anchor:init')
    } catch (error) {
      console.error('❌ Fix failed:', error)
      process.exit(1)
    } finally {
      this.rl.close()
    }
  }

  public async run(): Promise<void> {
    try {
      console.log('🎉 Welcome to Solana Distributor Deployment Setup!\n')
      console.log('This script will help you:')
      console.log('1. Set up your deployment wallet')
      console.log('2. Create test wallets for examples')
      console.log('3. Deploy the Solana program')
      console.log('4. Generate configuration files')
      console.log('\n' + '='.repeat(50) + '\n')

      // Step 1: Setup deployment wallet
      const deployWallet = await this.setupDeployWallet()
      this.wallets.push(deployWallet)

      // Step 2: Setup test wallets
      const testWallets = await this.setupTestWallets()
      this.wallets.push(...testWallets)

      // Step 3: Update configuration files
      console.log('\n📝 Updating configuration files...')
      this.updateAnchorConfig(deployWallet)
      this.saveTestWalletsJson(this.wallets)
      this.generateRecipientsJson(testWallets)

      // Step 3.5: Generate merkle tree and update recipients.json
      console.log('\n🌳 Generating merkle tree and updating recipients...')
      this.generateMerkleTree()

      // Step 3.6: Update TypeScript recipients file
      console.log('\n📝 Updating TypeScript recipients file...')
      this.updateRecipientsTypeScript()

      // Step 4: Deploy program
      const deployChoice = await this.question('\nDo you want to deploy the program now? (y/n): ')
      let deploySuccess = false
      if (deployChoice.toLowerCase() === 'y' || deployChoice.toLowerCase() === 'yes') {
        deploySuccess = await this.deployProgram()
        if (!deploySuccess) {
          console.log('⚠️  Deployment failed. You can try manually with: anchor deploy')
        }
      } else {
        console.log('⏭️  Skipping deployment. You can deploy later with: anchor deploy')
      }

      // Step 5: Update environment file after successful deployment
      if (deploySuccess) {
        console.log('🎉 Program deployment completed successfully!')

        // Update environment file with new program ID
        const currentProgramId = this.getCurrentProgramId()
        this.updateEnvironmentFile(currentProgramId)
      }

      // Step 6: Show initialization command
      if (deploySuccess) {
        console.log('\n🎯 Now you can cd anchor and run:')
        console.log('ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \\')
        console.log('ANCHOR_WALLET=./deploy-wallet.json \\')
        console.log('npx ts-node scripts/initialize-airdrop.ts')
      }

      // Step 7: Final summary
      console.log('\n' + '='.repeat(50))
      console.log('✅ Setup completed successfully!\n')
      console.log('📁 Files created/updated:')
      this.wallets.forEach((wallet) => {
        console.log(`   - ${wallet.keypairFile}`)
      })
      console.log('   - anchor/test-wallets.json')
      console.log('   - anchor/recipients.json (updated)')
      console.log('   - src/lib/recipients.ts (updated)')
      console.log('   - anchor/Anchor.toml (updated)')
      if (deploySuccess) {
        console.log('   - .env.local or .env (updated with program ID)')
      }

      console.log('\n🚀 Status summary:')
      console.log('1. ✅ Merkle tree generated and anchor/recipients.json updated')
      if (deploySuccess) {
        console.log('2. ✅ Program deployed successfully')
        console.log('3. ⏭️  Initialize airdrop: see command above')
      } else {
        console.log('2. ⏭️  Deploy program: anchor deploy')
        console.log('3. ⏭️  Initialize airdrop: npx ts-node scripts/initialize-airdrop.ts')
      }

      console.log('\n📋 Next steps:')
      if (!deploySuccess) {
        console.log('   1. Deploy program: anchor deploy')
        console.log('   2. Initialize airdrop: npx ts-node scripts/initialize-airdrop.ts')
        console.log('   3. Test claiming: Use the frontend at http://localhost:3000')
      } else {
        console.log('   1. Initialize airdrop: see command above')
        console.log('   2. Test claiming: Use the frontend at http://localhost:3000')
        console.log('   3. Restart your dev server to use the updated program ID')
      }

      console.log('\n💡 Wallet information saved in anchor/test-wallets.json')
      console.log("   Use 'cat anchor/test-wallets.json' to view wallet details")
    } catch (error) {
      console.error('❌ Setup failed:', error)
      process.exit(1)
    } finally {
      this.rl.close()
    }
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  const setup = new SolanaDeploymentSetup()

  // Check for command line arguments
  const args = process.argv.slice(2)

  if (args.includes('--fix-program-id') || args.includes('--fix')) {
    // Run program ID fixer only
    setup.fixProgramIdMismatch().catch(console.error)
  } else {
    // Run full setup
    setup.run().catch(console.error)
  }
}

export { SolanaDeploymentSetup }
