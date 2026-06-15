/// <reference lib="webworker" />
import { prepareDKG, UserShareEncryptionKeys, Curve } from '@ika.xyz/sdk'

/**
 * Web Worker for the heavy 2PC-MPC WASM crypto.
 *
 * Two operations run synchronous WASM that would otherwise block the main
 * thread for several seconds and freeze the UI:
 *   - `deriveUserShareKeys` (UserShareEncryptionKeys.fromRootSeedKey): derives
 *     the class-groups keypair from the seed (~8s). Returns the serialized
 *     bytes, which the main thread restores cheaply via
 *     `fromShareEncryptionKeysBytes`.
 *   - `prepareDKG`: the DKG centralized-party output + share encryption (~1.5s).
 *
 * The worker only handles pure crypto: all inputs/outputs are plain bytes,
 * strings, or numbers, so nothing chain-related (the IkaClient, Sui
 * connections) crosses the worker boundary.
 */

type DeriveUserShareKeysRequest = {
  id: number
  kind: 'deriveUserShareKeys'
  rootSeed: Uint8Array
  curve: Curve
}

type PrepareDKGRequest = {
  id: number
  kind: 'prepareDKG'
  protocolPublicParameters: Uint8Array
  curve: Curve
  encryptionKey: Uint8Array
  bytesToHash: Uint8Array
  senderAddress: string
}

type WorkerRequest = DeriveUserShareKeysRequest | PrepareDKGRequest

type WorkerResponse =
  | { id: number; ok: true; kind: 'deriveUserShareKeys'; result: { bytes: Uint8Array } }
  | {
      id: number
      ok: true
      kind: 'prepareDKG'
      result: {
        userDKGMessage: Uint8Array
        userPublicOutput: Uint8Array
        encryptedUserShareAndProof: Uint8Array
        userSecretKeyShare: Uint8Array
      }
    }
  | { id: number; ok: false; error: string }

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const msg = event.data
  try {
    if (msg.kind === 'deriveUserShareKeys') {
      const keys = await UserShareEncryptionKeys.fromRootSeedKey(msg.rootSeed, msg.curve)
      const bytes = keys.toShareEncryptionKeysBytes()
      const response: WorkerResponse = { id: msg.id, ok: true, kind: 'deriveUserShareKeys', result: { bytes } }
      self.postMessage(response)
    } else if (msg.kind === 'prepareDKG') {
      const result = await prepareDKG(
        msg.protocolPublicParameters,
        msg.curve,
        msg.encryptionKey,
        msg.bytesToHash,
        msg.senderAddress,
      )
      const response: WorkerResponse = { id: msg.id, ok: true, kind: 'prepareDKG', result }
      self.postMessage(response)
    }
  } catch (e) {
    const response: WorkerResponse = { id: msg.id, ok: false, error: (e as Error).message }
    self.postMessage(response)
  }
}

export type { WorkerRequest, WorkerResponse }
