import { address, type Address } from "@solana/kit";
import { TOKEN_PROGRAM_ADDRESS } from "@solana-program/token";

export { TOKEN_PROGRAM_ADDRESS };

export const DEFAULT_DECIMALS = 6;

// The merchant whose plans this app offers. Set NEXT_PUBLIC_MERCHANT_ADDRESS
// after seeding a plan with `npm run create-plan`.
const merchantEnv = process.env.NEXT_PUBLIC_MERCHANT_ADDRESS;
export const MERCHANT_ADDRESS: Address | null = merchantEnv
  ? address(merchantEnv)
  : null;
