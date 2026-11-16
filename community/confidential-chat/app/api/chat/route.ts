import { ENCLAVE_MODEL } from '@/lib/model'

// Step 5: forward the browser's ciphertext to Nito with the API key. This route cannot read the prompt or the reply. It
// checks only what it forwards: the body's type and size, and the two headers Nito routes by. It logs nothing.

// Ciphertext is a little larger than the JSON it encrypts. 256 KB holds a long conversation.
const MAX_BODY_BYTES = 256 * 1024
const ENCAPSULATED_KEY = /^[0-9a-f]{64}$/
// Tinfoil's enclaves are served under tinfoil.sh. Nito checks the origin too; this keeps the key from reaching elsewhere.
const ENCLAVE_ORIGIN = /^https:\/\/[a-z0-9-]+(\.[a-z0-9-]+)*\.tinfoil\.sh$/

export async function POST(request: Request) {
  const apiKey = process.env.NITO_API_KEY
  if (!apiKey) return fail(503, 'The server has no API key. Set NITO_API_KEY in .env.local and restart the server.')

  // Content-Length is required, so the size is checked before the body is read.
  const size = Number(request.headers.get('content-length'))
  const encapsulatedKey = request.headers.get('ehbp-encapsulated-key') ?? ''
  const enclaveUrl = request.headers.get('nito-encrypted-enclave-url') ?? ''
  if (request.headers.get('content-type') !== 'application/octet-stream') return fail(415, 'Expected ciphertext.')
  if (!(size > 0 && size <= MAX_BODY_BYTES)) return fail(413, 'The encrypted request is empty or too large.')
  if (!ENCAPSULATED_KEY.test(encapsulatedKey) || !ENCLAVE_ORIGIN.test(enclaveUrl)) {
    return fail(400, 'The encryption headers are missing or malformed.')
  }

  let upstream: Response
  try {
    upstream = await fetch('https://app.trynito.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/octet-stream',
        'ehbp-encapsulated-key': encapsulatedKey,
        'nito-encrypted-enclave-url': enclaveUrl,
        'nito-encrypted-model': ENCLAVE_MODEL,
      },
      body: await request.arrayBuffer(),
      signal: AbortSignal.timeout(120_000),
    })
  } catch {
    return fail(502, 'Nito could not be reached.')
  }
  // Nito's errors are plain JSON. Its message is not passed on, only its status.
  if (!upstream.ok) return fail(502, `Nito answered with an error (HTTP ${upstream.status}).`)
  const nonce = upstream.headers.get('ehbp-response-nonce')
  if (!nonce) return fail(502, 'Nito answered without a response nonce.')

  // The reply is ciphertext too. The browser needs the nonce to derive the keys that decrypt it.
  return new Response(upstream.body, {
    headers: { 'content-type': 'application/octet-stream', 'ehbp-response-nonce': nonce },
  })
}

const fail = (status: number, error: string) => Response.json({ error }, { status })
