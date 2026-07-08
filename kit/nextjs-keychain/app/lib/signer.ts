import {
  createKeychainSigner,
  type BackendName,
  type SolanaSigner,
} from "@solana/keychain";

import { configuredBackends, signerConfigFor } from "./config";

const signers = new Map<BackendName, Promise<SolanaSigner>>();

export function getSigner(backend?: string): Promise<SolanaSigner> {
  const backends = configuredBackends();
  const name = (backend ?? backends[0]) as BackendName;
  if (!backends.includes(name)) {
    throw new Error(
      `Backend "${name}" is not configured. Configured backends: ${backends.join(", ")}`
    );
  }
  let signer = signers.get(name);
  if (!signer) {
    signer = signerConfigFor(name).then(createKeychainSigner);
    signers.set(name, signer);
  }
  return signer;
}
