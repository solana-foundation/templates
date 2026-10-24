import { execFileSync, execSync } from 'child_process'
import * as fs from 'fs'
import type { GillDeploymentResult } from './types'

import { address, type Address } from '@solana/kit'

export interface GillBuildConfig {
  workingDir?: string
  network?: 'devnet' | 'mainnet' | 'testnet'
  verbose?: boolean
  rpcUrl?: string
}

interface BuildState {
  lastBuildHash: string | null
  lastDeployHash: string | null
}

const buildState: BuildState = {
  lastBuildHash: null,
  lastDeployHash: null,
}

export function getGillSourceHash(config: GillBuildConfig = {}): string {
  const { workingDir = '.' } = config

  try {
    const libPath = `${workingDir}/programs/solana-distributor/src/lib.rs`
    const cargoPath = `${workingDir}/programs/solana-distributor/Cargo.toml`
    const anchorPath = `${workingDir}/Anchor.toml`

    const sources = [
      fs.existsSync(libPath) ? fs.readFileSync(libPath, 'utf8') : '',
      fs.existsSync(cargoPath) ? fs.readFileSync(cargoPath, 'utf8') : '',
      fs.existsSync(anchorPath) ? fs.readFileSync(anchorPath, 'utf8') : '',
    ].join('')

    return Buffer.from(sources).toString('base64')
  } catch {
    return Date.now().toString()
  }
}

export function checkGillProgramIdConsistency(config: GillBuildConfig = {}): {
  consistent: boolean
  declaredId: string | null
  deployedId: string | null
  anchorId: string | null
} {
  const declaredId = getGillDeclaredProgramId(config)
  const deployedId = getGillDeployedProgramId(config)
  const anchorId = getGillAnchorProgramId(config)

  const consistent = declaredId && deployedId && anchorId && declaredId === deployedId && declaredId === anchorId

  return { consistent: !!consistent, declaredId, deployedId, anchorId }
}

