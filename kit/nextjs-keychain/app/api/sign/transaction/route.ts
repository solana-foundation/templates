import {
  getBase58Decoder,
  getBase64Encoder,
  getBase64EncodedWireTransaction,
  getTransactionDecoder,
  type Transaction,
  type TransactionWithinSizeLimit,
  type TransactionWithLifetime,
} from "@solana/kit";

import { getSigner } from "@/app/lib/signer";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const wireTransaction: unknown = body?.transaction;
  const backend: unknown = body?.backend;
  if (typeof wireTransaction !== "string" || wireTransaction.length === 0) {
    return Response.json(
      {
        error:
          "Body must be { transaction: string, backend?: string } (base64 wire transaction)",
      },
      { status: 400 }
    );
  }
  let signer;
  try {
    signer = await getSigner(typeof backend === "string" ? backend : undefined);
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 400 });
  }
  try {
    const transactionBytes = getBase64Encoder().encode(wireTransaction);
    const transaction = getTransactionDecoder().decode(
      transactionBytes
    ) as Transaction & TransactionWithinSizeLimit & TransactionWithLifetime;
    const [signatures] = await signer.signTransactions([transaction]);
    const signedTransaction = {
      ...transaction,
      signatures: { ...transaction.signatures, ...signatures },
    };
    return Response.json({
      address: signer.address,
      signature: getBase58Decoder().decode(signatures[signer.address]),
      transaction: getBase64EncodedWireTransaction(signedTransaction),
    });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
