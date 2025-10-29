import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_RPC_ENDPOINT: z.string().url().default('https://api.devnet.solana.com'),
  NEXT_PUBLIC_USDC_DEVNET_MINT: z.string().default('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'),
  NEXT_PUBLIC_TREASURY_ADDRESS: z.string().default('CmGgLQL36Y9ubtTsy2zmE46TAxwCBm66onZmPPhUWNqv'),
  NEXT_PUBLIC_PAYMENT_AMOUNT_USD: z.coerce.number().default(0.01),
  NEXT_PUBLIC_USDC_DECIMALS: z.coerce.number().default(6),
  NEXT_PUBLIC_FEE_PAYER: z.string().default('2wKupLR9q6wXYppw8Gr2NvWxKBUqm4PPJKkQfoxHDBg4'),
  FACILITATOR_URL: z.string().url().default('http://localhost:3000/api/facilitator'),
  COOKIE_NAME: z.string().default('solana_payment_verified'),
  COOKIE_MAX_AGE: z.coerce.number().default(86400), // 24 hours
})

export const env = envSchema.parse({
  NEXT_PUBLIC_RPC_ENDPOINT: process.env.NEXT_PUBLIC_RPC_ENDPOINT,
  NEXT_PUBLIC_USDC_DEVNET_MINT: process.env.NEXT_PUBLIC_USDC_DEVNET_MINT,
  NEXT_PUBLIC_TREASURY_ADDRESS: process.env.NEXT_PUBLIC_TREASURY_ADDRESS,
  NEXT_PUBLIC_PAYMENT_AMOUNT_USD: process.env.NEXT_PUBLIC_PAYMENT_AMOUNT_USD,
  NEXT_PUBLIC_USDC_DECIMALS: process.env.NEXT_PUBLIC_USDC_DECIMALS,
  NEXT_PUBLIC_FEE_PAYER: process.env.NEXT_PUBLIC_FEE_PAYER,
  FACILITATOR_URL: process.env.NEXT_PUBLIC_FACILITATOR_URL,
  COOKIE_NAME: process.env.NEXT_PUBLIC_COOKIE_NAME,
  COOKIE_MAX_AGE: process.env.NEXT_PUBLIC_COOKIE_MAX_AGE,
})
