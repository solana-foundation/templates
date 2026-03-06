import { PublicKey } from "@solana/web3.js";
import { STAKING_PROGRAM_ID } from "./anchor";

export function findPoolStatePda(rewardMint: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("pool_state"), rewardMint.toBuffer()],
    STAKING_PROGRAM_ID
  )[0];
}

export function findRewardVaultPda(rewardMint: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("reward_vault"), rewardMint.toBuffer()],
    STAKING_PROGRAM_ID
  )[0];
}

export function findStakeAccountPda(user: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("client1"), user.toBuffer()],
    STAKING_PROGRAM_ID
  )[0];
}

export function findVaultPda(user: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), user.toBuffer()],
    STAKING_PROGRAM_ID
  )[0];
}

export function findMintAuthorityPda(): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("mint_authority")],
    STAKING_PROGRAM_ID
  )[0];
}
