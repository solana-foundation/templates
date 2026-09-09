import {
  TextDecoder,
  TextEncoder,
  transferableAbortController,
} from "node:util";

// jsdom runs in its own VM realm, so its Uint8Array (and the byte arrays
// produced by its TextEncoder) are different intrinsics from Node's. tweetnacl
// and the Kit codecs do `instanceof Uint8Array` checks that fail across
// realms. Restore Node's intrinsics so every byte array comes from one realm.
const NodeUint8Array = Object.getPrototypeOf(Buffer.prototype)
  .constructor as Uint8ArrayConstructor;
globalThis.Uint8Array = NodeUint8Array;
globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder;
globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;

// Browsers treat localhost as a secure context but jsdom leaves the flag
// unset, and Kit refuses to run WebCrypto operations without it.
globalThis.isSecureContext = true;
// Node's fetch rejects jsdom's AbortSignal for the same cross-realm reason,
// while jsdom's own EventTarget only accepts jsdom signals — so the globals
// must stay jsdom's, and the signal gets bridged at the fetch boundary
// instead. Node does not export AbortController from a module, so recover its
// intrinsics from an instance.
const NodeAbortController = transferableAbortController()
  .constructor as typeof AbortController;
const nodeFetch = globalThis.fetch;
globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
  const signal = init?.signal;
  if (!signal) {
    return nodeFetch(input, init);
  }
  const controller = new NodeAbortController();
  if (signal.aborted) {
    controller.abort(signal.reason);
    return nodeFetch(input, { ...init, signal: controller.signal });
  }
  const onAbort = () => controller.abort(signal.reason);
  signal.addEventListener("abort", onAbort, { once: true });
  return nodeFetch(input, { ...init, signal: controller.signal }).finally(() =>
    signal.removeEventListener("abort", onAbort)
  );
}) as typeof fetch;
