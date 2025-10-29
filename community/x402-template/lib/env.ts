import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_RPC_ENDPOINT: z.string().url().default('https://api.devnet.solana.com'),
  NEXT_PUBLIC_USDC_DEVNET_MINT: z.string().default('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'),
  NEXT_PUBLIC_TREASURY_ADDRESS: z.string().default('CmGgLQL36Y9ubtTsy2zmE46TAxwCBm66onZmPPhUWNqv'),
  NEXT_PUBLIC_PAYMENT_AMOUNT_USD: z.coerce.number().default(0.01),
  NEXT_PUBLIC_USDC_DECIMALS: z.coerce.number().default(6),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_RPC_ENDPOINT: process.env.NEXT_PUBLIC_RPC_ENDPOINT,
  NEXT_PUBLIC_USDC_DEVNET_MINT: process.env.NEXT_PUBLIC_USDC_DEVNET_MINT,
  NEXT_PUBLIC_TREASURY_ADDRESS: process.env.NEXT_PUBLIC_TREASURY_ADDRESS,
  NEXT_PUBLIC_PAYMENT_AMOUNT_USD: process.env.NEXT_PUBLIC_PAYMENT_AMOUNT_USD,
  NEXT_PUBLIC_USDC_DECIMALS: process.env.NEXT_PUBLIC_USDC_DECIMALS,
})
