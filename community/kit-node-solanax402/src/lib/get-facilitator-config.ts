/**
 * Facilitator Configuration - Gill template pattern
 * Uses Zod for type-safe configuration validation
 */

import 'dotenv/config';
import { z } from 'zod';

const FacilitatorConfigSchema = z.object({
  port: z.coerce.number().int().positive(),
  facilitatorPrivateKey: z.string().min(1, 'FACILITATOR_PRIVATE_KEY is required'),
  facilitatorPublicKey: z.string().optional(),
  solanaRpcUrl: z.string().url(),
  solanaWsUrl: z.string().url().optional(),
  databasePath: z.string(),
  usdcMintAddress: z.string(),
  usdcDecimals: z.coerce.number().int().positive(),
  maxPaymentAmount: z.coerce.bigint(),
  nonceExpiryHours: z.coerce.number().int().positive(),
  simulateTransactions: z
    .string()
    .default('true')
    .transform((val) => val !== 'false' && val !== '0' && val !== '')
    .pipe(z.boolean()),
  solanaNetwork: z.enum(['mainnet-beta', 'devnet', 'testnet', 'localnet']),
});

export type FacilitatorConfig = z.infer<typeof FacilitatorConfigSchema>;

let config: FacilitatorConfig | undefined;

export function getFacilitatorConfig(): FacilitatorConfig {
  if (config) {
    return config;
  }

  try {
    config = FacilitatorConfigSchema.parse({
      port: process.env.FACILITATOR_PORT ?? 3001,
      facilitatorPrivateKey: process.env.FACILITATOR_PRIVATE_KEY,
      facilitatorPublicKey: process.env.FACILITATOR_PUBLIC_KEY,
      solanaRpcUrl: process.env.SOLANA_RPC_URL ?? 'https://api.devnet.solana.com',
      solanaWsUrl: process.env.SOLANA_WS_URL ?? 'wss://api.devnet.solana.com',
      databasePath: process.env.DATABASE_PATH ?? './src/facilitator/nonce.db',
      usdcMintAddress: process.env.USDC_MINT_ADDRESS ?? '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
      usdcDecimals: process.env.USDC_DECIMALS ?? 6,
      maxPaymentAmount: process.env.MAX_PAYMENT_AMOUNT ?? '1000000000',
      nonceExpiryHours: process.env.NONCE_EXPIRY_HOURS ?? 24,
      simulateTransactions: process.env.SIMULATE_TRANSACTIONS ?? 'true',
      solanaNetwork: process.env.SOLANA_NETWORK ?? 'devnet',
    });

    return config;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Configuration validation failed:');
      error.issues.forEach((err: z.ZodIssue) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      throw new Error('Invalid configuration. Please check your .env file.');
    }
    throw error;
  }
}
