import {
  getAddMemoInstruction,
  getAddMemoInstructionDataDecoder,
} from "@solana-program/memo";
import {
  appendTransactionMessageInstruction,
  blockhash,
  compileTransaction,
  createTransactionMessage,
  getBase58Decoder,
  getBase64Encoder,
  getBase64EncodedWireTransaction,
  getCompiledTransactionMessageDecoder,
  getPublicKeyFromAddress,
  getTransactionDecoder,
  pipe,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  verifySignature,
  type Address,
} from "@solana/kit";

const DEMO_BLOCKHASH = blockhash("11111111111111111111111111111111");

export function buildDemoTransaction(feePayer: Address, memo: string): string {
  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayer(feePayer, tx),
    (tx) =>
      setTransactionMessageLifetimeUsingBlockhash(
        { blockhash: DEMO_BLOCKHASH, lastValidBlockHeight: BigInt(0) },
        tx
      ),
    (tx) =>
      appendTransactionMessageInstruction(getAddMemoInstruction({ memo }), tx)
  );
  return getBase64EncodedWireTransaction(
    compileTransaction(transactionMessage)
  );
}

export type DecodedSignedTransaction = {
  feePayer: string;
  blockhash: string;
  memo: string;
  signature: string;
  signatureValid: boolean;
};

export async function decodeSignedTransaction(
  wireTransaction: string
): Promise<DecodedSignedTransaction> {
  const transaction = getTransactionDecoder().decode(
    new Uint8Array(getBase64Encoder().encode(wireTransaction))
  );
  const compiled = getCompiledTransactionMessageDecoder().decode(
    transaction.messageBytes
  );
  if (compiled.version === 1) {
    throw new Error("v1 transaction messages are not supported by this demo");
  }
  const feePayer = compiled.staticAccounts[0];
  const memoInstruction = compiled.instructions[0];
  const memo = memoInstruction?.data
    ? getAddMemoInstructionDataDecoder().decode(memoInstruction.data).memo
    : "";
  const signatureBytes = transaction.signatures[feePayer];
  let signatureValid = false;
  if (signatureBytes) {
    const publicKey = await getPublicKeyFromAddress(feePayer);
    signatureValid = await verifySignature(
      publicKey,
      signatureBytes,
      transaction.messageBytes
    );
  }
  return {
    feePayer,
    blockhash: compiled.lifetimeToken,
    memo,
    signature: signatureBytes ? getBase58Decoder().decode(signatureBytes) : "",
    signatureValid,
  };
}
