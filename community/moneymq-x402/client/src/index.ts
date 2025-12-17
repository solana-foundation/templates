import { config } from 'dotenv'
import { createSigner, decodeXPaymentResponse, wrapFetchWithPayment, MultiNetworkSigner, X402Config } from 'x402-fetch'
import path from 'path'

config({ path: path.join(process.cwd(), '..', '.env') })

const PAYER_PRIVATE_KEY = process.env.PAYER_PRIVATE_KEY as string
const PROTECTED_API_URL = process.env.PROTECTED_API_URL || 'http://localhost:4021/protected'
const NETWORK = process.env.NETWORK || 'solana'
const DEBUG = process.env.DEBUG === 'true'

// Debug logging helper
function debug(...args: any[]) {
  if (DEBUG) {
    console.log('[DEBUG]', ...args)
  }
}

// BigInt-safe JSON stringifier
function safeStringify(obj: any, indent = 2): string {
  return JSON.stringify(obj, (key, value) => (typeof value === 'bigint' ? value.toString() + 'n' : value), indent)
}

async function main() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('X402 + MONEYMQ PAYMENT FLOW DEMONSTRATION')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  if (!PAYER_PRIVATE_KEY) {
    console.error('\n❌ ERROR: Missing required environment variables')
    console.error('  → Ensure PAYER_PRIVATE_KEY is set in your .env file')
    process.exit(1)
  }

  try {
    console.log('\n[1/4] Initializing payment signer')
    debug('Creating signer with network:', NETWORK)
    debug('Private key length:', PAYER_PRIVATE_KEY?.length || 0)

    const payer = await createSigner(NETWORK, PAYER_PRIVATE_KEY)
    const signer = { svm: payer } as MultiNetworkSigner

    console.log('  → Network:', NETWORK)
    console.log('  → Payer address:', signer.svm.address.slice(0, 4) + '...' + signer.svm.address.slice(-4))
    debug('Full payer address:', signer.svm.address)
    console.log('  ✓ Signer initialized')

    debug('Creating fetchWithPayment wrapper')
    debug('Config:', { svmConfig: { rpcUrl: 'http://localhost:8899' } })

    const baseFetchWithPayment = wrapFetchWithPayment(fetch, payer, undefined, undefined, {
      svmConfig: { rpcUrl: 'http://localhost:8899' },
    })

    // Wrap with debug logging
    const fetchWithPayment = async (input: RequestInfo, init?: RequestInit) => {
      debug('=== X402 Fetch Request ===')
      debug('URL:', input)
      debug('Method:', init?.method || 'GET')
      debug('Headers:', init?.headers)
      debug('Body:', init?.body)

      const startTime = Date.now()
      try {
        const response = await baseFetchWithPayment(input, init)
        const duration = Date.now() - startTime

        debug('=== X402 Fetch Response ===')
        debug('Status:', response.status, response.statusText)
        debug('Duration:', duration, 'ms')
        debug('Response Headers:')
        response.headers.forEach((value, key) => {
          debug(`  ${key}:`, value)
        })

        return response
      } catch (error) {
        const duration = Date.now() - startTime
        debug('=== X402 Fetch Error ===')
        debug('Duration:', duration, 'ms')
        try {
          debug('Error details:', safeStringify(error))
        } catch (stringifyError) {
          debug('Error (could not stringify):', error)
        }
        if (error instanceof Error) {
          debug('Error message:', error.message)
          debug('Error stack:', error.stack)
          try {
            debug('Error cause:', safeStringify(error.cause))
          } catch {
            debug('Error cause:', error.cause)
          }
        }
        // @ts-ignore - accessing context property
        if (error?.context) {
          // @ts-ignore
          debug('Error context:', safeStringify(error.context))
        }
        throw error
      }
    }

    console.log('\n[2/4] Attempting to access protected endpoint without payment')
    console.log('  → GET', PROTECTED_API_URL)
    debug('Making request without payment header')

    const expect402Response = await fetch(PROTECTED_API_URL, {
      method: 'GET',
    })

    debug('Response status:', expect402Response.status)
    debug('Response headers:')
    expect402Response.headers.forEach((value, key) => {
      debug(`  ${key}:`, value)
    })

    if (expect402Response.status === 402) {
      const paymentRequired = await expect402Response.text()
      debug('402 Response body:', paymentRequired)
    }

    console.log('  → Response:', expect402Response.status, expect402Response.statusText)
    console.log(`  ${expect402Response.status === 402 ? '✅' : '❌'} Status code: ${expect402Response.status}`)

    console.log('\n[3/4] Accessing protected endpoint with x402 payment')
    console.log('  → Using x402 fetch wrapper')
    console.log('  → Payment will be processed via MoneyMQ facilitator')
    const response = await fetchWithPayment(PROTECTED_API_URL, {
      method: 'GET',
    })
    console.log('  → Transaction submitted to Solana')
    console.log(`  ${response.status === 200 ? '✅' : '❌'} Status code: ${response.status}`)

    console.log('\n[4/4] Processing response data')
    const data = await response.json()
    debug('Response body:', safeStringify(data))

    const paymentResponseHeader = response.headers.get('x-payment-response')
    debug('x-payment-response header:', paymentResponseHeader)

    let decodedPaymentResponse
    try {
      decodedPaymentResponse = decodeXPaymentResponse(paymentResponseHeader!)
      debug('Decoded payment response:', safeStringify(decodedPaymentResponse))
      console.log('  ✓ Payment response decoded')
    } catch (decodeError) {
      debug('Failed to decode payment response:', decodeError)
      decodedPaymentResponse = null
      console.log('  ⚠ No payment response to decode')
    }

    const result = {
      data: data,
      status_code: response.status,
      payment_response: decodedPaymentResponse,
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('SUCCESS: Payment completed and API accessed')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    console.log('\nResponse Data:')
    console.log(safeStringify(result))

    if (decodedPaymentResponse?.transaction) {
      console.log('\nTransaction signature:')
      console.log(decodedPaymentResponse.transaction)
      console.log('\nView on explorer:')
      const explorerUrl =
        NETWORK === 'solana-devnet'
          ? `https://explorer.solana.com/tx/${decodedPaymentResponse.transaction}?cluster=devnet`
          : `https://explorer.solana.com/tx/${decodedPaymentResponse.transaction}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`
      console.log(explorerUrl)
    }

    process.exit(0)
  } catch (error) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('ERROR: Demo failed')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    const errorResult = {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      status_code: (error as any).response?.status,
    }

    console.log('\nError details:')
    console.log(safeStringify(errorResult))

    console.log('\nTroubleshooting tips:')
    console.log('  → Ensure all services are running (MoneyMQ sandbox, API)')
    console.log('  → Verify your account has sufficient USDC balance')
    console.log('  → Check that MoneyMQ is running: moneymq sandbox')
    console.log('  → Confirm addresses and keys are set in .env')

    process.exit(1)
  }
}
main()
