import * as fs from 'fs'
import * as path from 'path'
import type { GillWalletInfo, GillNetworkConfig, GillDeploymentResult } from './types'

import { address, createKeyPairSignerFromBytes } from '@solana/kit'
import { getKitRpcUrl } from './kit-client'
import {
  createGillWalletClient,
  generateGillWallet,
  ensureGillWalletFunded,
  generateGillTestWallets,
  setupEfficientWalletFunding,
} from './wallet-manager'

import {
  deployGillProgram as deployGillProgramBuild,
  getGillProgramStatus as getGillProgramStatusBuild,
  ensureGillProgramIdConsistency,
} from './build-coordinator'

import {
  updateGillAnchorConfig,
  generateGillRecipientsJson,
  updateGillRecipientsWithMerkleRoot,
  updateGillEnvironmentFile,
  updateGillFrontendRecipientsFile,
  loadGillRecipientsFile,
  getGillCurrentProgramId,
  writeGillWalletFile,
  writeGillTestWalletsFile,
  ensureGillCodamaSync,
} from './file-manager'

import { generateGillMerkleTree } from './merkle-tree-manager'

export interface GillProgramConfig {
  network: 'devnet' | 'mainnet' | 'testnet'
  rpcUrl?: string
  workingDir?: string
  minFunding?: number
}

export interface GillDeploymentOptions {
  deployWallet: GillWalletInfo
  generateNewProgramId?: boolean
  minFunding?: number
  config: GillProgramConfig
}

export interface GillSetupOptions {
  config: GillProgramConfig
  useExistingWallets?: boolean
  numTestWallets?: number
  deployProgram?: boolean
  generateNewProgramId?: boolean
  deployWallet?: GillWalletInfo
  testWallets?: GillWalletInfo[]
  airdropAmountLamports?: number // Amount per recipient in lamports (default: 75000000 = 0.075 SOL)
}

export async function generateGillProgramId(workingDir = '.'): Promise<{ programId: string; keypairPath: string }> {
  try {
    console.log('🆔 Generating new program ID...')

    const keypairDir = path.join(workingDir, 'program-keypairs')
    fs.mkdirSync(keypairDir, { recursive: true, mode: 0o700 })
    const currentKeypair = path.join(workingDir, 'target/deploy/solana_distributor-keypair.json')
    if (fs.existsSync(currentKeypair)) {
      const currentBytes = new Uint8Array(JSON.parse(fs.readFileSync(currentKeypair, 'utf8')))
      const currentSigner = await createKeyPairSignerFromBytes(currentBytes)
      const backupPath = path.join(keypairDir, `${currentSigner.address}-keypair.json`)
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(currentKeypair, backupPath, fs.constants.COPYFILE_EXCL)
        fs.chmodSync(backupPath, 0o600)
      }
    }

    const wallet = await generateGillWallet('program')
    const programId = wallet.address
    const keypairPath = path.join(keypairDir, `${programId}-keypair.json`)
    fs.writeFileSync(keypairPath, JSON.stringify(wallet.secretKey.array), { flag: 'wx', mode: 0o600 })

    console.log(`✅ Generated new program ID: ${programId}`)
    return { programId, keypairPath }
  } catch (error) {
    console.error('❌ Error generating program ID:', error)
    throw error
  }
}

