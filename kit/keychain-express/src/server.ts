import { createKeychainSigner } from "@solana/keychain";
import {
  createSignableMessage,
  getBase58Decoder,
  getBase64Encoder,
  getBase64EncodedWireTransaction,
  getTransactionDecoder,
  type Transaction,
  type TransactionWithinSizeLimit,
  type TransactionWithLifetime,
} from "@solana/kit";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import { signerConfigFromEnv } from "./config.js";

const backend = process.env.KEYCHAIN_BACKEND ?? "memory";
const signer = await createKeychainSigner(await signerConfigFromEnv());

const app = express();
app.use(express.json());

app.get("/health", async (_req, res) => {
  res.json({
    available: await signer.isAvailable(),
    backend,
    address: signer.address,
  });
});

app.get("/address", (_req, res) => {
  res.json({ address: signer.address });
});

app.post("/sign/message", async (req, res) => {
  const message: unknown = req.body?.message;
  if (typeof message !== "string" || message.length === 0) {
    res.status(400).json({ error: "Body must be { message: string }" });
    return;
  }
  const [signatures] = await signer.signMessages([
    createSignableMessage(message),
  ]);
  res.json({
    address: signer.address,
    signature: getBase58Decoder().decode(signatures[signer.address]),
  });
});

app.post("/sign/transaction", async (req, res) => {
  const wireTransaction: unknown = req.body?.transaction;
  if (typeof wireTransaction !== "string" || wireTransaction.length === 0) {
    res.status(400).json({
      error: "Body must be { transaction: string } (base64 wire transaction)",
    });
    return;
  }
  const transactionBytes = getBase64Encoder().encode(wireTransaction);
  const transaction = getTransactionDecoder().decode(
    transactionBytes
  ) as Transaction & TransactionWithinSizeLimit & TransactionWithLifetime;
  const [signatures] = await signer.signTransactions([transaction]);
  const signedTransaction = {
    ...transaction,
    signatures: { ...transaction.signatures, ...signatures },
  };
  res.json({
    address: signer.address,
    signature: getBase58Decoder().decode(signatures[signer.address]),
    transaction: getBase64EncodedWireTransaction(signedTransaction),
  });
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ error: error.message });
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`Keychain signing API listening on http://localhost:${port}`);
  console.log(`Backend: ${backend} — signer address: ${signer.address}`);
});
