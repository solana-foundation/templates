import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'
import type { RecipientsFile, GillWalletInfo } from './types'
import { type Address } from '@solana/kit'

export interface GillFileConfig {
  workingDir?: string
  network?: 'devnet' | 'mainnet' | 'testnet'
}

function anchorSectionRange(lines: string[], section: string): [number, number] {
  const start = lines.findIndex((line) => line.trim().replace(/\s*#.*$/, '') === `[${section}]`)
  let end = start + 1
  while (end < lines.length && !lines[end].trim().startsWith('[')) end++
  return [start, end]
}

function updateAnchorSection(content: string, section: string, values: Record<string, string>): string {
  const lines = content.split(/\r?\n/)
  let [start, end] = anchorSectionRange(lines, section)
  if (start < 0) {
    lines.push('', `[${section}]`)
    start = lines.length - 1
    end = lines.length
  }
  for (const [key, value] of Object.entries(values)) {
    const index = lines.findIndex((line, i) => i > start && i < end && new RegExp(`^\\s*${key}\\s*=`).test(line))
    const entry = `${key} = ${JSON.stringify(value)}`
    if (index >= 0) lines[index] = entry
    else {
      lines.splice(end, 0, entry)
      end++
    }
  }
  return lines.join('\n')
}

export function getGillConfiguredProgramId(config: GillFileConfig = {}): string | null {
  const { workingDir = 'anchor', network = 'devnet' } = config
  try {
    const lines = fs.readFileSync(path.join(workingDir, 'Anchor.toml'), 'utf8').split(/\r?\n/)
    const [start, end] = anchorSectionRange(lines, `programs.${network}`)
    if (start < 0) return null
    const entry = lines.slice(start + 1, end).find((line) => /^\s*solana_distributor\s*=/.test(line))
    return entry?.match(/^\s*solana_distributor\s*=\s*["']([^"']+)["']/)?.[1] ?? null
  } catch {
    return null
  }
}

export function updateGillAnchorProgramId(programId: string | Address, config: GillFileConfig = {}): void {
  const { workingDir = 'anchor', network = 'devnet' } = config
  const file = path.join(workingDir, 'Anchor.toml')
  const content = fs.readFileSync(file, 'utf8')
  fs.writeFileSync(file, updateAnchorSection(content, `programs.${network}`, { solana_distributor: programId }))
}

export function updateGillAnchorConfig(
  deployWallet: GillWalletInfo,
  programId: string | Address,
  config: GillFileConfig = {},
): void {
  const { workingDir = 'anchor' } = config

  const programIdStr = typeof programId === 'string' ? programId : programId

  const anchorTomlPath = path.join(workingDir, 'Anchor.toml')
  let anchorToml = fs.readFileSync(anchorTomlPath, 'utf8')
  const network = config.network || 'devnet'
  anchorToml = updateAnchorSection(anchorToml, `programs.${network}`, { solana_distributor: programIdStr })
  anchorToml = updateAnchorSection(anchorToml, 'provider', { cluster: network, wallet: deployWallet.keypairFile })
  fs.writeFileSync(anchorTomlPath, anchorToml)
  console.log(`✅ Updated ${anchorTomlPath} to use ${deployWallet.keypairFile} (Kit)`)
}

export function generateGillRecipientsJson(
  testWallets: GillWalletInfo[],
  programId: string | Address,
  airdropAmountLamports: number = 75000000, // Default: 0.075 SOL
  config: GillFileConfig = {},
): void {
  const { workingDir = 'anchor' } = config

  // Convert Address to string if needed
  const programIdStr = typeof programId === 'string' ? programId : programId

  const recipients = testWallets.map((wallet, index) => ({
    publicKey: wallet.address, // Kit addresses are already strings
    amount: airdropAmountLamports.toString(),
    index,
    description: `${wallet.name} - ${wallet.funded ? 'Funded' : 'Unfunded'} - ${airdropAmountLamports / 1e9} SOL`,
  }))

  const totalAmount = (recipients.length * airdropAmountLamports).toString()
  const recipientsPath = `${workingDir}/recipients.json`

  let shouldUpdate = true
  if (fs.existsSync(recipientsPath)) {
    try {
      const existingData = JSON.parse(fs.readFileSync(recipientsPath, 'utf8'))
      const existingPublicKeys = existingData.recipients?.map((r: { publicKey: string }) => r.publicKey) || []
      const newPublicKeys = recipients.map((r) => r.publicKey)

      if (JSON.stringify(existingPublicKeys.sort()) === JSON.stringify(newPublicKeys.sort())) {
        console.log('📋 Recipients unchanged, updating descriptions only (Kit)')
        existingData.recipients = recipients
        existingData.programId = programIdStr
        existingData.network = config.network || 'devnet'
        existingData.totalAmount = totalAmount
        existingData.description = 'Deployment setup airdrop for testing purposes'
        fs.writeFileSync(recipientsPath, JSON.stringify(existingData, null, 2))
        shouldUpdate = false
      }
    } catch {}
  }

  if (shouldUpdate) {
    const recipientsData: RecipientsFile = {
      airdropId: 'solana-distributor-airdrop-' + new Date().getFullYear(),
      description: 'Deployment setup airdrop for testing purposes',
      merkleRoot: '0x0000000000000000000000000000000000000000000000000000000000000000', // Will be updated after tree generation
      totalAmount,
      network: config.network || 'devnet',
      programId: programIdStr,
      recipients,
      metadata: {
        createdAt: new Date().toISOString(),
        version: '1.0.0',
        algorithm: 'keccak256',
        leafFormat: 'recipient_pubkey(32) + amount(8) + is_claimed(1)',
      },
    }

    fs.writeFileSync(recipientsPath, JSON.stringify(recipientsData, null, 2))
    console.log(`📋 Generated ${recipientsPath} (Kit)`)
  }
}

export function updateGillRecipientsWithMerkleRoot(merkleRoot: string, config: GillFileConfig = {}): void {
  const { workingDir = 'anchor' } = config

  try {
    const recipientsPath = `${workingDir}/recipients.json`
    const recipientsData = JSON.parse(fs.readFileSync(recipientsPath, 'utf8'))

    recipientsData.merkleRoot = merkleRoot
    recipientsData.metadata.algorithm = 'keccak256'
    recipientsData.metadata.leafFormat = 'recipient_pubkey(32) + amount(8) + is_claimed(1)'

    fs.writeFileSync(recipientsPath, JSON.stringify(recipientsData, null, 2))
    console.log(`✅ Updated ${recipientsPath} with merkle root (Kit)`)
  } catch (error) {
    console.error('❌ Error updating recipients with merkle root:', error)
    throw error
  }
}

export function updateGillEnvironmentFile(
  programId: string | Address,
  testWallets?: GillWalletInfo[],
  config: GillFileConfig = {},
): void {
  try {
    console.log('📝 Updating environment file with program ID and test wallet... (Kit)')

    const { workingDir = 'anchor' } = config
    const programIdStr = typeof programId === 'string' ? programId : programId

    // Determine the correct path to the environment file
    const envFileName = '.env.local'
    let envFile: string
    if (workingDir === 'anchor' || workingDir === '.') {
      envFile = `../${envFileName}`
    } else {
      envFile = envFileName
    }

    if (!fs.existsSync(envFile)) {
      const altEnvFile = workingDir === 'anchor' || workingDir === '.' ? '../.env' : '.env'
      if (fs.existsSync(altEnvFile)) {
        envFile = altEnvFile
      }
    }

    let envContent = ''
    const programIdVar = `NEXT_PUBLIC_PROGRAM_ID=${programIdStr}`
    const networkVar = `NEXT_PUBLIC_SOLANA_NETWORK=${config.network || 'devnet'}`

    if (fs.existsSync(envFile)) {
      envContent = fs.readFileSync(envFile, 'utf8')

      // Update or add each environment variable
      if (envContent.includes('NEXT_PUBLIC_PROGRAM_ID=')) {
        envContent = envContent.replace(/NEXT_PUBLIC_PROGRAM_ID=.*/, programIdVar)
      } else {
        envContent = envContent.trim() + `\n${programIdVar}\n`
      }

      if (envContent.includes('NEXT_PUBLIC_SOLANA_NETWORK=')) {
        envContent = envContent.replace(/NEXT_PUBLIC_SOLANA_NETWORK=.*/, networkVar)
      } else {
        envContent = envContent.trim() + `\n${networkVar}\n`
      }

      console.log(`   ✅ Updated existing ${path.basename(envFile)} (Kit)`)
    } else {
      const comments = [
        '# Solana Airdrop Configuration',
        '# Generated automatically by deploy-setup script using Kit',
        '',
      ]

      const vars = [networkVar, programIdVar]
      envContent = comments.concat(vars).join('\n') + '\n'
      console.log(`   ✅ Created new ${path.basename(envFile)} with configuration (Kit)`)
    }

    // Remove secrets exported by older setup versions; wallet files stay local.
    envContent = envContent.replace(/^\s*(?:export\s+)?(?:NEXT_PUBLIC_)?USER_PRIVATE_KEY\s*=.*(?:\r?\n|$)/gm, '')
    fs.writeFileSync(envFile, envContent)
    console.log(`   📍 Program ID: ${programIdStr}`)
    if (testWallets && testWallets.length > 0) {
      console.log(`   🔑 Test wallet: ${testWallets[0].address}`)
    }
  } catch (error) {
    console.error('❌ Error updating environment file:', error)
    console.log('⚠️  You may need to manually add environment variables to your .env.local file')
  }
}

export function updateGillFrontendRecipientsFile(config: GillFileConfig = {}): void {
  try {
    console.log('🎨 Updating frontend recipients file... (Kit)')

    const { workingDir = 'anchor' } = config
    const anchorRecipientsPath = `${workingDir}/recipients.json`
    // Determine the correct path to the frontend file
    let frontendRecipientsPath: string
    if (workingDir === 'anchor' || workingDir === '.') {
      frontendRecipientsPath = '../src/lib/recipients.ts'
    } else {
      frontendRecipientsPath = 'src/lib/recipients.ts'
    }

    // Load the anchor recipients data
    if (!fs.existsSync(anchorRecipientsPath)) {
      console.log(`⚠️  Anchor recipients file not found: ${anchorRecipientsPath}`)
      return
    }

    const recipientsData: RecipientsFile = JSON.parse(fs.readFileSync(anchorRecipientsPath, 'utf8'))

    // Generate the TypeScript content for the frontend
    const frontendContent = `/**
 * Recipients Data
 * 
 * ✅ AUTOMATICALLY UPDATED by deploy-setup script
 * 
 * This file was automatically updated with real deployment data:
 * - Real program ID from your deployment
 * - Actual test wallet addresses  
 * - Computed merkle root
 * - Current timestamps and metadata
 * 
 * Last updated: ${new Date().toISOString()}
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

export type { RecipientFromJson, RecipientsFile }
`

    // Write the updated frontend file
    fs.writeFileSync(frontendRecipientsPath, frontendContent)
    console.log(`   ✅ Updated ${frontendRecipientsPath} (Kit)`)
    console.log(`   📊 Recipients: ${recipientsData.recipients.length}`)
    console.log(`   🌳 Merkle Root: ${recipientsData.merkleRoot}`)
    console.log(`   📍 Program ID: ${recipientsData.programId}`)
  } catch (error) {
    console.error('❌ Error updating frontend recipients file:', error)
    console.log('⚠️  You may need to manually sync the frontend recipients data')
  }
}

export function loadGillRecipientsFile(filePath?: string, config: GillFileConfig = {}): RecipientsFile {
  const { workingDir = 'anchor' } = config
  const recipientsPath = filePath || `${workingDir}/recipients.json`

  if (!fs.existsSync(recipientsPath)) {
    throw new Error(`Recipients file not found: ${recipientsPath}`)
  }

  try {
    const data = fs.readFileSync(recipientsPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    throw new Error(`Failed to parse recipients file: ${error}`)
  }
}

export function writeGillWalletFile(wallet: GillWalletInfo, config: GillFileConfig = {}): void {
  const { workingDir = 'anchor' } = config

  try {
    const walletPath = path.join(workingDir, wallet.keypairFile)
    const walletData = JSON.stringify(wallet.secretKey.array, null, 2)

    fs.writeFileSync(walletPath, walletData)
    console.log(`✅ Created wallet file: ${walletPath} (Kit)`)
  } catch (error) {
    console.error(`❌ Error writing wallet file for ${wallet.name}:`, error)
    throw error
  }
}

export function writeGillTestWalletsFile(testWallets: GillWalletInfo[], config: GillFileConfig = {}): void {
  const { workingDir = 'anchor' } = config

  try {
    const testWalletsPath = path.join(workingDir, 'test-wallets.json')
    const testWalletsData = {
      wallets: testWallets.map((wallet) => ({
        name: wallet.name,
        address: wallet.address,
        keypairFile: wallet.keypairFile,
        balance: wallet.balance,
        funded: wallet.funded,
        privateKey: wallet.privateKey,
        secretKey: wallet.secretKey,
      })),
      metadata: {
        createdAt: new Date().toISOString(),
        network: config.network || 'devnet',
        count: testWallets.length,
      },
    }

    fs.writeFileSync(testWalletsPath, JSON.stringify(testWalletsData, null, 2))
    console.log(`✅ Created test wallets file: ${testWalletsPath} (Kit)`)

    // Also write individual wallet files
    testWallets.forEach((wallet) => {
      writeGillWalletFile(wallet, config)
    })
  } catch (error) {
    console.error('❌ Error writing test wallets file:', error)
    throw error
  }
}

export function getGillCurrentProgramId(config: GillFileConfig = {}): string {
  const { workingDir = 'anchor' } = config

  try {
    const configuredId = getGillConfiguredProgramId(config)
    if (configuredId) return configuredId

    const libContent = fs.readFileSync(`${workingDir}/programs/solana-distributor/src/lib.rs`, 'utf8')
    const libMatch = libContent.match(/declare_id!\("([^"]+)"\);/)
    if (libMatch) {
      return libMatch[1]
    }

    throw new Error('Could not find program ID in configuration files')
  } catch (error) {
    console.error('❌ Error getting current program ID:', error)
    throw new Error(`Failed to get program ID: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export function getGillCodamaProgramId(config: GillFileConfig = {}): string | null {
  const { workingDir = 'anchor' } = config

  try {
    const codamaClientPath = path.join(workingDir, 'generated', 'clients', 'ts', 'programs', 'solanaDistributor.ts')

    if (!fs.existsSync(codamaClientPath)) {
      return null
    }

    const codamaContent = fs.readFileSync(codamaClientPath, 'utf8')
    const match = codamaContent.match(/SOLANA_DISTRIBUTOR_PROGRAM_ADDRESS\s*=\s*['"]([^'"]+)['"]/)

    if (match) {
      return match[1]
    }

    return null
  } catch (error) {
    console.error('❌ Error reading Codama program ID:', error)
    return null
  }
}

export async function ensureGillCodamaSync(config: GillFileConfig = {}): Promise<boolean> {
  const { workingDir = 'anchor' } = config

  try {
    const currentProgramId = getGillCurrentProgramId(config)
    const codamaProgramId = getGillCodamaProgramId(config)

    if (codamaProgramId === currentProgramId) {
      console.log('✅ Codama client is already in sync with current program ID (Kit)')
      return true
    }

    console.log('🔄 Program ID mismatch detected, regenerating Codama client... (Kit)')
    console.log(`   Current Program ID: ${currentProgramId}`)
    console.log(`   Codama Program ID: ${codamaProgramId || 'not found'}`)

    // Import and run the codama generation
    const codamaConfigPath = path.join(workingDir, 'codama.config.ts')

    if (!fs.existsSync(codamaConfigPath)) {
      console.error('❌ Codama config not found at:', codamaConfigPath)
      return false
    }

    console.log('⚡ Regenerating Codama client...')
    execSync(`npx ts-node codama.config.ts`, {
      cwd: workingDir,
      stdio: 'pipe',
    })

    // Verify the update was successful
    const updatedCodamaProgramId = getGillCodamaProgramId(config)
    if (updatedCodamaProgramId === currentProgramId) {
      console.log('✅ Codama client successfully updated with current program ID! (Kit)')
      return true
    } else {
      console.error('❌ Failed to update Codama client program ID')
      return false
    }
  } catch (error) {
    console.error('❌ Error syncing Codama client:', error)
    return false
  }
}
