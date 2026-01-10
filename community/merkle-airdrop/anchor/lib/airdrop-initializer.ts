// Codama-generated client imports
import { getInitializeAirdropInstruction } from '../generated/clients/ts/instructions/initializeAirdrop'
import * as fs from 'fs'
import type { RecipientsFile, GillInitializationResult } from './types'
import {
  createSolanaClient,
  createKeyPairSignerFromBytes,
  address,
  getProgramDerivedAddress,
  createTransaction,
} from 'gill'
import {
  buildGillProgramIfNeeded,
  deployGillProgram,
  getGillProgramStatus,
  ensureGillProgramIdConsistency,
  type GillBuildConfig,
} from './build-coordinator'
import { loadGillRecipientsFile, ensureGillCodamaSync, type GillFileConfig } from './file-manager'

export interface GillInitializerConfig {
  rpcUrl?: string
  network?: 'devnet' | 'mainnet' | 'testnet'
  walletPath?: string
  workingDir?: string
  verbose?: boolean
}

export async function checkGillPreRequisites(
  config: GillInitializerConfig = {},
): Promise<{ needsBuild: boolean; issues: string[] }> {
  const { workingDir = '.' } = config
  const issues: string[] = []
  let needsBuild = false

  const buildConfig: GillBuildConfig = { workingDir }

  const status = getGillProgramStatus(buildConfig)
  if (!status.built) {
    issues.push('Program not built')
    needsBuild = true
  }

  const idlPath = `${workingDir}/target/idl/solana_distributor.json`
  if (!fs.existsSync(idlPath)) {
    issues.push('IDL file missing')
    needsBuild = true
  }

  if (!status.consistent) {
    issues.push('Program ID inconsistency detected')
    needsBuild = true
  }

  return { needsBuild, issues }
}

export async function fixGillInitializationIssues(config: GillInitializerConfig = {}): Promise<boolean> {
  const { workingDir = '.', verbose = false } = config

  try {
    console.log('🔧 Checking and fixing common issues... (Gill)')

    const { needsBuild, issues } = await checkGillPreRequisites(config)

    if (issues.length === 0) {
      console.log('✅ No issues detected (Gill)')
      return true
    }

    console.log(`⚠️  Found issues: ${issues.join(', ')} (Gill)`)

    if (needsBuild) {
      const buildConfig: GillBuildConfig = { workingDir, verbose }

      const consistencyFixed = await ensureGillProgramIdConsistency(undefined, buildConfig)
      if (!consistencyFixed) {
        console.error('❌ Failed to fix program ID consistency (Gill)')
        return false
      }

      const buildResult = await buildGillProgramIfNeeded(true, buildConfig)
      if (!buildResult.success) {
        console.error('❌ Build failed during issue fixing (Gill)')
        return false
      }
    }

    console.log('✅ Issues fixed successfully! (Gill)')
    return true
  } catch (error) {
    console.error('❌ Error fixing issues:', error)
    return false
  }
}

