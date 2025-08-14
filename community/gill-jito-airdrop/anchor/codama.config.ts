import { createFromRoot } from 'codama'
import { rootNodeFromAnchor, AnchorIdl } from '@codama/nodes-from-anchor'
import { renderJavaScriptVisitor } from '@codama/renderers'
import { visit } from '@codama/visitors-core'
import anchorIdl from './target/idl/solana_distributor.json'
import path from 'path'
import { execSync } from 'child_process'
import * as fs from 'fs'

/**
 * Codama Configuration for Solana Distributor Program
 *
 * This configuration generates TypeScript clients from the Anchor IDL
 * using Codama's code generation capabilities. The generated clients
 * will be compatible with Gill (Solana Kit) instead of @solana/web3.js v1.
 */

async function generateProgramId(): Promise<string> {
  console.log('🔑 Generating new program ID...')

  try {
    // Generate new keypair for program ID
    const keypairPath = path.join(__dirname, 'program-keypair.json')

    // Remove existing keypair if it exists
    if (fs.existsSync(keypairPath)) {
      fs.unlinkSync(keypairPath)
    }

    // Generate new keypair
    execSync(`solana-keygen new --no-bip39-passphrase --silent --outfile ${keypairPath}`)

    // Get the public key
    const programId = execSync(`solana-keygen pubkey ${keypairPath}`, { encoding: 'utf8' }).trim()

    console.log(`✅ Generated new program ID: ${programId}`)

    // Update lib.rs
    const libRsPath = path.join(__dirname, 'programs', 'solana-distributor', 'src', 'lib.rs')
    let libRsContent = fs.readFileSync(libRsPath, 'utf8')

    // Replace the declare_id! line
    libRsContent = libRsContent.replace(/declare_id!\(".*"\);/, `declare_id!("${programId}");`)

    fs.writeFileSync(libRsPath, libRsContent)
    console.log('✅ Updated lib.rs with new program ID')

    // Update Anchor.toml
    const anchorTomlPath = path.join(__dirname, 'Anchor.toml')
    let anchorTomlContent = fs.readFileSync(anchorTomlPath, 'utf8')

    // Replace the program ID in Anchor.toml
    anchorTomlContent = anchorTomlContent.replace(/solana_distributor = ".*"/, `solana_distributor = "${programId}"`)

    fs.writeFileSync(anchorTomlPath, anchorTomlContent)
    console.log('✅ Updated Anchor.toml with new program ID')

    return programId
  } catch (error) {
    console.error('❌ Error generating program ID:', error)
    throw error
  }
}

/**
 * Check if the current program ID is valid
 */
function isValidProgramId(programId: string): boolean {
  // Check if it's the placeholder or invalid length
  return programId !== '111111111111111111111111111111111111' && programId.length === 44
}

async function generateClients() {
  console.log('🚀 Starting enhanced Codama client generation...')

  try {
    // Check if program ID is valid before building
    const libRsPath = path.join(__dirname, 'programs', 'solana-distributor', 'src', 'lib.rs')

    if (fs.existsSync(libRsPath)) {
      const libRsContent = fs.readFileSync(libRsPath, 'utf8')
      const programIdMatch = libRsContent.match(/declare_id!\("(.*)"\);/)

      if (!programIdMatch || !isValidProgramId(programIdMatch[1])) {
        console.log('⚠️  Invalid or placeholder program ID detected')
        await generateProgramId()

        // Rebuild after program ID change
        console.log('🔨 Rebuilding Anchor program with new ID...')
        execSync('anchor build', { stdio: 'inherit', cwd: __dirname })
      } else {
        console.log(`✅ Valid program ID found: ${programIdMatch[1]}`)
      }
    }

    // Convert Anchor IDL to Codama tree
    console.log('📝 Converting Anchor IDL to Codama tree...')
    const codama = createFromRoot(rootNodeFromAnchor(anchorIdl as AnchorIdl))

    // Define client generation targets
    const clients = [
      {
        type: 'TypeScript',
        dir: path.join(__dirname, 'generated', 'clients', 'ts'),
        renderVisitor: renderJavaScriptVisitor,
      },
    ]

    // Generate clients
    for (const client of clients) {
      console.log(`⚡ Generating ${client.type} client in ${client.dir}...`)

      await visit(codama.getRoot(), await client.renderVisitor(client.dir))

      console.log(`✅ Successfully generated ${client.type} client!`)
    }

    console.log('🎉 All clients generated successfully!')
    console.log('📁 Generated files location: anchor/generated/clients/')
  } catch (error) {
    console.error('❌ Error generating clients:', error)
    throw error
  }
}

// Export the configuration for programmatic use
export const codamaConfig = {
  idl: anchorIdl,
  outputDir: path.join(__dirname, 'generated', 'clients'),
  generateClients,
}

// Run generation if this file is executed directly
if (require.main === module) {
  generateClients().catch(console.error)
}

export default generateClients
