import {
  address,
  appendTransactionMessageInstruction,
  blockhash,
  compileTransaction,
  createTransactionMessage,
  getBase58Decoder,
  getBase58Encoder,
  getBase64Encoder,
  getBase64EncodedWireTransaction,
  getCompiledTransactionMessageDecoder,
  getTransactionDecoder,
  pipe,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  type Address,
} from "@solana/kit";

const MEMO_PROGRAM_ADDRESS = address(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

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
      appendTransactionMessageInstruction(
        {
          programAddress: MEMO_PROGRAM_ADDRESS,
          data: new TextEncoder().encode(memo),
        },
        tx
      )
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
    ? new TextDecoder().decode(memoInstruction.data)
    : "";
  const signatureBytes = transaction.signatures[feePayer];
  let signatureValid = false;
  if (signatureBytes) {
    const publicKey = await crypto.subtle.importKey(
      "raw",
      new Uint8Array(getBase58Encoder().encode(feePayer)),
      "Ed25519",
      true,
      ["verify"]
    );
    signatureValid = await crypto.subtle.verify(
      "Ed25519",
      publicKey,
      new Uint8Array(signatureBytes),
      new Uint8Array(transaction.messageBytes)
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
