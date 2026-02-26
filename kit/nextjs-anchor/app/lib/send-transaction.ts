import {
  createTransactionMessage,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstructions,
  signAndSendTransactionMessageWithSigners,
  getBase58Decoder,
  type Instruction,
  type TransactionSigner,
} from "@solana/kit";
import type { SolanaClient } from "./solana-client";

export async function sendTransaction({
  rpc,
  instructions,
  feePayer,
}: {
  rpc: SolanaClient["rpc"];
  instructions: readonly Instruction[];
  feePayer: TransactionSigner;
}): Promise<string> {
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

  const base = createTransactionMessage({ version: 0 });
  const withPayer = setTransactionMessageFeePayerSigner(feePayer, base);
  const withLifetime = setTransactionMessageLifetimeUsingBlockhash(
    latestBlockhash,
    withPayer
  );
  const withInstructions = appendTransactionMessageInstructions(
    instructions,
    withLifetime
  );

  const sigBytes =
    await signAndSendTransactionMessageWithSigners(withInstructions);
  return getBase58Decoder().decode(sigBytes);
}
