import { createKitClient, sendKitTransaction } from './kit-client'

// Codama-generated client imports
import { getInitializeAirdropInstruction } from '../generated/clients/ts/instructions/initializeAirdrop'
import * as fs from 'fs'
import type { RecipientsFile, GillInitializationResult } from './types'
import { createKeyPairSignerFromBytes, address, getProgramDerivedAddress } from '@solana/kit'
import {
  buildGillProgramIfNeeded,
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

  const buildConfig: GillBuildConfig = { workingDir, network: config.network }

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
    console.log('🔧 Checking and fixing common issues... (Kit)')

    const { needsBuild, issues } = await checkGillPreRequisites(config)

    if (issues.length === 0) {
      console.log('✅ No issues detected (Kit)')
      return true
    }

    console.log(`⚠️  Found issues: ${issues.join(', ')} (Kit)`)

    if (needsBuild) {
      const buildConfig: GillBuildConfig = { workingDir, verbose, network: config.network }

      const consistencyFixed = await ensureGillProgramIdConsistency(undefined, buildConfig)
      if (!consistencyFixed) {
        console.error('❌ Failed to fix program ID consistency (Kit)')
        return false
      }

      const buildResult = await buildGillProgramIfNeeded(true, buildConfig)
      if (!buildResult.success) {
        console.error('❌ Build failed during issue fixing (Kit)')
        return false
      }
    }

    console.log('✅ Issues fixed successfully! (Kit)')
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
  const { network = 'devnet', walletPath = './deploy-wallet.json', workingDir = '.' } = config

  try {
    console.log('🚀 Initializing airdrop with Kit...\n')

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

    console.log(`📋 Loaded ${recipientsData.recipients.length} recipients (Kit)`)
    console.log(`💰 Total amount: ${parseInt(recipientsData.totalAmount) / 1e9} SOL (Kit)`)
    console.log(`🌳 Merkle root: ${recipientsData.merkleRoot} (Kit)`)

    console.log('📡 Setting up Kit client...')
    const walletData = fs.readFileSync(walletPath, 'utf8')
    const walletArray = JSON.parse(walletData)
    const walletBytes = new Uint8Array(walletArray)
    const authoritySigner = await createKeyPairSignerFromBytes(walletBytes)

    const client = createKitClient(authoritySigner, network, config.rpcUrl)
    const { rpc } = client

    console.log(`👤 Authority: ${authoritySigner.address} (Kit)`)

    const buildConfig: GillBuildConfig = { workingDir, network }
    const status = getGillProgramStatus(buildConfig)

    if (!status.programId) {
      return {
        success: false,
        error: 'Program ID not found. Please build and deploy the program first using: npm run airdrop:setup',
      }
    }

    const programAddress = address(status.programId)
    console.log(`📍 Program ID: ${programAddress} (Kit)`)

    // Ensure Codama client is in sync with current program ID
    console.log('🔄 Checking Codama client sync... (Kit)')
    const codamaSynced = await ensureGillCodamaSync({ workingDir, network })
    if (!codamaSynced) {
      return { success: false, error: 'Codama client is not synchronized. Regenerate the client and retry explicitly.' }
    }

    console.log('🔍 Verifying program exists on-chain... (Kit)')
    try {
      const programInfo = await rpc.getAccountInfo(programAddress).send()
      if (!programInfo.value) {
        return {
          success: false,
          error: 'Program account not found on-chain. Please deploy the program first using: npm run airdrop:setup',
        }
      }
      console.log('✅ Program verified on-chain (Kit)')
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
    console.log(`🏛️  Airdrop state PDA: ${airdropStatePda} (Kit)`)

    // Step 7: Check if already initialized
    try {
      const existingStateInfo = await rpc.getAccountInfo(address(airdropStatePda)).send()
      if (existingStateInfo.value) {
        console.log('⚠️  Airdrop already initialized (detected via Kit)')
        console.log(`   PDA: ${airdropStatePda}`)

        return {
          success: true,
          airdropStatePda: address(airdropStatePda),
          alreadyInitialized: true,
        }
      }
    } catch {
      console.log('✅ Airdrop not yet initialized, proceeding... (Kit)')
    }

    console.log('📤 Preparing initialize transaction... (Codama + Kit)')

    const merkleRootHex = recipientsData.merkleRoot.replace('0x', '')
    const merkleRootBytes = new Uint8Array(Buffer.from(merkleRootHex, 'hex'))

    const initializeInstruction = getInitializeAirdropInstruction(
      {
        airdropState: address(airdropStatePda),
        authority: authoritySigner,
        merkleRoot: merkleRootBytes,
        amount: BigInt(recipientsData.totalAmount),
      },
      { programAddress },
    )

    let signature: string
    try {
      signature = await sendKitTransaction(client, [initializeInstruction])
      console.log(`Transaction signature: ${signature}`)
    } catch (error) {
      return {
        success: false,
        error: `Failed to send initialization transaction: ${error}. Check program ID consistency and deployment explicitly; no automatic redeployment was attempted.`,
      }
    }

    console.log('🔍 Verifying airdrop state... (Kit)')
    await new Promise((resolve) => setTimeout(resolve, 3000))

    let verificationAttempts = 0
    const maxAttempts = 3

    while (verificationAttempts < maxAttempts) {
      try {
        const airdropStateInfo = await rpc.getAccountInfo(address(airdropStatePda)).send()
        if (airdropStateInfo.value) {
          console.log('✅ Airdrop initialized and verified successfully! (Kit)')
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
          console.log('⚠️  Verification failed, but initialization likely succeeded (Kit)')
          console.log('   Check the transaction on the explorer to confirm')

          return {
            success: true,
            airdropStatePda: address(airdropStatePda),
            signature,
            alreadyInitialized: false,
            verificationFailed: true,
          }
        }

        console.log(`🔄 Verification attempt ${verificationAttempts} failed, retrying... (Kit)`)
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
