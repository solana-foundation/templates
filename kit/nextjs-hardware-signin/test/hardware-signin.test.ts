import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  appendTransactionMessageInstruction,
  blockhash,
  createTransactionMessage,
  generateKeyPairSigner,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  type Address,
} from "@solana/kit";
import { getAddMemoInstruction } from "@solana-program/memo";
import {
  bytesToBase64,
  createSessionToken,
  readSessionToken,
  verifyAuthProof,
} from "../app/lib/auth";

/**
 * Reproduce the client's Sign In With Hardware Wallet flow entirely offline: build a
 * memo transaction carrying a nonce, sign it without touching the network, and
 * return the wire proof the server receives. The transaction is never
 * broadcast, so no RPC or validator is needed — a hardcoded blockhash is enough
 * for the message to compile and sign.
 */
async function signAuthProof(nonce: string) {
  const signer = await generateKeyPairSigner();
  const address = signer.address as Address;

  const memoIx = getAddMemoInstruction({ memo: nonce, signers: [signer] });
  const message = appendTransactionMessageInstruction(
    memoIx,
    setTransactionMessageLifetimeUsingBlockhash(
      {
        blockhash: blockhash("11111111111111111111111111111111"),
        lastValidBlockHeight: 0n,
      },
      setTransactionMessageFeePayerSigner(
        signer,
        createTransactionMessage({ version: 0 })
      )
    )
  );
  const signedTx = await signTransactionMessageWithSigners(message);

  const signature = signedTx.signatures[address];
  if (!signature) throw new Error("payer did not sign");

  return {
    address,
    messageBytesBase64: bytesToBase64(signedTx.messageBytes),
    signatureBase64: bytesToBase64(signature),
  };
}

describe("Sign In With Hardware Wallet", () => {
  it("verifies a correctly signed memo proof", async () => {
    const nonce = "nonce-abc-123";
    const proof = await signAuthProof(nonce);

    const result = await verifyAuthProof(proof, nonce);
    expect(result).toEqual({ ok: true, address: proof.address });
  });

  it("rejects a proof whose nonce does not match", async () => {
    const proof = await signAuthProof("issued-nonce");

    const result = await verifyAuthProof(proof, "different-nonce");
    expect(result.ok).toBe(false);
  });

  it("rejects a tampered signature", async () => {
    const nonce = "nonce-tamper";
    const proof = await signAuthProof(nonce);
    const bytes = Uint8Array.from(atob(proof.signatureBase64), (c) =>
      c.charCodeAt(0)
    );
    bytes[0] ^= 0xff;
    const tampered = { ...proof, signatureBase64: bytesToBase64(bytes) };

    const result = await verifyAuthProof(tampered, nonce);
    expect(result.ok).toBe(false);
  });
});

describe("session token", () => {
  const addr = "11111111111111111111111111111111";

  it("round-trips a signed address", () => {
    expect(readSessionToken(createSessionToken(addr))).toBe(addr);
  });

  it("rejects a forged token whose address was swapped", () => {
    const forged = `HACKER1111111111111111111111111111111111111.${
      createSessionToken(addr).split(".")[1]
    }`;
    expect(readSessionToken(forged)).toBeNull();
  });

  it("rejects a bare address with no MAC", () => {
    expect(readSessionToken(addr)).toBeNull();
  });
});

describe("session secret in production", () => {
  const addr = "11111111111111111111111111111111";
  const savedNodeEnv = process.env.NODE_ENV;
  const savedSecret = process.env.SESSION_SECRET;

  beforeEach(() => {
    process.env.NODE_ENV = "production";
    delete process.env.SESSION_SECRET;
  });

  afterEach(() => {
    process.env.NODE_ENV = savedNodeEnv;
    if (savedSecret === undefined) delete process.env.SESSION_SECRET;
    else process.env.SESSION_SECRET = savedSecret;
  });

  it("refuses to mint a token when SESSION_SECRET is unset", () => {
    expect(() => createSessionToken(addr)).toThrow(/SESSION_SECRET/);
  });

  it("refuses to verify a token when SESSION_SECRET is unset", () => {
    expect(() => readSessionToken(`${addr}.deadbeef`)).toThrow(
      /SESSION_SECRET/
    );
  });

  it("uses SESSION_SECRET to round-trip when it is set", () => {
    process.env.SESSION_SECRET = "prod-secret-value";
    expect(readSessionToken(createSessionToken(addr))).toBe(addr);
  });
});
