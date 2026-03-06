import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import stakingIdl from "../idl/staking.json";

export type StakingIdl = typeof stakingIdl;

export const STAKING_PROGRAM_ID = new PublicKey(stakingIdl.address);

export const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJe1bRs"
);

export function getStakingProgram(
  connection: Connection,
  wallet: any
): Program {
  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: "confirmed",
    commitment: "confirmed"
  });
  return new Program(stakingIdl as any, provider);
}
