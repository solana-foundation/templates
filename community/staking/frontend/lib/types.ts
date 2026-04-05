import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

export interface StakeAccount {
  point: BN;
  stakedAmount: BN;
  signer: PublicKey;
  bump: number;
  lastUpdateAmount: BN;
  seed: BN;
}

export interface PoolState {
  admin: PublicKey;
  rewardMint: PublicKey;
  rewardRate: BN;
  totalStaked: BN;
  isPaused: boolean;
  bump: number;
}

export const POINTS_PER_TOKEN = 1_000_000;

export function pointsToTokens(points: BN): number {
  return points.toNumber() / POINTS_PER_TOKEN;
}

export function claimableTokens(points: BN): number {
  return Math.floor(points.toNumber() / POINTS_PER_TOKEN);
}

export function shortAddress(addr: PublicKey | string): string {
  const s = addr.toString();
  return `${s.slice(0, 4)}...${s.slice(-4)}`;
}

export function parseAnchorError(err: unknown): string {
  if (!err) return "Unknown error";
  const msg = (err as any)?.message ?? String(err);
  if (msg.includes("InvalidAmount")) return "Amount must be greater than zero";
  if (msg.includes("Unauthorized")) return "Unauthorized: wallet does not own this account";
  if (msg.includes("Overflow")) return "Math overflow – try a smaller amount";
  if (msg.includes("InsufficientFunds") || msg.includes("insufficient lamports"))
    return "Insufficient SOL balance";
  if (msg.includes("AccountNotInitialized")) return "Account not initialized yet";
  if (msg.includes("ConstraintSeeds")) return "PDA mismatch – please reconnect your wallet";
  return msg.length > 120 ? msg.slice(0, 120) + "…" : msg;
}
