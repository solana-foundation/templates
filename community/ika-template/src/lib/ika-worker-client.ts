import type { Curve } from '@ika.xyz/sdk'
import type { WorkerRequest, WorkerResponse } from './ika-worker'

/**
 * Main-thread client for the Ika crypto worker. Lazily spawns a single worker
 * and resolves each request by id. Keeps the heavy WASM off the main thread so
 * the UI stays responsive during DKG prep.
 */

let worker: Worker | null = null
let nextId = 1
const pending = new Map<number, { resolve: (v: any) => void; reject: (e: Error) => void }>()

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('./ika-worker.ts', import.meta.url), { type: 'module' })
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const msg = event.data
      const entry = pending.get(msg.id)
      if (!entry) return
      pending.delete(msg.id)
      if (msg.ok) entry.resolve(msg.result)
      else entry.reject(new Error(msg.error))
    }
    worker.onerror = (e) => {
      // Fail any in-flight requests so callers don't hang forever.
      for (const [id, entry] of pending) {
        entry.reject(new Error(e.message || 'Ika worker crashed'))
        pending.delete(id)
      }
    }
  }
  return worker
}

export interface DKGPrepareResult {
  userDKGMessage: Uint8Array
  userPublicOutput: Uint8Array
  encryptedUserShareAndProof: Uint8Array
  userSecretKeyShare: Uint8Array
}

/** Run `prepareDKG`'s WASM crypto in the worker. Inputs must be plain bytes. */
export function prepareDKGInWorker(input: {
  protocolPublicParameters: Uint8Array
  curve: Curve
  encryptionKey: Uint8Array
  bytesToHash: Uint8Array
  senderAddress: string
}): Promise<DKGPrepareResult> {
  const id = nextId++
  const request: WorkerRequest = { id, kind: 'prepareDKG', ...input }
  return new Promise<DKGPrepareResult>((resolve, reject) => {
    pending.set(id, { resolve, reject })
    getWorker().postMessage(request)
  })
}

/**
 * Derive the UserShareEncryptionKeys in the worker (the ~8s class-groups WASM)
 * and return the serialized bytes. The main thread restores them cheaply with
 * `UserShareEncryptionKeys.fromShareEncryptionKeysBytes`.
 */
export function deriveUserShareKeysInWorker(input: { rootSeed: Uint8Array; curve: Curve }): Promise<Uint8Array> {
  const id = nextId++
  const request: WorkerRequest = { id, kind: 'deriveUserShareKeys', ...input }
  return new Promise<{ bytes: Uint8Array }>((resolve, reject) => {
    pending.set(id, { resolve, reject })
    getWorker().postMessage(request)
  }).then((r) => r.bytes)
}
