import { Verifier, type AttestationBundle } from '@tinfoilsh/verifier'
import { Identity } from 'ehbp'
import { ENCLAVE_MODEL } from './model'

// The browser's side of the protocol, for each message: verify the enclave, encrypt the conversation to it, send the
// ciphertext through this app's server, and decrypt the reply. The step numbers match the README.

// The repository whose published releases the enclave must be running. It is pinned here, in the page's code: if it came
// from the server, the server could name any code it liked.
const ROUTER_REPO = 'tinfoilsh/confidential-model-router'

// The longest reply the model may write. Only the enclave can read this cap, so the server cannot enforce it.
const MAX_COMPLETION_TOKENS = 4096

export type Message = { role: 'user' | 'assistant'; content: string }

/** What the browser proved about the enclave: the key to encrypt to, and the facts the page shows under each reply. */
export type Enclave = {
  publicKey: string
  host: string
  configRepo: string
  releaseTag: string
  digest: string
}

/** Step 2: check the attestation bundle in this browser. Throws if it does not verify, and then nothing is sent. */
export async function verifyEnclave(bundle: AttestationBundle): Promise<Enclave> {
  // The verifier checks, offline, that the hardware vendor signed the enclave's report, that the code the hardware
  // measured is a release published for ROUTER_REPO (the bundle carries its Sigstore record), and that the encryption
  // key belongs to that enclave. Only what it derives is used; nothing the server or Nito says about the enclave is.
  const verifier = new Verifier({ configRepo: ROUTER_REPO })
  try {
    const { hpkePublicKey } = await verifier.verifyBundle(bundle)
    const doc = verifier.getVerificationDocument()
    if (!hpkePublicKey || !doc?.securityVerified) throw new Error('The verifier did not confirm the enclave.')
    return {
      publicKey: hpkePublicKey,
      host: doc.enclaveHost,
      configRepo: doc.configRepo,
      releaseTag: doc.releaseTag ?? '',
      digest: doc.releaseDigest,
    }
  } catch (error) {
    throw new Error(
      `The enclave failed verification, so nothing was sent. ${error instanceof Error ? error.message : ''}`,
    )
  }
}

/** Steps 3 to 6: encrypt the conversation to the verified enclave, send it, and decrypt the reply's text. */
export async function sealedChat(
  enclave: Enclave,
  messages: Message[],
  onStep: (step: string) => void,
): Promise<string> {
  onStep('Encrypting')
  // Step 3. EHBP encrypts the request body with HPKE to the enclave's verified key. The URL only labels the envelope
  // and is never fetched. memoryOnly keeps the ciphertext in memory instead of spilling it to the browser's storage.
  const identity = await Identity.fromPublicKeyHex(enclave.publicKey)
  const { request, context } = await identity.encryptRequestWithContext(
    new Request('/api/chat', {
      method: 'POST',
      // Step 4. What gets encrypted is an ordinary OpenAI-style chat request.
      body: JSON.stringify({
        model: ENCLAVE_MODEL,
        messages,
        max_completion_tokens: MAX_COMPLETION_TOKENS,
        stream: false,
      }),
      headers: { 'content-type': 'application/octet-stream' },
    }),
    undefined,
    { memoryOnly: true },
  )
  const encapsulatedKey = request.headers.get('ehbp-encapsulated-key')
  if (!context || !encapsulatedKey) throw new Error('The request was not encrypted.')

  // Step 5. Only ciphertext leaves the browser. The server adds the API key and forwards the same bytes to Nito, which
  // relays them to the enclave at this origin.
  onStep('Waiting for the reply')
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: new Uint8Array(await request.arrayBuffer()),
    headers: {
      'content-type': 'application/octet-stream',
      'ehbp-encapsulated-key': encapsulatedKey,
      'nito-encrypted-enclave-url': `https://${enclave.host}`,
    },
  })
  if (!response.ok) throw await routeError(response)

  // Step 6. The enclave encrypted its reply with keys derived from this request's context, which never left the browser,
  // and the nonce in the Ehbp-Response-Nonce header. Decrypted, it is a normal chat completion.
  const completion = await (await identity.decryptResponseWithContext(response, context)).json()
  const content = completion.choices?.[0]?.message?.content
  if (typeof content !== 'string') throw new Error('The reply had no text.')
  return content
}

/** This app's routes answer a failure with { error: "..." }. Anything else is reported by its status. */
export async function routeError(response: Response): Promise<Error> {
  const body = await response.json().catch(() => null)
  return new Error(body?.error ?? `The server answered with HTTP ${response.status}.`)
}
