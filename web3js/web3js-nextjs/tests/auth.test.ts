import { compileOffchainMessageV1Envelope } from "@solana/kit";
import type {
  SolanaSignInInput,
  SolanaSignInOutput,
} from "@solana/wallet-adapter";
import { createSignInMessageText } from "@solana/wallet-standard-util";
import { Keypair } from "@solana/web3.js";
import { afterEach, beforeAll, describe, expect, test, vi } from "vitest";
import {
  consumeNonce,
  issueNonce,
  NONCE_TTL_MS,
} from "../app/lib/auth/nonce-store";
import {
  createSession,
  decodeSession,
  encodeSession,
  getAppUrl,
  getAuthSecret,
  isSameOrigin,
} from "../app/lib/auth/session";
import {
  ISSUED_AT_MAX_AGE_MS,
  verifySignInRequest,
} from "../app/lib/auth/siws";
import { decodeSignInRequest, encodeSignInRequest } from "../app/lib/auth/wire";

const DOMAIN = "localhost:3000";
const SECRET = "test-secret-that-is-at-least-32-characters-long";

let wallet: Keypair;
let other: Keypair;

beforeAll(async () => {
  wallet = await Keypair.generate();
  other = await Keypair.generate();
});

function createInput(overrides: Partial<SolanaSignInInput> = {}) {
  return {
    domain: DOMAIN,
    address: wallet.publicKey.toBase58(),
    statement: "Sign in to the Web3.js v3 starter.",
    uri: `http://${DOMAIN}`,
    version: "1",
    nonce: issueNonce(),
    issuedAt: new Date().toISOString(),
    ...overrides,
  } satisfies SolanaSignInInput;
}

async function signPlain(
  input: ReturnType<typeof createInput>,
  signer = wallet
): Promise<SolanaSignInOutput> {
  const signedMessage = new TextEncoder().encode(
    createSignInMessageText(input)
  );
  return {
    account: {
      address: input.address,
      publicKey: signer.publicKey.toBytes(),
      chains: [],
      features: [],
    },
    signedMessage,
    signature: await signer.signBytes(signedMessage),
  };
}

async function signOffchain(
  input: ReturnType<typeof createInput>
): Promise<SolanaSignInOutput> {
  const { content } = compileOffchainMessageV1Envelope({
    version: 1,
    requiredSignatories: [{ address: wallet.publicKey.toBase58() }],
    content: createSignInMessageText(input),
  });
  const signedMessage = new Uint8Array(content);
  return {
    account: {
      address: input.address,
      publicKey: wallet.publicKey.toBytes(),
      chains: [],
      features: [],
    },
    signedMessage,
    signature: await wallet.signBytes(signedMessage),
    signedMessageFormat: { kind: "offchainMessage", messageVersion: 1 },
  };
}

function verify(
  input: SolanaSignInInput,
  output: SolanaSignInOutput,
  now?: number
) {
  const body = JSON.parse(JSON.stringify(encodeSignInRequest(input, output)));
  return verifySignInRequest({
    ...decodeSignInRequest(body),
    expectedDomain: DOMAIN,
    consumeNonce,
    now,
  });
}

describe("verifySignInRequest", () => {
  test("accepts a plain-text SIWS sign-in", async () => {
    const input = createInput();
    expect(await verify(input, await signPlain(input))).toEqual({
      ok: true,
      address: wallet.publicKey.toBase58(),
    });
  });

  test("accepts a SIWS 1.1 off-chain message sign-in", async () => {
    const input = createInput();
    expect(await verify(input, await signOffchain(input))).toEqual({
      ok: true,
      address: wallet.publicKey.toBase58(),
    });
  });

  test("rejects a replayed nonce", async () => {
    const input = createInput();
    const output = await signPlain(input);
    expect((await verify(input, output)).ok).toBe(true);
    expect(await verify(input, output)).toMatchObject({
      ok: false,
      error: expect.stringContaining("Nonce"),
    });
  });

  test("rejects a nonce the server never issued", async () => {
    const input = createInput({ nonce: "0123456789abcdef" });
    expect((await verify(input, await signPlain(input))).ok).toBe(false);
  });

  test("rejects a message for another domain", async () => {
    const input = createInput({ domain: "evil.example" });
    expect(await verify(input, await signPlain(input))).toMatchObject({
      ok: false,
      error: expect.stringContaining("domain"),
    });
  });

  test("rejects a stale issuedAt", async () => {
    const input = createInput();
    const output = await signPlain(input);
    const later = Date.now() + ISSUED_AT_MAX_AGE_MS + 1000;
    expect(await verify(input, output, later)).toMatchObject({
      ok: false,
      error: expect.stringContaining("issuedAt"),
    });
  });

  test("rejects a tampered signature", async () => {
    const input = createInput();
    const output = await signPlain(input);
    const signature = new Uint8Array(output.signature);
    signature[0] ^= 1;
    expect(await verify(input, { ...output, signature })).toMatchObject({
      ok: false,
      error: expect.stringContaining("signature"),
    });
  });

  test("rejects an input that differs from the signed message", async () => {
    const input = createInput();
    const output = await signPlain(input);
    expect(
      (await verify({ ...input, statement: "Something else" }, output)).ok
    ).toBe(false);
  });

  test("rejects an account that claims another wallet's address", async () => {
    const input = createInput({ address: wallet.publicKey.toBase58() });
    const output = await signPlain(input, other);
    expect(await verify(input, output)).toMatchObject({
      ok: false,
      error: expect.stringContaining("signature"),
    });
  });

  test("rejects an off-chain sign-in for a different requested address", async () => {
    const input = createInput();
    const output = await signOffchain(input);
    expect(
      (await verify({ ...input, address: other.publicKey.toBase58() }, output))
        .ok
    ).toBe(false);
  });
});

