export const X402_CONFIG = {
  USDC_DEVNET_MINT: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
  TREASURY_ADDRESS: 'CmGgLQL36Y9ubtTsy2zmE46TAxwCBm66onZmPPhUWNqv',
  REQUIRED_AMOUNT: '10000',
  FEE_PAYER: '2wKupLR9q6wXYppw8Gr2NvWxKBUqm4PPJKkQfoxHDBg4',
  FACILITATOR_BASE_URL: process.env.FACILITATOR_URL || 'http://localhost:3000/api/facilitator',
  COOKIE_NAME: 'solana_payment_verified',
  COOKIE_MAX_AGE: 86400, // 24 hours
} as const
