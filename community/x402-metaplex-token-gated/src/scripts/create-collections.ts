import { config } from 'dotenv'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createCollection, mplCore } from '@metaplex-foundation/mpl-core'
import { generateSigner, createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi'
import { TIER_INFO } from '@/lib/config'
import { parsePrivateKey } from '@/lib/utils'
config({ path: '.env.local' })

async function createCollections() {
  console.log('🚀 Creating Metaplex Core Collections...\n')

  const rpcUrl = process.env.SOLANA_RPC_URL
  const authorityKey = process.env.AUTHORITY_PRIVATE_KEY

  if (!rpcUrl) {
    throw new Error('SOLANA_RPC_URL not set in environment')
  }

  if (!authorityKey) {
    throw new Error('AUTHORITY_PRIVATE_KEY not set in environment')
  }

  const umi = createUmi(rpcUrl).use(mplCore())

  const secretKey = parsePrivateKey(authorityKey)
  const authorityKeypair = umi.eddsa.createKeypairFromSecretKey(secretKey)

  umi.use(signerIdentity(createSignerFromKeypair(umi, authorityKeypair)))

  console.log(`Authority: ${authorityKeypair.publicKey}`)
  console.log(`Network: ${rpcUrl}\n`)

  const collections: Record<string, string> = {}

  for (const [tier, info] of Object.entries(TIER_INFO)) {
    console.log(`Creating ${tier} collection...`)

    const collection = generateSigner(umi)

    await createCollection(umi, {
      collection,
      name: info.name,
      uri: '',
    }).sendAndConfirm(umi)

    collections[tier] = collection.publicKey

    console.log(`✅ ${tier}: ${collection.publicKey}`)
    console.log(`   Explorer: https://explorer.solana.com/address/${collection.publicKey}?cluster=devnet\n`)
  }

  console.log('\n📋 Add these to your .env.local:\n')
  console.log(`NEXT_PUBLIC_BRONZE_COLLECTION=${collections.bronze}`)
  console.log(`NEXT_PUBLIC_SILVER_COLLECTION=${collections.silver}`)
  console.log(`NEXT_PUBLIC_GOLD_COLLECTION=${collections.gold}`)
  console.log('\n✨ Collections created successfully!')
}

createCollections().catch((error) => {
  console.error('❌ Error creating collections:', error)
  process.exit(1)
})
