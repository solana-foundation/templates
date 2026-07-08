import { createKeychainSigner, type SolanaSigner } from "@solana/keychain";

import { signerConfigFromEnv } from "./config";

export const backendName = process.env.KEYCHAIN_BACKEND ?? "memory";

let signerPromise: Promise<SolanaSigner> | undefined;

export function getSigner(): Promise<SolanaSigner> {
  signerPromise ??= signerConfigFromEnv().then(createKeychainSigner);
  return signerPromise;
}
