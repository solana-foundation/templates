#!/usr/bin/env ts-node

import * as readline from 'readline'
import type { GillWalletInfo } from '../lib/types'
import {
  createGillWalletClient,
  generateGillWallet,
  createGillWalletFromKey,
  ensureGillWalletFunded,
  generateGillTestWallets,
} from '../lib/wallet-manager'
import { completeGillSetup } from '../lib/program-manager'

export interface GillDeploymentSetupConfig {
  network?: 'devnet' | 'mainnet' | 'testnet'
  workingDir?: string
  verbose?: boolean
}

export async function setupGillDeployWallet(
  rl: readline.Interface,
  config: GillDeploymentSetupConfig = {},
): Promise<GillWalletInfo> {
  const { network = 'devnet' } = config

  console.log('\n🚀 Setting up deployment wallet with Gill...\n')

  const choice = await question(
    rl,
    'Do you want to:\n' +
      '1. Use an existing wallet (provide private key)\n' +
      '2. Create a new wallet\n' +
      'Enter choice (1 or 2): ',
  )

  let deployWallet: GillWalletInfo

  if (choice === '1') {
    const privateKeyInput = await question(rl, 'Enter your private key (base58 or hex): ')

    try {
      deployWallet = await createGillWalletFromKey('deploy-wallet', privateKeyInput)
      console.log(`✅ Using existing wallet: ${deployWallet.address} (Gill)`)
    } catch {
      console.error('❌ Invalid private key format. Please try again.')
      process.exit(1)
    }
  } else {
    deployWallet = await generateGillWallet('deploy-wallet')
    console.log(`✅ Generated new deployment wallet: ${deployWallet.address} (Gill)`)
  }

  const client = createGillWalletClient({ network })
  const fundedWallet = await ensureGillWalletFunded(client.rpc, deployWallet, 5, 5)

  return fundedWallet
}

export async function setupGillTestWallets(
  rl: readline.Interface,
  config: GillDeploymentSetupConfig = {},
): Promise<GillWalletInfo[]> {
  const { network = 'devnet' } = config

  console.log('\n🧪 Setting up test wallets with Gill...\n')

  const numWallets = await question(rl, 'How many test wallets do you want to create? (default: 3): ')
  const walletCount = parseInt(numWallets) || 3

  const client = createGillWalletClient({ network })
  return await generateGillTestWallets(client.rpc, walletCount)
}

function question(rl: readline.Interface, prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

export async function runGillDeploymentSetup(config: GillDeploymentSetupConfig = {}): Promise<void> {
  const { network = 'devnet', workingDir = '.' } = config

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  try {
    console.log('🎉 Welcome to Solana Distributor Deployment Setup (Gill + Codama Edition)!\n')
    console.log('This script will help you:')
    console.log('1. Set up your deployment wallet')
    console.log('2. Create test wallets for examples')
    console.log('3. Deploy the Solana program')
    console.log('4. Generate configuration files')
    console.log('\n' + '='.repeat(50) + '\n')

    const deployWallet = await setupGillDeployWallet(rl, config)
    const testWallets = await setupGillTestWallets(rl, config)

    const deployChoice = await question(rl, '\nDo you want to deploy the program now? (y/n): ')
    const shouldDeploy = deployChoice.toLowerCase() === 'y' || deployChoice.toLowerCase() === 'yes'

    const generateNewProgram = shouldDeploy
      ? (await question(rl, 'Do you want to generate a new program ID? (y/n): ')).toLowerCase() === 'y'
      : false

    console.log('\n🚀 Running complete setup workflow with Gill...')
    const result = await completeGillSetup({
      config: {
        network,
        workingDir,
      },
      useExistingWallets: true,
      numTestWallets: testWallets.length,
      deployProgram: shouldDeploy,
      generateNewProgramId: generateNewProgram,
      deployWallet: {
        name: deployWallet.name,
        address: deployWallet.address,
        keypairFile: deployWallet.keypairFile,
        privateKey: deployWallet.privateKey,
        secretKey: deployWallet.secretKey,
        balance: deployWallet.balance || '0 SOL',
        funded: deployWallet.funded || false,
        isDeployWallet: true,
        signer: deployWallet.signer,
      },
      testWallets: testWallets.map((w) => ({
        name: w.name,
        address: w.address,
        keypairFile: w.keypairFile,
        privateKey: w.privateKey,
        secretKey: w.secretKey,
        balance: w.balance || '0 SOL',
        funded: w.funded || false,
        signer: w.signer,
      })),
      airdropAmountLamports: 75000000, // 0.075 SOL default
    })

    if (!result.success) {
      console.error(`❌ Setup failed: ${result.error}`)
      process.exit(1)
    }

    showGillFinalSummary(result, shouldDeploy)
  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  } finally {
    rl.close()
  }
}

function showGillFinalSummary(
  result: Awaited<ReturnType<typeof completeGillSetup>>,
  deploymentAttempted: boolean,
): void {
  console.log('\n' + '='.repeat(50))
  console.log('✅ Setup completed successfully with Gill + Codama!\n')

  console.log('📁 Files created/updated:')
  console.log('   - anchor/deploy-wallet.json')
  console.log('   - anchor/test-wallets.json')
  console.log('   - anchor/recipients.json')
  console.log('   - anchor/Anchor.toml')

  if (deploymentAttempted && result.programId) {
    console.log('   - .env.local (updated with program ID)')
  }

  console.log('\n🚀 Status summary:')
  console.log('1. ✅ Wallets created and configured (Gill)')
  console.log('2. ✅ Merkle tree generated (Gill)')
  console.log('3. ✅ Configuration files updated (Gill)')

  if (deploymentAttempted && result.programId) {
    console.log('4. ✅ Program deployed successfully (Gill)')
    console.log('\n🎯 Next step - Initialize the airdrop:')
    console.log('   npm run airdrop:init')
  } else {
    console.log('4. ⏭️  Program deployment skipped')
    console.log('\n📋 Next steps:')
    console.log('   1. Deploy: cd anchor && anchor deploy')
    console.log('   2. Initialize: npm run airdrop:init')
  }

  console.log('\n💡 Wallet information saved in anchor/test-wallets.json')
  console.log('   View with: cat anchor/test-wallets.json')
  console.log('\n🔬 Test with Gill features:')
  console.log('   npm run airdrop:extract')
}
