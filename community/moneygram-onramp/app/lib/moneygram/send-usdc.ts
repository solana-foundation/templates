import { address, type TransactionSigner } from "@solana/kit";
import type { AppClient } from "../solana-client";
import type { OnChainTransaction } from "./types";
import { USDC_MINT } from "./config";

/**
 * Convert a decimal token amount (e.g. "12.50") to base units without float drift.
 * The widget sends the exact amount as a string — never round it through a Number.
 */
export function toBaseUnits(amount: string, decimals: number): bigint {
  const [whole, frac = ""] = amount.split(".");
  const fracPadded = frac.padEnd(decimals, "0").slice(0, decimals);
  return (
    BigInt(whole || "0") * 10n ** BigInt(decimals) + BigInt(fracPadded || "0")
  );
}

/**
 * Signs and broadcasts the USDC cash-out transfer the MoneyGram widget requests,
 * returning the transaction signature.
 *
 * The entire on-chain transfer is a single call on the kit plugin client:
 * `transferToATA` derives both associated token accounts, adds an idempotent
 * create-ATA instruction for the recipient, and the client handles compute
 * budget, blockhash lifetime, wallet signing, and send + confirm.
 */
export async function sendUsdc(
  client: AppClient,
  signer: TransactionSigner,
  tx: OnChainTransaction
): Promise<string> {
  const mint = address(tx.tokenAddress ?? USDC_MINT.devnet);
  const decimals = tx.tokenDecimals ?? 6;

  const { context } = await client.token.instructions
    .transferToATA({
      mint,
      authority: signer,
      recipient: address(tx.to),
      amount: toBaseUnits(tx.amount, decimals),
      decimals,
    })
    .sendTransaction();

  return context.signature;
}
