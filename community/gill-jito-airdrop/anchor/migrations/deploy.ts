// Modern Gill-based deployment migration
// This replaces the legacy Anchor provider approach with Gill + Codama

import { runGillDeploymentSetup } from '../scripts/deploy-setup'

/**
 * Gill-based migration that deploys the program using modern Solana tooling
 * This is called by `anchor deploy` and uses our Gill deployment pipeline
 */
export default async function (_provider?: any) {
  console.log('🚀 Running Gill-based deployment migration...\n')

  try {
    // Use our existing Gill deployment setup
    await runGillDeploymentSetup()

    console.log('✅ Gill-based deployment completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// For Anchor compatibility (Anchor expects module.exports)
module.exports = exports.default
