// Public (client-safe) MoneyGram sandbox constants. The secret key lives only on
// the server — see app/api/moneygram-session/route.ts.

export const RAMPS_SDK_ORIGIN =
  process.env.NEXT_PUBLIC_RAMPS_ORIGIN ??
  "https://playground.xramps.moneygram.com";

export const RAMPS_SDK_SCRIPT = `${RAMPS_SDK_ORIGIN}/sdk/index.global.js`;

// Circle USDC mint used as a fallback when the widget does not send tokenAddress.
export const USDC_MINT = {
  devnet: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
  mainnet: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
} as const;