export async function deployGillProgram(options: GillDeploymentOptions): Promise<GillDeploymentResult> {
  const { deployWallet, generateNewProgramId = false, minFunding = 2, config } = options

  try {
    console.log('\n🚀 Starting program deployment with Kit...\n')

    console.log('💰 Ensuring deploy wallet has sufficient funds...')
    const networkConfig: GillNetworkConfig = {
      network: config.network,
      rpcUrl: config.rpcUrl,
    }

    const client = createGillWalletClient(networkConfig)
    await ensureGillWalletFunded(client.rpc, deployWallet, minFunding, minFunding)

    let newKeypairPath: string | null = null
    let targetProgramId: string | null = null

    if (generateNewProgramId) {
      const { programId, keypairPath } = await generateGillProgramId(config.workingDir)
      targetProgramId = programId
      newKeypairPath = keypairPath
      const deployDir = path.join(config.workingDir || '.', 'target/deploy')
      fs.mkdirSync(deployDir, { recursive: true })
      fs.copyFileSync(keypairPath, path.join(deployDir, 'solana_distributor-keypair.json'))
    }

    const consistencyFixed = await ensureGillProgramIdConsistency(targetProgramId || undefined, {
      workingDir: config.workingDir,
    })

    if (!consistencyFixed) {
      return { success: false, error: 'Failed to ensure program ID consistency' }
    }

    const deployResult = await deployGillProgramBuild(newKeypairPath || undefined, {
      workingDir: config.workingDir,
      rpcUrl: getKitRpcUrl(config.network, config.rpcUrl),
    })

    if (!deployResult.success) {
      return {
        success: false,
        error: deployResult.error,
        programId: deployResult.programId ? address(deployResult.programId) : undefined,
        signature: deployResult.signature,
      }
    }

    console.log('✅ Program deployment completed successfully with Kit!')
    return {
      success: true,
      programId: deployResult.programId ? address(deployResult.programId) : undefined,
      signature: deployResult.signature,
    }
  } catch (error) {
    console.error('❌ Deployment failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function completeGillSetup(options: GillSetupOptions): Promise<{
  success: boolean
  deployWallet?: GillWalletInfo
  testWallets?: GillWalletInfo[]
  programId?: string
  error?: string
}> {
  const {
    config,
    numTestWallets = 3,
    deployProgram = false,
    generateNewProgramId = false,
    deployWallet: providedDeployWallet,
    testWallets: providedTestWallets,
    airdropAmountLamports = 75000000, // Default: 0.075 SOL
  } = options

  try {
    console.log('🎉 Starting complete setup workflow with Kit...\n')

    const networkConfig: GillNetworkConfig = {
      network: config.network,
      rpcUrl: config.rpcUrl,
    }

    let deployWallet: GillWalletInfo

    if (providedDeployWallet) {
      console.log('✅ Using provided deploy wallet')
      deployWallet = providedDeployWallet
    } else {
      console.log('🔑 Creating new deploy wallet with Kit')
      deployWallet = await generateGillWallet('deploy-wallet')
    }

    let testWallets: GillWalletInfo[]

    if (providedTestWallets && providedTestWallets.length > 0) {
      console.log(`✅ Using ${providedTestWallets.length} provided test wallets`)
      testWallets = providedTestWallets
    } else {
      console.log(`🧪 Creating ${numTestWallets} test wallets with Kit`)
      const client = createGillWalletClient(networkConfig)
      testWallets = await generateGillTestWallets(client.rpc, numTestWallets)
    }

    let programId = getGillCurrentProgramId({ workingDir: config.workingDir })

    console.log('\n📝 Updating configuration files...')

    updateGillAnchorConfig(deployWallet, programId, { workingDir: config.workingDir, network: config.network })
    generateGillRecipientsJson(testWallets, programId, airdropAmountLamports, {
      workingDir: config.workingDir,
      network: config.network,
    })

    console.log('\n💾 Writing wallet files...')
    writeGillWalletFile(deployWallet, { workingDir: config.workingDir })
    writeGillTestWalletsFile(testWallets, { workingDir: config.workingDir })

    console.log('\n💰 Setting up efficient wallet funding...')
    const client = createGillWalletClient(networkConfig)
    const fundingResult = await setupEfficientWalletFunding(
      client.rpc,
      deployWallet,
      testWallets,
      0.1,
      getKitRpcUrl(networkConfig.network, networkConfig.rpcUrl),
      config.network,
    )

    deployWallet = fundingResult.primaryWallet
    testWallets = fundingResult.testWallets

    console.log('\n🌳 Generating merkle tree...')
    const recipientsData = loadGillRecipientsFile(undefined, { workingDir: config.workingDir })
    const { merkleRoot } = generateGillMerkleTree(recipientsData)
    updateGillRecipientsWithMerkleRoot(merkleRoot, { workingDir: config.workingDir })

    updateGillFrontendRecipientsFile({ workingDir: config.workingDir })

    updateGillEnvironmentFile(programId, testWallets, { workingDir: config.workingDir, network: config.network })

    if (deployProgram) {
      console.log('\n🚀 Deploying program with Kit...')
      const deployResult = await deployGillProgram({
        deployWallet,
        generateNewProgramId,
        config,
      })

      if (!deployResult.success) {
        return {
          success: false,
          error: `Deployment failed: ${deployResult.error}`,
        }
      }

      programId = deployResult.programId || programId

      generateGillRecipientsJson(testWallets, programId, airdropAmountLamports, {
        workingDir: config.workingDir,
        network: config.network,
      })
      updateGillRecipientsWithMerkleRoot(merkleRoot, { workingDir: config.workingDir })
      updateGillFrontendRecipientsFile({ workingDir: config.workingDir })

      updateGillEnvironmentFile(programId, testWallets, { workingDir: config.workingDir, network: config.network })

      // Ensure Codama client is updated with new program ID
      console.log('🔄 Syncing Codama client with deployed program ID... (Kit)')
      const codamaSynced = await ensureGillCodamaSync({ workingDir: config.workingDir })
      if (!codamaSynced) {
        return { success: false, error: 'Program deployed, but Codama client synchronization failed' }
      }
    }

    console.log('\n✅ Complete setup finished successfully with Kit!')
    return {
      success: true,
      deployWallet,
      testWallets,
      programId,
    }
  } catch (error) {
    console.error('❌ Setup failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function getGillProgramStatus(config: GillProgramConfig): Promise<{
  built: boolean
  deployed: boolean
  consistent: boolean
  programId: string | null
  onChainProgramId?: string
}> {
  try {
    const localStatus = getGillProgramStatusBuild({ workingDir: config.workingDir })

    if (localStatus.programId) {
      try {
        const client = createGillWalletClient({ network: config.network, rpcUrl: config.rpcUrl })
        const accountInfo = await client.rpc.getAccountInfo(address(localStatus.programId)).send()

        return {
          ...localStatus,
          deployed: accountInfo.value !== null,
          onChainProgramId: localStatus.programId,
        }
      } catch (error) {
        console.warn('Could not check on-chain program status:', error)
        return localStatus
      }
    }

    return localStatus
  } catch (error) {
    console.error('Error getting program status:', error)
    return {
      built: false,
      deployed: false,
      consistent: false,
      programId: null,
    }
  }
}
