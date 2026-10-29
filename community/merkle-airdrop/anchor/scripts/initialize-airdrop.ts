import { initializeGillAirdropDefault } from '../lib/airdrop-initializer'

async function main() {
  try {
    console.log('🚀 Using modern Kit-based initialization...')
    const result = await initializeGillAirdropDefault()

    if (!result.success) {
      console.error(`💥 Initialization failed: ${result.error}`)
      process.exit(1)
    }

    if (result.alreadyInitialized) {
      console.log('✨ Airdrop was already initialized!')
    } else if (result.verificationFailed) {
      console.log('⚠️  Initialization likely succeeded but verification failed')
      console.log('💡 Check the explorer link above to confirm')
    } else {
      console.log('🎉 Airdrop initialization completed successfully!')
    }

    console.log('\n📋 Next steps:')
    console.log('1. Test claiming with the frontend at http://localhost:3000')
    console.log('2. Or use the claim script with Kit support')

    process.exit(0)
  } catch (error) {
    console.error('💥 Initialization failed:', error)
    process.exit(1)
  }
}

// Execute main function
main()
