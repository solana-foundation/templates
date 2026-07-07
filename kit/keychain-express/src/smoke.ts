import assert from "node:assert/strict";

import { getAddMemoInstruction } from "@solana-program/memo";
import { createKeychainSigner } from "@solana/keychain";
import {
  appendTransactionMessageInstruction,
  assertIsTransactionWithinSizeLimit,
  blockhash,
  compileTransaction,
  createSignableMessage,
  createTransactionMessage,
  generateKeyPair,
  getAddressFromPublicKey,
  pipe,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  verifySignature,
} from "@solana/kit";

const keyPair = await generateKeyPair();
const signer = await createKeychainSigner({ backend: "memory", keyPair });

assert.equal(signer.address, await getAddressFromPublicKey(keyPair.publicKey));
assert.equal(await signer.isAvailable(), true);

const message = createSignableMessage("keychain smoke test");
const [messageSignatures] = await signer.signMessages([message]);
const messageSignature = messageSignatures[signer.address];
assert.ok(messageSignature);
assert.equal(
  await verifySignature(keyPair.publicKey, messageSignature, message.content),
  true
);

const transactionMessage = pipe(
  createTransactionMessage({ version: 0 }),
  (tx) => setTransactionMessageFeePayer(signer.address, tx),
  (tx) =>
    setTransactionMessageLifetimeUsingBlockhash(
      {
        blockhash: blockhash("11111111111111111111111111111111"),
        lastValidBlockHeight: 0n,
      },
      tx
    ),
  (tx) =>
    appendTransactionMessageInstruction(
      getAddMemoInstruction({ memo: "hello keychain" }),
      tx
    )
);
const transaction = compileTransaction(transactionMessage);
assertIsTransactionWithinSizeLimit(transaction);

const [transactionSignatures] = await signer.signTransactions([transaction]);
const transactionSignature = transactionSignatures[signer.address];
assert.ok(transactionSignature);
assert.equal(transactionSignature.length, 64);

console.log(`smoke ok — signed as ${signer.address}`);