export function getGillDeclaredProgramId(config: GillBuildConfig = {}): string | null {
  const { workingDir = '.' } = config

  try {
    const libContent = fs.readFileSync(`${workingDir}/programs/solana-distributor/src/lib.rs`, 'utf8')
    const match = libContent.match(/declare_id!\("([^"]+)"\);/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

export function getGillDeployedProgramId(config: GillBuildConfig = {}): string | null {
  const { workingDir = '.' } = config

  try {
    const output = execSync(`solana address -k ${workingDir}/target/deploy/solana_distributor-keypair.json`, {
      encoding: 'utf8',
    })
    return output.trim()
  } catch {
    return null
  }
}

export function getGillAnchorProgramId(config: GillBuildConfig = {}): string | null {
  const { workingDir = '.' } = config

  try {
    const anchorContent = fs.readFileSync(`${workingDir}/Anchor.toml`, 'utf8')
    const match = anchorContent.match(/solana_distributor = "([^"]+)"/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

export async function buildGillProgramIfNeeded(
  force: boolean = false,
  config: GillBuildConfig = {},
): Promise<GillDeploymentResult> {
  const { workingDir = '.', verbose = false } = config

  try {
    const currentHash = getGillSourceHash(config)

    if (!force && buildState.lastBuildHash === currentHash) {
      console.log('✅ Build is up to date, skipping... (Gill)')
      const programId = getGillDeclaredProgramId(config)
      return { success: true, programId: programId ? address(programId) : undefined }
    }

    console.log('🔨 Building program with Gill...')
    execSync('anchor build', {
      stdio: verbose ? 'inherit' : 'pipe',
      cwd: workingDir,
    })

    buildState.lastBuildHash = currentHash
    const programId = getGillDeclaredProgramId(config)

    console.log('✅ Build completed successfully! (Gill)')
    return { success: true, programId: programId ? address(programId) : undefined }
  } catch (error) {
    console.error('❌ Build failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function deployGillProgram(
  programKeypairPath?: string,
  config: GillBuildConfig = {},
): Promise<GillDeploymentResult> {
  const { workingDir = '.', verbose = false } = config

  try {
    if (programKeypairPath) {
      fs.mkdirSync(`${workingDir}/target/deploy`, { recursive: true })
      fs.copyFileSync(programKeypairPath, `${workingDir}/target/deploy/solana_distributor-keypair.json`)
    }
    const buildResult = await buildGillProgramIfNeeded(false, config)
    if (!buildResult.success) {
      return {
        success: false,
        error: 'Build failed before deployment',
        programId: buildResult.programId,
      }
    }

    console.log('📡 Deploying program with Gill...')
    const deployOutput = execFileSync(
      'anchor',
      ['deploy', ...(config.rpcUrl ? ['--provider.cluster', config.rpcUrl] : [])],
      {
        stdio: verbose ? 'inherit' : 'pipe',
        cwd: workingDir,
        encoding: 'utf8',
      },
    )

    const programIdMatch = deployOutput.match(/Program Id: (\w+)/)
    const programIdStr = programIdMatch ? programIdMatch[1] : getGillDeployedProgramId(config)

    console.log('✅ Program deployed successfully! (Gill)')

    buildState.lastDeployHash = getGillSourceHash(config)

    return {
      success: true,
      programId: programIdStr ? address(programIdStr) : undefined,
    }
  } catch (error) {
    console.error('❌ Deployment failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function ensureGillProgramIdConsistency(
  targetProgramId?: string | Address,
  config: GillBuildConfig = {},
): Promise<boolean> {
  const { workingDir = '.' } = config

  const consistency = checkGillProgramIdConsistency(config)

  const targetProgramIdStr = targetProgramId
    ? typeof targetProgramId === 'string'
      ? targetProgramId
      : targetProgramId
    : undefined

  if (consistency.consistent && !targetProgramIdStr) {
    console.log('✅ Program ID consistency verified! (Gill)')
    return true
  }

  const newProgramId = targetProgramIdStr || consistency.deployedId || consistency.declaredId || consistency.anchorId
  if (!newProgramId) {
    console.error('❌ No valid program ID found to ensure consistency')
    return false
  }

  if (consistency.consistent && targetProgramIdStr && consistency.declaredId === targetProgramIdStr) {
    console.log('✅ Program ID already matches target! (Gill)')
    return true
  }

  console.log('🔧 Updating program ID references... (Gill)')

  try {
    const libPath = `${workingDir}/programs/solana-distributor/src/lib.rs`
    let libContent = fs.readFileSync(libPath, 'utf8')
    libContent = libContent.replace(/declare_id!\(".*"\);/, `declare_id!("${newProgramId}");`)
    fs.writeFileSync(libPath, libContent)
    console.log('   ✅ Updated lib.rs')
  } catch (error) {
    console.error('   ❌ Failed to update lib.rs:', error)
    return false
  }

  try {
    const anchorPath = `${workingDir}/Anchor.toml`
    let anchorContent = fs.readFileSync(anchorPath, 'utf8')
    anchorContent = anchorContent.replace(/solana_distributor = ".*"/, `solana_distributor = "${newProgramId}"`)
    fs.writeFileSync(anchorPath, anchorContent)
    console.log('   ✅ Updated Anchor.toml')
  } catch (error) {
    console.error('   ❌ Failed to update Anchor.toml:', error)
    return false
  }

  console.log('🔄 Rebuilding with updated program ID... (Gill)')
  const buildResult = await buildGillProgramIfNeeded(true, config)

  if (!buildResult.success) {
    console.error('❌ Failed to rebuild after program ID update')
    return false
  }

  console.log('✅ Program ID consistency ensured! (Gill)')
  return true
}

export async function cleanGillBuildArtifacts(config: GillBuildConfig = {}): Promise<void> {
  const { workingDir = '.', verbose = false } = config

  try {
    console.log('🧹 Cleaning build artifacts... (Gill)')
    execSync('anchor clean', {
      stdio: verbose ? 'inherit' : 'pipe',
      cwd: workingDir,
    })
    buildState.lastBuildHash = null
    buildState.lastDeployHash = null
    console.log('✅ Clean completed! (Gill)')
  } catch (error) {
    console.error('❌ Clean failed:', error)
    throw error
  }
}

export function getGillProgramStatus(config: GillBuildConfig = {}): {
  built: boolean
  deployed: boolean
  consistent: boolean
  programId: string | null
} {
  const { workingDir = '.' } = config

  const consistency = checkGillProgramIdConsistency(config)
  const targetExists = fs.existsSync(`${workingDir}/target/deploy/solana_distributor-keypair.json`)
  const idlExists = fs.existsSync(`${workingDir}/target/idl/solana_distributor.json`)

  return {
    built: targetExists && idlExists,
    deployed: !!consistency.deployedId,
    consistent: consistency.consistent,
    programId: consistency.declaredId,
  }
}
