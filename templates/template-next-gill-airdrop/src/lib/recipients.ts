/**
 * Recipients Data
 *
 * ⚠️  IMPORTANT: This file contains mock data for development purposes.
 *
 * When you run the deploy-setup script (npx ts-node anchor/scripts/deploy-setup.ts),
 * this file will be automatically updated with:
 * - Real program ID from your deployment
 * - Actual test wallet addresses
 * - Computed merkle root
 * - Current timestamps and metadata
 *
 * The mock data below allows the frontend to work during development
 * before you've set up your actual Solana program deployment.
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

export const RECIPIENTS_DATA: RecipientsFile = {
  airdropId: 'solana-distributor-airdrop-mock',
  description: 'Mock airdrop data for development - will be updated by deploy-setup script',
  merkleRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
  totalAmount: '300000000',
  network: 'devnet',
  programId: 'MockProgramId1111111111111111111111111111111',
  recipients: [
    {
      publicKey: 'MockWallet111111111111111111111111111111111',
      amount: '75000000',
      index: 0,
      description: 'Mock recipient 1 - Sample wallet for development',
    },
    {
      publicKey: 'MockWallet222222222222222222222222222222222',
      amount: '75000000',
      index: 1,
      description: 'Mock recipient 2 - Another sample wallet',
    },
    {
      publicKey: 'MockWallet333333333333333333333333333333333',
      amount: '75000000',
      index: 2,
      description: 'Mock recipient 3 - Third sample wallet',
    },
    {
      publicKey: 'MockWallet444444444444444444444444444444444',
      amount: '75000000',
      index: 3,
      description: 'Mock recipient 4 - Fourth sample wallet',
    },
  ],
  metadata: {
    createdAt: '2024-01-01T00:00:00.000Z',
    version: '1.0.0',
    algorithm: 'keccak256',
    leafFormat: 'recipient_pubkey(32) + amount(8) + is_claimed(1)',
  },
}

export type { RecipientFromJson, RecipientsFile }