export async function initializeGillAirdrop(
  recipientsFile: string = 'recipients.json',
  config: GillInitializerConfig = {},
): Promise<GillInitializationResult> {
  const { network = 'devnet', walletPath = './deploy-wallet.json', workingDir = '.', verbose = false } = config

  try {
    console.log('🚀 Initializing airdrop with Gill...\n')

    const issuesFixed = await fixGillInitializationIssues(config)
    if (!issuesFixed) {
      return {
        success: false,
        error: 'Failed to fix pre-requisite issues',
      }
    }

    const fileConfig: GillFileConfig = { workingDir }
    let recipientsData: RecipientsFile

    try {
      recipientsData = loadGillRecipientsFile(recipientsFile, fileConfig)
    } catch (error) {
      return {
        success: false,
        error: `Failed to load recipients file: ${error}`,
      }
    }

    console.log(`📋 Loaded ${recipientsData.recipients.length} recipients (Gill)`)
    console.log(`💰 Total amount: ${parseInt(recipientsData.totalAmount) / 1e9} SOL (Gill)`)
    console.log(`🌳 Merkle root: ${recipientsData.merkleRoot} (Gill)`)

    console.log('📡 Setting up Gill client...')
    const client = createSolanaClient({
      urlOrMoniker: network === 'devnet' ? 'devnet' : `https://api.${network}.solana.com`,
    })
    const { rpc, sendAndConfirmTransaction } = client

    const walletData = fs.readFileSync(walletPath, 'utf8')
    const walletArray = JSON.parse(walletData)
    const walletBytes = new Uint8Array(walletArray)
    const authoritySigner = await createKeyPairSignerFromBytes(walletBytes)

    console.log(`👤 Authority: ${authoritySigner.address} (Gill)`)

    const buildConfig: GillBuildConfig = { workingDir }
    const status = getGillProgramStatus(buildConfig)

    if (!status.programId) {
      return {
        success: false,
        error: 'Program ID not found. Please build and deploy the program first using: npm run airdrop:setup',
      }
    }

    const programAddress = address(status.programId)
    console.log(`📍 Program ID: ${programAddress} (Gill)`)

    // Ensure Codama client is in sync with current program ID
    console.log('🔄 Checking Codama client sync... (Gill)')
    const codamaSynced = await ensureGillCodamaSync({ workingDir })
    if (!codamaSynced) {
      console.log('⚠️  Warning: Could not sync Codama client. Proceeding anyway... (Gill)')
    }

    console.log('🔍 Verifying program exists on-chain... (Gill)')
    try {
      const programInfo = await rpc.getAccountInfo(programAddress).send()
      if (!programInfo.value) {
        return {
          success: false,
          error: 'Program account not found on-chain. Please deploy the program first using: npm run airdrop:setup',
        }
      }
      console.log('✅ Program verified on-chain (Gill)')
    } catch (error) {
      return {
        success: false,
        error: `Program verification failed: ${error}`,
      }
    }

    const [airdropStatePda] = await getProgramDerivedAddress({
      programAddress,
      seeds: ['merkle_tree'],
    })
    console.log(`🏛️  Airdrop state PDA: ${airdropStatePda} (Gill)`)

    // Step 7: Check if already initialized
    try {
      const existingStateInfo = await rpc.getAccountInfo(address(airdropStatePda)).send()
      if (existingStateInfo.value) {
        console.log('⚠️  Airdrop already initialized (detected via Gill)')
        console.log(`   PDA: ${airdropStatePda}`)

        return {
          success: true,
          airdropStatePda: address(airdropStatePda),
          alreadyInitialized: true,
        }
      }
    } catch {
      console.log('✅ Airdrop not yet initialized, proceeding... (Gill)')
    }

    console.log('📤 Preparing initialize transaction... (Codama + Gill)')

    const merkleRootHex = recipientsData.merkleRoot.replace('0x', '')
    const merkleRootBytes = new Uint8Array(Buffer.from(merkleRootHex, 'hex'))

    const signer = await createKeyPairSignerFromBytes(walletBytes)

    const initializeInstruction = getInitializeAirdropInstruction({
      airdropState: address(airdropStatePda),
      authority: signer,
      merkleRoot: merkleRootBytes,
      amount: BigInt(recipientsData.totalAmount),
    })

    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send()

    // Create transaction using Gill
    const transaction = createTransaction({
      version: 'legacy',
      feePayer: signer,
      instructions: [initializeInstruction],
      latestBlockhash,
    })

    let signature: string
    try {
      signature = await sendAndConfirmTransaction(transaction)

      console.log('✅ Transaction sent successfully! (Codama + Gill)')
      console.log(`📋 Transaction signature: ${signature}`)
      console.log(`🔍 View on explorer: https://explorer.solana.com/tx/${signature}?cluster=${network}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes('DeclaredProgramIdMismatch')) {
        console.log('⚠️  Program ID mismatch detected, attempting fresh deployment... (Gill)')

        try {
          const deployResult = await deployGillProgram(undefined, { workingDir, verbose })
          if (!deployResult.success) {
            return {
              success: false,
              error: `Fresh deployment failed: ${deployResult.error}`,
            }
          }

          console.log('✅ Fresh deployment completed, retrying initialization... (Gill)')

          const retryTransaction = createTransaction({
            version: 'legacy',
            feePayer: signer,
            instructions: [initializeInstruction],
            latestBlockhash: (await rpc.getLatestBlockhash().send()).value,
          })

          signature = await sendAndConfirmTransaction(retryTransaction)

          console.log('✅ Transaction sent successfully after retry! (Codama + Gill)')
          console.log(`📋 Transaction signature: ${signature}`)
        } catch (retryError) {
          return {
            success: false,
            error: `Failed to initialize after fresh deployment: ${retryError}`,
          }
        }
      } else {
        return {
          success: false,
          error: `Failed to send initialization transaction: ${error}`,
        }
      }
    }

    console.log('🔍 Verifying airdrop state... (Gill)')
    await new Promise((resolve) => setTimeout(resolve, 3000))

    let verificationAttempts = 0
    const maxAttempts = 3

    while (verificationAttempts < maxAttempts) {
      try {
        const airdropStateInfo = await rpc.getAccountInfo(address(airdropStatePda)).send()
        if (airdropStateInfo.value) {
          console.log('✅ Airdrop initialized and verified successfully! (Gill)')
          console.log(`   PDA: ${airdropStatePda}`)

          return {
            success: true,
            airdropStatePda: address(airdropStatePda),
            signature,
            alreadyInitialized: false,
          }
        }
        throw new Error('Account not found')
      } catch {
        verificationAttempts++
        if (verificationAttempts >= maxAttempts) {
          console.log('⚠️  Verification failed, but initialization likely succeeded (Gill)')
          console.log('   Check the transaction on the explorer to confirm')

          return {
            success: true,
            airdropStatePda: address(airdropStatePda),
            signature,
            alreadyInitialized: false,
            verificationFailed: true,
          }
        }

        console.log(`🔄 Verification attempt ${verificationAttempts} failed, retrying... (Gill)`)
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }

    return {
      success: false,
      error: 'Unexpected error in verification loop',
    }
  } catch (error) {
    console.error('❌ Airdrop initialization failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function initializeGillAirdropDefault(recipientsFile: string = 'recipients.json') {
  return await initializeGillAirdrop(recipientsFile, {
    network: 'devnet',
    walletPath: './deploy-wallet.json',
    workingDir: '.',
    verbose: false,
  })
}