describe("malformed sign-in bytes", () => {
  test("returns a failure instead of throwing on a short signature", async () => {
    const input = createInput();
    const output = await signPlain(input);
    const result = await verifySignInRequest({
      input,
      output: { ...output, signature: output.signature.slice(0, 63) },
      expectedDomain: DOMAIN,
      consumeNonce,
    });
    expect(result).toMatchObject({
      ok: false,
      error: expect.stringContaining("signature"),
    });
  });

  test("rejects wrong-length signatures and public keys on the wire", async () => {
    const input = createInput();
    const output = await signPlain(input);
    const body = encodeSignInRequest(input, output);
    const shortSignature = encodeSignInRequest(input, {
      ...output,
      signature: output.signature.slice(0, 63),
    });
    const longPublicKey = encodeSignInRequest(input, {
      ...output,
      account: {
        ...output.account,
        publicKey: new Uint8Array([...output.account.publicKey, 0]),
      },
    });

    expect(() => decodeSignInRequest(body)).not.toThrow();
    expect(() => decodeSignInRequest(shortSignature)).toThrow("64 bytes");
    expect(() => decodeSignInRequest(longPublicKey)).toThrow("32 bytes");
  });
});

describe("nonce store", () => {
  test("nonces are single-use", () => {
    const nonce = issueNonce();
    expect(consumeNonce(nonce)).toBe(true);
    expect(consumeNonce(nonce)).toBe(false);
  });

  test("nonces expire", () => {
    const now = Date.now();
    const nonce = issueNonce(now);
    expect(consumeNonce(nonce, now + NONCE_TTL_MS + 1)).toBe(false);
  });
});

describe("session token", () => {
  const originalSecret = process.env.AUTH_SECRET;
  afterEach(() => {
    if (originalSecret === undefined) delete process.env.AUTH_SECRET;
    else process.env.AUTH_SECRET = originalSecret;
  });

  test("round-trips a signed session", () => {
    const session = createSession(wallet.publicKey.toBase58());
    expect(decodeSession(encodeSession(session, SECRET), SECRET)).toEqual(
      session
    );
  });

  test("rejects tampered, foreign, and expired tokens", () => {
    const session = createSession(wallet.publicKey.toBase58());
    const token = encodeSession(session, SECRET);
    const [, signature] = token.split(".");
    const forged = `${Buffer.from(
      JSON.stringify({ ...session, address: other.publicKey.toBase58() })
    ).toString("base64url")}.${signature}`;

    expect(decodeSession(forged, SECRET)).toBeNull();
    expect(decodeSession(token, `${SECRET}-other`)).toBeNull();
    expect(decodeSession(token, SECRET, session.expiresAt)).toBeNull();
    expect(decodeSession(undefined, SECRET)).toBeNull();
    expect(decodeSession("garbage", SECRET)).toBeNull();
  });

  test("requires a sufficiently long AUTH_SECRET", () => {
    delete process.env.AUTH_SECRET;
    expect(() => getAuthSecret()).toThrow("AUTH_SECRET");
    process.env.AUTH_SECRET = "too-short";
    expect(() => getAuthSecret()).toThrow("AUTH_SECRET");
    process.env.AUTH_SECRET = SECRET;
    expect(getAuthSecret()).toBe(SECRET);
  });
});

describe("app origin", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  const request = (host: string, origin?: string) =>
    new Request(`http://${host}/api/auth/verify`, {
      method: "POST",
      headers: { host, ...(origin && { origin }) },
    });

  test("uses APP_URL instead of the request's Host header", () => {
    vi.stubEnv("APP_URL", "https://app.example.com");
    const appUrl = getAppUrl(request("evil.example"));
    expect(appUrl.host).toBe("app.example.com");
    expect(appUrl.origin).toBe("https://app.example.com");
  });

  test("falls back to the Host header only outside production", () => {
    vi.stubEnv("APP_URL", "");
    vi.stubEnv("NODE_ENV", "development");
    expect(getAppUrl(request(DOMAIN)).origin).toBe(`http://${DOMAIN}`);

    vi.stubEnv("NODE_ENV", "production");
    expect(() => getAppUrl(request(DOMAIN))).toThrow("APP_URL");
  });

  test("rejects an invalid APP_URL", () => {
    vi.stubEnv("APP_URL", "not a url");
    expect(() => getAppUrl(request(DOMAIN))).toThrow("APP_URL");
  });

  test("rejects requests from another origin", () => {
    const appUrl = new URL("https://app.example.com");
    expect(
      isSameOrigin(request(DOMAIN, "https://app.example.com"), appUrl)
    ).toBe(true);
    expect(isSameOrigin(request(DOMAIN), appUrl)).toBe(true);
    expect(isSameOrigin(request(DOMAIN, "https://evil.example"), appUrl)).toBe(
      false
    );
    expect(
      isSameOrigin(request(DOMAIN, "http://app.example.com"), appUrl)
    ).toBe(false);
  });
});
