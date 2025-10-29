import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_RPC_ENDPOINT: z.string().url().default('https://api.devnet.solana.com'),
  NEXT_PUBLIC_USDC_DEVNET_MINT: z.string().default('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'),
  NEXT_PUBLIC_TREASURY_ADDRESS: z.string().default('CmGgLQL36Y9ubtTsy2zmE46TAxwCBm66onZmPPhUWNqv'),
  NEXT_PUBLIC_PAYMENT_AMOUNT_USD: z.coerce.number().default(0.01),
  NEXT_PUBLIC_USDC_DECIMALS: z.coerce.number().default(6),
  NEXT_PUBLIC_FEE_PAYER: z.string().default('2wKupLR9q6wXYppw8Gr2NvWxKBUqm4PPJKkQfoxHDBg4'),
  NEXT_PUBLIC_FACILITATOR_URL: z.url().default('http://localhost:3000/api/facilitator'),
  NEXT_PUBLIC_COOKIE_NAME: z.string().default('solana_payment_verified'),
  NEXT_PUBLIC_COOKIE_MAX_AGE: z.coerce.number().default(86400), // 24 hours
  NEXT_PUBLIC_PAYMENT_SCHEME: z.string().default('exact'),
  NEXT_PUBLIC_NETWORK: z
    .enum(['solana-devnet', 'solana-mainnet-beta', 'solana-testnet', 'solana-localnet'])
    .default('solana-devnet'),
  NEXT_PUBLIC_PAYMENT_DESCRIPTION: z.string().default('Access to protected content'),
  NEXT_PUBLIC_PAYMENT_TIMEOUT_SECONDS: z.coerce.number().default(60),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_RPC_ENDPOINT: process.env.NEXT_PUBLIC_RPC_ENDPOINT,
  NEXT_PUBLIC_USDC_DEVNET_MINT: process.env.NEXT_PUBLIC_USDC_DEVNET_MINT,
  NEXT_PUBLIC_TREASURY_ADDRESS: process.env.NEXT_PUBLIC_TREASURY_ADDRESS,
  NEXT_PUBLIC_PAYMENT_AMOUNT_USD: process.env.NEXT_PUBLIC_PAYMENT_AMOUNT_USD,
  NEXT_PUBLIC_USDC_DECIMALS: process.env.NEXT_PUBLIC_USDC_DECIMALS,
  NEXT_PUBLIC_FEE_PAYER: process.env.NEXT_PUBLIC_FEE_PAYER,
  NEXT_PUBLIC_FACILITATOR_URL: process.env.NEXT_PUBLIC_FACILITATOR_URL,
  NEXT_PUBLIC_COOKIE_NAME: process.env.NEXT_PUBLIC_COOKIE_NAME,
  NEXT_PUBLIC_COOKIE_MAX_AGE: process.env.NEXT_PUBLIC_COOKIE_MAX_AGE,
  NEXT_PUBLIC_PAYMENT_SCHEME: process.env.NEXT_PUBLIC_PAYMENT_SCHEME,
  NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK,
  NEXT_PUBLIC_PAYMENT_DESCRIPTION: process.env.NEXT_PUBLIC_PAYMENT_DESCRIPTION,
  NEXT_PUBLIC_PAYMENT_TIMEOUT_SECONDS: process.env.NEXT_PUBLIC_PAYMENT_TIMEOUT_SECONDS,
})
