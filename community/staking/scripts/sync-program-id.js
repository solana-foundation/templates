const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const { Keypair } = require('@solana/web3.js')

const ROOT = path.join(__dirname, '..')
const KEYPAIR_PATH = path.join(ROOT, 'target', 'deploy', 'staking_program-keypair.json')
const LIB_RS_PATH = path.join(ROOT, 'programs', 'staking-program', 'src', 'lib.rs')
const ANCHOR_TOML_PATH = path.join(ROOT, 'Anchor.toml')
const TARGET_IDL_PATH = path.join(ROOT, 'target', 'idl', 'staking_program.json')
const TARGET_TYPES_PATH = path.join(ROOT, 'target', 'types', 'staking_program.ts')
const APP_IDL_PATH = path.join(ROOT, 'app', 'types', 'staking_program.json')
const APP_TYPES_PATH = path.join(ROOT, 'app', 'types', 'staking_program.ts')
const APP_ENV_EXAMPLE_PATH = path.join(ROOT, 'app', '.env.example')
const APP_ENV_LOCAL_PATH = path.join(ROOT, 'app', '.env.local')

function readArg(flag) {
  const idx = process.argv.indexOf(flag)
  if (idx === -1 || idx + 1 >= process.argv.length) return null
  return process.argv[idx + 1]
}

function getNetworkConfig() {
  const network = readArg('--network') || process.env.STAKING_NETWORK || 'devnet'

  if (network === 'localnet') {
    return {
      network,
      rpcUrl: 'http://127.0.0.1:8899',
      deployCommand: 'anchor deploy',
    }
  }

  if (network === 'devnet') {
    return {
      network,
      rpcUrl: 'https://api.devnet.solana.com',
      deployCommand: 'anchor deploy --provider.cluster devnet',
    }
  }

  throw new Error(`Unsupported network "${network}". Use "devnet" or "localnet".`)
}

function ensureBuildArtifacts() {
  if (fs.existsSync(KEYPAIR_PATH)) return

  console.log('Program keypair missing. Running anchor build to generate deploy artifacts...')
  execSync('anchor build', { cwd: ROOT, stdio: 'inherit' })
}

function getProgramIdFromKeypair() {
  const secretKey = JSON.parse(fs.readFileSync(KEYPAIR_PATH, 'utf8'))
  const keypair = Keypair.fromSecretKey(Uint8Array.from(secretKey))
  return keypair.publicKey.toBase58()
}

function replaceInFile(filePath, matcher, replacement) {
  const current = fs.readFileSync(filePath, 'utf8')
  const next = current.replace(matcher, replacement)
  if (next === current) {
    return false
  }
  fs.writeFileSync(filePath, next)
  return true
}

function syncRustAndAnchorConfig(programId) {
  replaceInFile(LIB_RS_PATH, /declare_id!\(".*"\);/, `declare_id!("${programId}");`)
  replaceInFile(ANCHOR_TOML_PATH, /staking_program = ".*"/, `staking_program = "${programId}"`)
}

function rebuildProgram() {
  console.log('Rebuilding program with synced program ID...')
  execSync('anchor build', { cwd: ROOT, stdio: 'inherit' })
}

function syncClientArtifacts(programId) {
  fs.copyFileSync(TARGET_IDL_PATH, APP_IDL_PATH)
  fs.copyFileSync(TARGET_TYPES_PATH, APP_TYPES_PATH)
  execSync('pnpm exec prettier app/types/staking_program.ts --write', { cwd: ROOT, stdio: 'inherit' })
  console.log(`Copied IDL and types for ${programId}`)
}

function writeAppEnv(programId, networkConfig) {
  const contents = [
    `NEXT_PUBLIC_PROGRAM_ID=${programId}`,
    `NEXT_PUBLIC_SOLANA_NETWORK=${networkConfig.network}`,
    `NEXT_PUBLIC_RPC_URL=${networkConfig.rpcUrl}`,
    '',
  ].join('\n')

  fs.writeFileSync(APP_ENV_LOCAL_PATH, contents)
}

function main() {
  ensureBuildArtifacts()

  const networkConfig = getNetworkConfig()
  const programId = getProgramIdFromKeypair()
  console.log(`Synced program ID: ${programId}`)
  console.log(`Frontend/default runtime network: ${networkConfig.network}`)

  syncRustAndAnchorConfig(programId)
  rebuildProgram()
  syncClientArtifacts(programId)
  writeAppEnv(programId, networkConfig)

  console.log('Updated files:')
  console.log('- programs/staking-program/src/lib.rs')
  console.log('- Anchor.toml')
  console.log('- app/types/staking_program.json')
  console.log('- app/types/staking_program.ts')
  console.log('- app/.env.local')
  console.log(`Next deploy command: ${networkConfig.deployCommand}`)
}

main()
