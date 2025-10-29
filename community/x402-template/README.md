# Learning x402: Solana Payment Protocol Guide

**A hands-on educational project to understand the x402 payment protocol using Solana and USDC.**

> ⚠️ **Important:** This is a **learning guide and demonstration**, NOT a production-ready implementation. Use this to understand how x402 works, then build your own production system with proper infrastructure.

## Table of Contents

- [What is x402?](#what-is-x402)
- [Why x402 Matters](#why-x402-matters)
- [How x402 Works](#how-x402-works)
- [Our Implementation](#our-implementation)
- [Code Walkthrough](#code-walkthrough)
- [Learning Exercises](#learning-exercises)
- [What This Project Is](#what-this-project-is)
- [What This Project Is NOT](#what-this-project-is-not)
- [Getting Started](#getting-started)

---

## What is x402?

**x402** is an open payment protocol that uses HTTP status code **402 "Payment Required"** to enable seamless, programmatic payments over the internet.

### The Problem x402 Solves

Traditional payment systems require:

- 🔑 User accounts and authentication
- 🔐 API keys and complex authorization
- 💳 Payment provider integrations
- 🧾 Subscription management
- 📝 Terms of service agreements

**x402 enables payments without any of this complexity.**

### The x402 Vision

```
Client: "Give me this resource"
Server: "402 Payment Required - send 0.01 USDC to this address"
Client: *makes payment* "Here's proof"
Server: "Verified! Here's your resource"
```

No accounts. No authentication. No OAuth. Just pay and access.

---

## Why x402 Matters

### For AI Agents

AI agents can now:

- Pay for API calls without human intervention
- Access resources programmatically with on-chain payments
- Self-manage budgets using crypto wallets

### For Micropayments

Enables new business models:

- Pay-per-API-call (pennies per request)
- Pay-per-view content
- Pay-per-use services
- No subscription lock-in

### For Developers

Simplifies monetization:

- No payment provider setup
- No user database required
- No authentication system needed
- Just verify blockchain transactions

---

## How x402 Works

### The Protocol Flow

```
┌─────────┐                                           ┌─────────┐
│ Client  │                                           │ Server  │
└────┬────┘                                           └────┬────┘
     │                                                      │
     │ 1. GET /protected                                    │
     ├─────────────────────────────────────────────────────►│
     │                                                      │
     │ 2. 402 Payment Required                              │
     │    {                                                 │
     │      "accepts": [{                                   │
     │        "network": "solana-devnet",                   │
     │        "amount": "10000",                            │
     │        "payTo": "CmGg..."                            │
     │      }]                                              │
     │    }                                                 │
     │◄─────────────────────────────────────────────────────┤
     │                                                      │
     │ 3. Make payment on Solana                            │
     │    (gets transaction signature)                      │
     │                                                      │
     │ 4. GET /protected                                    │
     │    X-PAYMENT: {                                      │
     │      "payload": {                                    │
     │        "signature": "5yG8...",                       │
     │        "from": "wallet...",                          │
     │        "to": "CmGg...",                              │
     │        "amount": "10000"                             │
     │      }                                               │
     │    }                                                 │
     ├─────────────────────────────────────────────────────►│
     │                                                      │
     │ 5. Verify on blockchain                              │
     │      (Solana RPC)                                    │
     │                                                      │
     │ 6. 200 OK + Resource                                 │
     │    Set-Cookie: payment_verified=5yG8...              │
     │◄─────────────────────────────────────────────────────┤
     │                                                      │
```

### Key Components

1. **402 Response** - Server tells client what payment is needed
2. **Payment Header** - Client sends proof of payment via `X-PAYMENT`
3. **Verification** - Server verifies payment on blockchain
4. **Session** - Server remembers verified payments (optional)

---

## Understanding Facilitators

### What is a Facilitator?

A **facilitator** is a service that handles the complex task of verifying payments across different blockchains and payment networks. Think of it as a specialized payment verification microservice.

### Why Do We Need Facilitators?

**The Problem:**

- Different blockchains have different APIs (Solana, Ethereum, Bitcoin)
- Each network requires specific RPC calls and data parsing
- Payment verification logic is complex and error-prone
- Servers shouldn't need blockchain expertise to accept payments

**The Solution:**
A facilitator provides a **standard interface** for payment verification:

```typescript
// Instead of this (blockchain-specific):
const connection = new SolanaConnection(...);
const tx = await connection.getTransaction(...);
if (tx.meta?.err) { /* handle error */ }
// ... 50 more lines of Solana-specific code

// You do this (standard interface):
const result = await fetch('/api/facilitator/verify', {
  method: 'POST',
  body: JSON.stringify({ payment, requirements })
});
```

### How Our Facilitator Works

Our facilitator implements three endpoints:

#### 1. `/api/facilitator/supported` - Discovery

**Purpose:** Tell clients what payment types this facilitator can verify

```json
GET /api/facilitator/supported

Response:
{
  "kinds": [
    {
      "scheme": "exact",
      "network": "solana-devnet"
    }
  ]
}
```

**Our Implementation:** `app/api/facilitator/supported/route.ts`

```typescript
export async function GET() {
  return NextResponse.json({
    kinds: [
      {
        scheme: 'exact',
        network: 'solana-devnet',
      },
    ],
  })
}
```

#### 2. `/api/facilitator/verify` - Payment Verification

**Purpose:** Verify a payment against requirements

**Request:**

```json
POST /api/facilitator/verify

{
  "payment": {
    "payload": {
      "signature": "5yG8KpD...",
      "from": "9aHZ7j...",
      "to": "CmGgLQ...",
      "amount": "10000",
      "token": "4zMMC9..."
    }
  },
  "paymentRequirements": {
    "scheme": "exact",
    "network": "solana-devnet",
    "maxAmountRequired": "10000",
    "payTo": "CmGgLQ...",
    "asset": "4zMMC9..."
  }
}
```

**Response (Success):**

```json
{
  "isValid": true,
  "transactionId": "5yG8KpD..."
}
```

**Response (Failure):**

```json
{
  "isValid": false,
  "reason": "Transaction not found"
}
```

**What It Does:**

1. **Validates Parameters** - Checks payment matches requirements

```typescript
if (to !== paymentRequirements.payTo) {
  return { isValid: false, reason: 'Invalid payTo address' }
}
if (amount !== paymentRequirements.maxAmountRequired) {
  return { isValid: false, reason: 'Invalid amount' }
}
```

2. **Fetches Transaction** - Queries Solana blockchain

```typescript
const connection = new Connection(RPC_ENDPOINT)
const transaction = await connection.getTransaction(signature, {
  maxSupportedTransactionVersion: 0,
})
```

3. **Verifies Success** - Confirms transaction didn't fail

```typescript
if (!transaction) {
  return { isValid: false, reason: 'Transaction not found' }
}
if (transaction.meta?.err) {
  return { isValid: false, reason: 'Transaction failed on-chain' }
}
```

4. **Returns Result** - Simple boolean response

```typescript
return { isValid: true, transactionId: signature }
```

**Our Implementation:** `app/api/facilitator/verify/route.ts`

#### 3. `/api/facilitator/settle` - Settlement (Optional)

**Purpose:** Finalize/acknowledge a verified payment

```json
POST /api/facilitator/settle

{
  "transactionId": "5yG8KpD...",
  "payment": { ... }
}

Response:
{
  "success": true,
  "message": "Payment settled"
}
```

**What It Does:**

- Acknowledges payment was processed
- Can trigger webhooks, notifications, or database updates
- For blockchain payments, settlement happens automatically on-chain
- This endpoint is mainly for logging/bookkeeping

**Our Implementation:** `app/api/facilitator/settle/route.ts`

### Facilitator Flow Diagram

```
┌──────────────┐
│   Server     │
│ (proxy.ts)   │
└──────┬───────┘
       │ "I received a payment, is it valid?"
       │
       ↓
┌──────────────────────────────────────────────────┐
│             Facilitator Service                  │
│  ┌──────────────────────────────────────────┐    │
│  │ 1. Check parameters match requirements   │    │
│  │    ✓ Correct recipient address?          │    │
│  │    ✓ Correct amount?                     │    │
│  │    ✓ Correct token/currency?             │    │
│  └──────────────┬───────────────────────────┘    │
│                 │                                │
│  ┌──────────────▼───────────────────────────┐    │
│  │ 2. Query blockchain via RPC              │    │
│  │    • Fetch transaction by signature      │    │
│  │    • Parse transaction data              │    │
│  └──────────────┬───────────────────────────┘    │
│                 │                                │
│  ┌──────────────▼───────────────────────────┐    │
│  │ 3. Verify transaction details            │    │
│  │    ✓ Transaction exists?                 │    │
│  │    ✓ Transaction succeeded?              │    │
│  │    ✓ Not a failed transaction?           │    │
│  └──────────────┬───────────────────────────┘    │
│                 │                                │
│  ┌──────────────▼───────────────────────────┐    │
│  │ 4. Return verification result            │    │
│  │    { isValid: true/false, reason: ... }  │    │
│  └──────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
       │
       │ "Yes, valid!" or "No, invalid because.."
       ↓
┌──────────────┐
│   Server     │
│ Grant access │
│ or deny      │
└──────────────┘
```

### Why Separate the Facilitator?

**1. Separation of Concerns**

```typescript
// Without facilitator - Mixed concerns
async function middleware(request) {
  // Routing logic
  // Payment verification
  // Blockchain interaction
  // Error handling
  // Cookie management
  // All in one place! 😱
}

// With facilitator - Clean separation
async function middleware(request) {
  const result = await facilitator.verify(payment)
  if (result.isValid) {
    grantAccess()
  }
}
```

**2. Reusability**

- Multiple servers can use the same facilitator
- Facilitator can be a separate service
- Easy to swap payment networks (just change facilitator)

**3. Testability**

```typescript
// Easy to mock for testing
const mockFacilitator = {
  verify: () => ({ isValid: true, transactionId: 'test' }),
}
```

**4. Scalability**

```typescript
// Can scale facilitator independently
// Can cache verification results
// Can batch blockchain queries
```

**5. Blockchain Abstraction**

```typescript
// Server doesn't need to know about Solana specifics
// Facilitator handles all blockchain complexity
// Easy to add Ethereum, Bitcoin, etc.
```

### Real-World Facilitator Architecture

In production, facilitators are often:

**Dedicated Services:**

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Server 1   │────►│             │────►│   Solana    │
└─────────────┘     │ Facilitator │     │     RPC     │
┌─────────────┐     │  Service    │     └─────────────┘
│  Server 2   │────►│             │────►┌─────────────┐
└─────────────┘     │  (Redis     │     │  Ethereum   │
┌─────────────┐     │   cached)   │     │     RPC     │
│  Server 3   │────►│             │     └─────────────┘
└─────────────┘     └─────────────┘
```

**Third-Party Services:**

- PayAI Facilitator
- Coinbase Facilitator
- Custom enterprise facilitators

**Features They Provide:**

- Multi-blockchain support
- Caching and optimization
- Retry logic and fallbacks
- Monitoring and analytics
- Rate limiting
- Webhook notifications

### Our Simplified Facilitator

Our implementation is **educational** - it's embedded in the same Next.js app:

```
┌─────────────────────────────────────┐
│         Next.js App                 │
│  ┌──────────────┐                   │
│  │  proxy.ts    │                   │
│  │ (middleware) │                   │
│  └──────┬───────┘                   │
│         │ HTTP POST                 │
│         ↓                           │
│  ┌──────────────────────────────┐   │
│  │ app/api/facilitator/         │   │
│  │   verify/route.ts            │   │
│  └──────┬───────────────────────┘   │
└─────────┼───────────────────────────┘
          │
          ↓
    ┌──────────────┐
    │   Solana     │
    │  Blockchain  │
    └──────────────┘
```

**Advantages for Learning:**

- ✅ Simple to understand
- ✅ Easy to debug
- ✅ No extra infrastructure
- ✅ See the full flow in one codebase

**Disadvantages for Production:**

- ❌ Not scalable (same process)
- ❌ No caching
- ❌ Single point of failure
- ❌ Blockchain calls block requests

---

## Our Implementation

We've built a complete x402 demonstration using:

- **Blockchain:** Solana (devnet)
- **Currency:** USDC
- **Wallet:** Phantom (via Solana Wallet Adapter)
- **Framework:** Next.js 16 with App Router
- **Solana SDK:** Gill (modern, type-safe Solana library)
- **Type Safety:** Zod for environment validation
- **Price:** 0.01 USDC per access (configurable)

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                             │
│  ┌──────────────┐           ┌──────────────┐                │
│  │ Phantom      │           │ Paywall UI   │                │
│  │ Wallet       │◄─────────►│ (React)      │                │
│  └──────────────┘           └──────────────┘                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP + X-PAYMENT header
                         │
┌────────────────────────▼────────────────────────────────────┐
│                     Next.js Server                          │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ proxy.ts (Middleware)                                │   │
│  │ • Checks for payment cookie                          │   │
│  │ • Redirects to /paywall if no payment                │   │
│  │ • Verifies X-PAYMENT header                          │   │
│  └────────────┬─────────────────────────────────────────┘   │
│               │                                             │
│  ┌────────────▼─────────────────────────────────────────┐   │
│  │ app/(paywall)/paywall/page.tsx                       │   │
│  │ • Renders React paywall UI                           │   │
│  │ • Uses Solana Wallet Adapter                         │   │
│  │ • Handles payment flow via hooks                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ lib/x402-verification.ts                             │   │
│  │ • Calls facilitator verify & settle                  │   │
│  │ • Manages transaction storage                        │   │
│  └────────────┬─────────────────────────────────────────┘   │
│               │                                             │
│  ┌────────────▼─────────────────────────────────────────┐   │
│  │ app/api/facilitator/verify/route.ts                  │   │
│  │ • Validates payment parameters                       │   │
│  │ • Fetches transaction from Solana (via Gill)         │   │
│  │ • Verifies transaction succeeded                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ app/api/facilitator/settle/route.ts                  │   │
│  │ • Verifies transfer instruction exists               │   │
│  │ • Confirms sender/receiver/amount match              │   │
│  │ • Finalizes payment settlement                       │   │
│  └────────────┬─────────────────────────────────────────┘   │
└───────────────┼─────────────────────────────────────────────┘
                │
                │ RPC calls (via Gill)
                │
┌───────────────▼──────────────────────────────────────────────┐
│              Solana Blockchain (Devnet)                      │
│  • USDC transfer transactions                                │
│  • Immutable payment proof                                   │
└──────────────────────────────────────────────────────────────┘
```

---

## Code Walkthrough

Let's trace a complete payment flow through our code.

### Step 1: User Requests Protected Content

**File:** `proxy.ts`

```typescript
export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!pathname.startsWith("/protected")) {
    return NextResponse.next(); // Not a protected route
  }

  const paymentCookie = request.cookies.get(X402_CONFIG.COOKIE_NAME);
  if (paymentCookie?.value) {
    const isValid = await verifyCookieSignature(paymentCookie.value);
    if (isValid) {
      return NextResponse.next(); // Already paid, grant access
    }
  }

```

**What happens:**

- Middleware intercepts request to `/protected`
- Checks if user has valid payment cookie
- If cookie exists, verifies signature is in our verified transactions
- If valid, immediately grants access

### Step 2: Server Returns 402 Payment Required

**File:** `lib/x402-responses.ts`

```typescript
export function create402Response(request: NextRequest, clearCookie = false): NextResponse {
  const pathname = request.nextUrl.pathname
  const accept = request.headers.get('Accept')
  const userAgent = request.headers.get('User-Agent')

  // Browser gets redirected to React paywall page
  if (accept?.includes('text/html') && userAgent?.includes('Mozilla')) {
    const paywallUrl = new URL('/paywall', request.url)
    paywallUrl.searchParams.set('resource', pathname)
    const response = NextResponse.redirect(paywallUrl, 302)
    if (clearCookie) {
      response.cookies.delete(X402_CONFIG.COOKIE_NAME)
    }
    return response
  }

  // API clients get JSON with payment requirements
  const response = NextResponse.json(
    {
      x402Version: 1,
      error: 'Payment required',
      accepts: [
        {
          scheme: X402_CONFIG.PAYMENT_SCHEME,
          network: X402_CONFIG.NETWORK,
          maxAmountRequired: X402_CONFIG.REQUIRED_AMOUNT, // "10000"
          resource: `${request.nextUrl.protocol}//${request.nextUrl.host}${pathname}`,
          description: X402_CONFIG.PAYMENT_DESCRIPTION,
          payTo: X402_CONFIG.TREASURY_ADDRESS,
          maxTimeoutSeconds: X402_CONFIG.PAYMENT_TIMEOUT_SECONDS,
          asset: X402_CONFIG.USDC_DEVNET_MINT,
        },
      ],
    },
    { status: 402 },
  )

  if (clearCookie) {
    response.cookies.delete(X402_CONFIG.COOKIE_NAME)
  }

  return response
}
```

**What happens:**

- Browser users get redirected to `/paywall` (a React page with Solana Wallet Adapter)
- API clients get structured JSON with full payment requirements
- Browser redirect includes the original resource path as a query parameter
- Response tells client exactly how to pay (network, amount, token, address, timeout, etc.)

### Step 3: Client Makes Payment on Solana

**File:** `components/paywall/hooks/use-payment-flow.ts` (simplified)

```typescript
export function usePaymentFlow() {
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const handlePayment = async () => {
    // 1. Get treasury and USDC mint addresses
    const treasuryPk = getTreasuryPk()
    const usdcMint = getUsdcMintPk()
    const usdcAmount = Math.floor(env.NEXT_PUBLIC_PAYMENT_AMOUNT_USD * Math.pow(10, env.NEXT_PUBLIC_USDC_DECIMALS))

    // 2. Find token accounts (Associated Token Accounts)
    const ownerAddress: Address = address(publicKey.toString())
    const senderTokenAccount = await getAssociatedTokenAddress(usdcMint, ownerAddress)
    const treasuryTokenAccount = await getAssociatedTokenAddress(usdcMint, treasuryPk)

    // 3. Create USDC transfer instruction using Gill
    const transferInstruction = createTransferCheckedInstruction({
      source: senderTokenAccount,
      mint: usdcMint,
      destination: treasuryTokenAccount,
      owner: ownerAddress,
      amount: BigInt(usdcAmount),
      decimals: env.NEXT_PUBLIC_USDC_DECIMALS,
    })

    // 4. Get recent blockhash and build transaction
    const { rpc } = getClient()
    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send()
    const transaction = await convertGillInstructionToWeb3Transaction(
      transferInstruction,
      publicKey,
      latestBlockhash.blockhash,
    )

    // 5. Send transaction via wallet adapter
    const signature = await sendTransaction(transaction, connection)

    // 6. Wait for confirmation
    await confirmTransaction(signature)

    // 7. Build x402 payment header
    const paymentHeader = buildPaymentHeader({
      signature,
      from: publicKey.toString(),
      to: env.NEXT_PUBLIC_TREASURY_ADDRESS,
      amount: usdcAmount.toString(),
      token: env.NEXT_PUBLIC_USDC_DEVNET_MINT,
    })

    // 8. Send payment proof to server
    const response = await fetch('/protected', {
      method: 'GET',
      headers: { 'X-PAYMENT': paymentHeader },
    })

    if (response.ok) {
      router.push('/protected') // Access granted!
    }
  }

  return { handlePayment }
}
```

**What happens:**

- User connects Phantom wallet via Solana Wallet Adapter
- Hook calculates USDC amount and finds Associated Token Accounts
- Creates transfer instruction using Gill (type-safe Solana SDK)
- Converts Gill instruction to web3.js format (wallet adapter requirement)
- Phantom prompts user to approve transaction
- Transaction broadcasts to Solana network
- Client waits for blockchain confirmation (polling signature status)
- Client constructs x402 payment header using `buildPaymentHeader()` helper
- Client makes request to `/protected` with `X-PAYMENT` header
- On success, redirects to protected page

### Step 4: Server Verifies Payment

**File:** `lib/x402-verification.ts`

```typescript
export async function verifyPayment(payment: Payment, resource: string): Promise<VerificationResult> {
  const { signature, from, to, amount } = payment.payload

  // Check if we already verified this transaction (prevent replay attacks)
  if (await transactionStorage.has(signature)) {
    return { isValid: true, signature }
  }

  // Build payment requirements for facilitator
  const paymentRequirements = {
    scheme: X402_CONFIG.PAYMENT_SCHEME,
    network: X402_CONFIG.NETWORK,
    maxAmountRequired: X402_CONFIG.REQUIRED_AMOUNT,
    resource,
    description: X402_CONFIG.PAYMENT_DESCRIPTION,
    payTo: X402_CONFIG.TREASURY_ADDRESS,
    maxTimeoutSeconds: X402_CONFIG.PAYMENT_TIMEOUT_SECONDS,
    asset: X402_CONFIG.USDC_DEVNET_MINT,
  }

  // Step 1: Call facilitator to verify on-chain
  const verifyResponse = await fetch(`${X402_CONFIG.FACILITATOR_BASE_URL}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payment, paymentRequirements }),
  })

  const verifyResult = await verifyResponse.json()

  if (!verifyResult.isValid) {
    return {
      isValid: false,
      reason: verifyResult.reason || 'Payment verification failed',
    }
  }

  // Step 2: Settle the payment (verify transfer instruction)
  const settleResponse = await fetch(`${X402_CONFIG.FACILITATOR_BASE_URL}/settle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      transactionId: verifyResult.transactionId,
      payment,
    }),
  })

  const settleResult = await settleResponse.json()

  if (!settleResult.success) {
    return {
      isValid: false,
      reason: settleResult.reason || 'Settlement verification failed',
    }
  }

  // Store signature to prevent replay attacks
  await transactionStorage.add(signature, { from, to, amount })
  console.log('Payment verified and settled successfully:', signature)

  return { isValid: true, signature }
}
```

**What happens:**

- Extract transaction signature from payment header
- Check if we've already verified this transaction (prevent replay)
- Call facilitator `/verify` endpoint to check transaction exists and succeeded
- Call facilitator `/settle` endpoint to verify actual transfer instruction
- Settle endpoint confirms sender, receiver, amount, and token all match
- If both steps pass, store signature in verified transactions
- Return verification result

### Step 5: Facilitator Verifies Transaction Exists

**File:** `app/api/facilitator/verify/route.ts`

```typescript
export async function POST(request: NextRequest) {
  const { payment, paymentRequirements } = await request.json()
  const { signature, to, amount, token } = payment.payload

  // Validate payment matches requirements
  if (to !== paymentRequirements.payTo) {
    return NextResponse.json({ isValid: false, reason: 'Invalid payTo address' })
  }
  if (amount !== paymentRequirements.maxAmountRequired) {
    return NextResponse.json({ isValid: false, reason: 'Invalid amount' })
  }
  if (token !== paymentRequirements.asset) {
    return NextResponse.json({ isValid: false, reason: 'Invalid token' })
  }

  // Fetch transaction from Solana using Gill
  const { rpc } = getClient()
  const sig = gillSignature(signature)

  let transaction
  try {
    transaction = await rpc
      .getTransaction(sig, {
        encoding: 'jsonParsed',
        maxSupportedTransactionVersion: 0,
      })
      .send()
  } catch {
    return NextResponse.json({ isValid: false, reason: 'Transaction not found' })
  }

  if (!transaction) {
    return NextResponse.json({ isValid: false, reason: 'Transaction not found' })
  }

  // Check if transaction succeeded on-chain
  if (transaction.meta?.err) {
    return NextResponse.json({ isValid: false, reason: 'Transaction failed on-chain' })
  }

  // Transaction exists and succeeded
  return NextResponse.json({
    isValid: true,
    transactionId: signature,
  })
}
```

**What happens:**

- Receives payment and requirements from verifier
- Validates payment parameters match requirements (address, amount, token)
- Creates Gill client and converts signature to Gill type
- Fetches actual transaction from Solana blockchain via RPC
- Verifies transaction exists and didn't fail
- Returns verification result with transaction ID

### Step 6: Facilitator Settles Payment

**File:** `app/api/facilitator/settle/route.ts` (simplified)

```typescript
export async function POST(request: NextRequest) {
  const { transactionId, payment } = await request.json()
  const { from, to, amount, token } = payment.payload

  // Fetch transaction again from blockchain
  const { rpc } = getClient()
  const sig = gillSignature(transactionId)
  const transaction = await rpc
    .getTransaction(sig, {
      encoding: 'jsonParsed',
      maxSupportedTransactionVersion: 0,
    })
    .send()

  if (!transaction || transaction.meta?.err) {
    return NextResponse.json({ success: false, reason: 'Transaction not found or failed' })
  }

  // Validate payment parameters again
  if (to !== env.NEXT_PUBLIC_TREASURY_ADDRESS) {
    return NextResponse.json({ success: false, reason: 'Invalid treasury address' })
  }
  if (token !== env.NEXT_PUBLIC_USDC_DEVNET_MINT) {
    return NextResponse.json({ success: false, reason: 'Invalid token mint' })
  }

  // Calculate expected Associated Token Accounts
  const treasuryPk = getTreasuryPk()
  const usdcMint = getUsdcMintPk()
  const fromAddr: Address = address(from)
  const expectedSenderAta = await getAssociatedTokenAddress(usdcMint, fromAddr)
  const expectedTreasuryAta = await getAssociatedTokenAddress(usdcMint, treasuryPk)

  // Search for transfer instruction in transaction
  // Checks both main instructions and inner instructions
  let foundTransfer = false
  for (const ix of transaction.transaction.message.instructions) {
    if (ix.programId === TOKEN_PROGRAM_ID) {
      if (ix.keys[0]?.pubkey === expectedSenderAta && ix.keys[2]?.pubkey === expectedTreasuryAta) {
        foundTransfer = true
        break
      }
    }
  }

  if (!foundTransfer) {
    return NextResponse.json({
      success: false,
      reason: 'Transaction does not contain expected transfer instruction',
    })
  }

  // All checks passed - payment settled!
  return NextResponse.json({
    success: true,
    message: 'Payment settled',
    transactionId,
  })
}
```

**What happens:**

- Receives transaction ID and payment details from verification step
- Fetches transaction from blockchain again (double-check)
- Validates treasury address and token mint match expectations
- Calculates expected Associated Token Accounts for sender and treasury
- Searches transaction instructions for Token Program transfer
- Verifies transfer instruction contains correct sender and receiver ATAs
- Also checks inner instructions (for CPI calls)
- If transfer instruction found with correct accounts, settlement succeeds
- This prevents attacks where someone sends an unrelated transaction signature

**Why Settlement Matters:**

The settle step adds an extra layer of security by verifying the transaction actually contains a transfer instruction from the correct sender to the correct receiver. Without this, someone could theoretically submit any successful transaction signature, not necessarily one that sent USDC to your treasury.

### Step 7: Grant Access with Session

**File:** `proxy.ts` (continued)

```typescript
const result = await verifyPayment(payment, resource)

if (!result.isValid) {
  return create402Error(result.reason || 'Payment verification failed')
}

// Payment verified! Set cookie and grant access
const response = NextResponse.next()
response.cookies.set(X402_CONFIG.COOKIE_NAME, result.signature!, {
  httpOnly: true, // JavaScript can't access
  secure: isProduction, // HTTPS only in production
  sameSite: 'lax', // CSRF protection
  maxAge: 86400, // 24 hours
  path: '/',
})

return response // Grants access to protected content
```

**What happens:**

- If verification fails, return 402 error
- If successful, set secure httpOnly cookie
- Cookie stores transaction signature
- Cookie valid for 24 hours
- User can access protected content
- Future requests check cookie instead of re-verifying

---

## Key Technologies Used

### Gill - Modern Solana SDK

This template uses [Gill](https://github.com/anza-xyz/gill), a next-generation Solana SDK that provides:

- **Type Safety** - Full TypeScript types with zero `any` types
- **Modern API** - Promise-based, async/await friendly
- **Tree-shakeable** - Only bundle what you use
- **Better DX** - Cleaner APIs than web3.js

**Example:**

```typescript
import { address, signature, getClient } from 'gill'

const { rpc } = getClient()
const sig = signature('5yG8KpD...')
const tx = await rpc.getTransaction(sig).send()
```

**Why Gill?**

- Server-side: Gill provides cleaner, type-safe blockchain interaction
- Client-side: We still use `@solana/web3.js` because wallet adapters require it
- We convert between Gill and web3.js types when needed (`convertGillInstructionToWeb3Transaction`)

### Zod - Runtime Type Validation

Environment variables are validated at runtime using [Zod](https://zod.dev/):

```typescript
const envSchema = z.object({
  NEXT_PUBLIC_RPC_ENDPOINT: z.string().url().default('https://api.devnet.solana.com'),
  NEXT_PUBLIC_PAYMENT_AMOUNT_USD: z.coerce.number().default(0.01),
  // ... more validations
})

export const env = envSchema.parse(process.env)
```

**Benefits:**

- Type-safe environment variables
- Clear error messages for misconfiguration
- Default values for optional settings
- Compile-time and runtime validation

### Solana Wallet Adapter

Standard wallet integration using [@solana/wallet-adapter-react](https://github.com/anza-xyz/wallet-adapter):

```typescript
const { publicKey, sendTransaction } = useWallet()
const { connection } = useConnection()
```

**Benefits:**

- Works with all Solana wallets (Phantom, Solflare, etc.)
- Standard hooks-based API
- Automatic wallet detection
- Connection management

### React Hooks Architecture

Payment flow organized into custom hooks:

- `usePaymentFlow()` - Handles payment transaction
- `useWalletConnection()` - Manages wallet connection
- `usePaymentCheck()` - Checks existing payment

**Benefits:**

- Separation of concerns
- Testable logic
- Reusable components
- Clean component code

---

## Learning Exercises

Now that you understand the flow, try these exercises:

### Beginner

1. **Change the Price**
   - Create a `.env.local` file
   - Add `NEXT_PUBLIC_PAYMENT_AMOUNT_USD=0.02`
   - Restart dev server and test the payment flow
   - Check how `lib/env.ts` validates this value

2. **Customize the Paywall**
   - Edit `components/paywall/paywall-container.tsx`
   - Change the gradient colors or text
   - Edit `components/paywall/price-box.tsx` to customize price display
   - See your changes at `/paywall`

3. **Add a New Protected Route**
   - Create `app/premium/page.tsx`
   - Access it directly - should redirect to paywall
   - Why? Check `proxy.ts` matcher config
   - Try adding `/premium/:path*` to the matcher

### Intermediate

4. **Track Payment Analytics**
   - Add logging to `app/api/facilitator/settle/route.ts`
   - Log: timestamp, amount, from address, transaction signature
   - Create `app/api/analytics/route.ts` to view payments
   - Display payment history on a new page

5. **Different Prices for Different Routes**
   - Modify `proxy.ts` to check pathname
   - Pass different amounts in `create402Response` based on route
   - Update `lib/x402-config.ts` to support dynamic pricing
   - `/protected` = 0.01 USDC, `/premium` = 0.05 USDC

6. **Add Payment Expiry**
   - Modify cookie `maxAge` in `proxy.ts` (currently 24 hours)
   - Add environment variable `NEXT_PUBLIC_COOKIE_MAX_AGE`
   - Test different expiry times (1 hour, 30 minutes)
   - Add expiry countdown on protected page

7. **Custom Payment Hook**
   - Study `components/paywall/hooks/use-payment-flow.ts`
   - Create a new hook `use-payment-status.ts` for checking payment status
   - Add real-time payment status updates
   - Display progress during confirmation

### Advanced

8. **Implement Mainnet Support**
   - Update `lib/env.ts` to add mainnet RPC endpoint
   - Add network switching in `lib/solana.ts`
   - Update `NEXT_PUBLIC_NETWORK` to support mainnet
   - Add network selection toggle in paywall UI
   - **WARNING:** Test thoroughly before using real money!

9. **Build Redis Storage**
   - Install `ioredis` package
   - Replace `lib/transaction-storage.ts` with Redis implementation
   - Use Redis for distributed caching across server instances
   - Add proper error handling and connection management
   - Set TTL (Time To Live) for verified transactions

10. **Add Webhook Notifications**
    - Create `app/api/webhooks/route.ts` endpoint
    - Send POST request from settle endpoint on successful payment
    - Integrate with Discord webhook or Slack incoming webhook
    - Include payment details: amount, signature, timestamp
    - Add retry logic for failed webhook deliveries

11. **Build with Gill Throughout**
    - Replace remaining `@solana/web3.js` usage with Gill
    - Create custom wallet adapter that uses Gill types
    - Implement transaction building entirely with Gill
    - Explore Gill's advanced features (subscriptions, batch requests)

---

## What This Project Is

✅ **An Educational Tool**

- Learn x402 protocol concepts
- Understand Solana payments
- See blockchain verification in action
- Study clean TypeScript architecture with modern tools (Gill, Zod)

✅ **A Working Demonstration**

- Complete payment flow end-to-end
- Real Solana transactions on devnet
- Full wallet integration via Solana Wallet Adapter
- Verifiable on Solana Explorer
- Settlement verification with instruction parsing

✅ **A Starting Point**

- Clean, modular codebase (57 line middleware!)
- Component-based architecture with React hooks
- Well-documented and commented
- Easy to understand and modify
- Foundation for your own system

✅ **Best Practices Example**

- Separation of concerns (hooks, components, utilities)
- Type-safe TypeScript with Gill and Zod
- Secure cookie handling (httpOnly, sameSite)
- Comprehensive on-chain verification (verify + settle)
- Environment validation with defaults
- Modern React patterns

---

## What This Project Is NOT

❌ **Not Production Infrastructure**

- Uses file-based storage (single server only)
- No Redis or distributed caching
- No database for transaction history
- Will lose data on restart

❌ **Not Battle-Tested**

- No load testing or performance optimization
- Not designed for high traffic
- Single point of failure (facilitator)
- No monitoring or observability

❌ **Not Feature-Complete**

- No refund mechanism
- No subscription support
- No payment disputes
- No webhook notifications
- No admin dashboard
- No analytics or reporting

❌ **Not Fully x402 Compliant**

- Implements practical subset only
- Custom Solana-specific extensions
- Simplified for learning purposes
- Missing advanced x402 features

❌ **Not Secure Enough for Real Money**

- Simplified security model
- No rate limiting
- No abuse prevention
- No audit trail
- No key management system
- No DDoS protection

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- [Phantom Wallet](https://phantom.app/) browser extension
- Solana devnet USDC from [Circle Faucet](https://faucet.circle.com/)

### Installation

```bash
# Clone the repository

pnpm create solana-dapp@latest -t gh:solana-foundation/templates/community/x402-template

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

### Configuration (Optional)

All environment variables have sensible defaults, but you can customize them:

**Create `.env.local` file:**

```bash
# Solana Network
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
NEXT_PUBLIC_NETWORK=solana-devnet

# Payment Configuration
NEXT_PUBLIC_PAYMENT_AMOUNT_USD=0.01
NEXT_PUBLIC_USDC_DECIMALS=6
NEXT_PUBLIC_USDC_DEVNET_MINT=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU

# Your Treasury (where payments go)
NEXT_PUBLIC_TREASURY_ADDRESS=CmGgLQL36Y9ubtTsy2zmE46TAxwCBm66onZmPPhUWNqv

# Session & Facilitator
NEXT_PUBLIC_COOKIE_NAME=solana_payment_verified
NEXT_PUBLIC_COOKIE_MAX_AGE=86400
NEXT_PUBLIC_FACILITATOR_URL=http://localhost:3000/api/facilitator

# Payment Details
NEXT_PUBLIC_PAYMENT_SCHEME=exact
NEXT_PUBLIC_PAYMENT_DESCRIPTION="Access to protected content"
NEXT_PUBLIC_PAYMENT_TIMEOUT_SECONDS=60
```

**Environment Variables Explained:**

- `NEXT_PUBLIC_PAYMENT_AMOUNT_USD` - Price in USD (e.g., 0.01 = 1 cent)
- `NEXT_PUBLIC_TREASURY_ADDRESS` - Your Solana wallet address (receives payments)
- `NEXT_PUBLIC_NETWORK` - Network to use (solana-devnet, solana-mainnet-beta)
- `NEXT_PUBLIC_COOKIE_MAX_AGE` - How long payment session lasts (seconds)

**Note:** All variables have defaults defined in `lib/env.ts`, so the app works without any `.env.local` file! For customizing to your own `.env`, please add yours.

### Get Test USDC

1. Install Phantom wallet
2. Switch to Devnet (Settings → Developer Settings → Testnet Mode)
3. Copy your wallet address
4. Visit [Circle Faucet](https://faucet.circle.com/)
5. Request devnet USDC
6. Wait 30 seconds

### Test the Flow

1. Visit `http://localhost:3000/protected`
2. See the 402 paywall
3. Click "Connect Phantom Wallet"
4. Approve the connection
5. Click "Pay $0.01 USDC"
6. Approve the transaction in Phantom
7. Wait for confirmation
8. Access granted!
9. Check the transaction on [Solana Explorer](https://explorer.solana.com/?cluster=devnet)

### Verify It Worked

```bash
# Check the verified transactions file
cat .verified-transactions.json

# You should see your transaction signature stored
```

---

## Project Structure

```
x402-template/
├── lib/
│   ├── env.ts                  # 🔐 Environment validation (Zod)
│   ├── solana.ts               # ⛓️  Solana utilities (Gill)
│   ├── x402.ts                 # 🔧 x402 utilities
│   ├── x402-config.ts          # ⚙️  Configuration
│   ├── x402-responses.ts       # 📄 402 responses
│   ├── x402-verification.ts    # ✅ Payment verification
│   └── transaction-storage.ts  # 💾 Storage layer
├── components/
│   └── paywall/
│       ├── paywall-container.tsx   # 🎨 Main paywall UI
│       ├── price-box.tsx           # 💵 Price display
│       ├── status-message.tsx      # 📢 Status display
│       ├── action-button.tsx       # 🔘 Action button
│       ├── wallet-address.tsx      # 👛 Wallet display
│       └── hooks/
│           ├── use-payment-check.ts      # ✓ Check payment
│           ├── use-payment-flow.ts       # 💸 Payment flow
│           └── use-wallet-connection.ts  # 🔌 Wallet connection
├── providers/
│   └── WalletProvider.tsx      # 🔌 Solana Wallet Adapter
├── app/
│   ├── (paywall)/
│   │   └── paywall/page.tsx    # 💳 Paywall page
│   ├── api/
│   │   ├── facilitator/
│   │   │   ├── verify/route.ts     # 🔍 Transaction verification
│   │   │   ├── settle/route.ts     # 💰 Payment settlement
│   │   │   └── supported/route.ts  # 📋 Supported methods
│   │   └── clear-payment/route.ts  # 🧹 Clear payment cookie
│   ├── protected/page.tsx      # 🔒 Protected content
│   ├── page.tsx                # 🏠 Public homepage
│   └── layout.tsx              # 📐 Root layout
├── proxy.ts                    # 🛡️  x402 middleware (57 lines!)
└── README.md                   # 📖 This guide
```

---

## Key Concepts Demonstrated

### 1. **HTTP 402 Status Code**

See it in action: `lib/x402-responses.ts`

```typescript
{ status: 402, headers: { "Content-Type": "application/json" } }
```

### 2. **Payment Requirements**

Tells client how to pay:

```json
{
  "network": "solana-devnet",
  "amount": "10000",
  "payTo": "CmGgLQL36Y9...",
  "asset": "4zMMC9srt5..."
}
```

### 3. **Payment Proof**

Client sends via `X-PAYMENT` header:

```json
{
  "payload": {
    "signature": "5yG8KpD...",
    "from": "9aHZ7j...",
    "to": "CmGgLQ...",
    "amount": "10000"
  }
}
```

### 4. **On-Chain Verification**

Server verifies on Solana blockchain:

```typescript
const transaction = await connection.getTransaction(signature)
if (!transaction?.meta?.err) {
  // Payment verified!
}
```

### 5. **Session Management**

Server remembers verified payments:

```typescript
response.cookies.set('solana_payment_verified', signature, {
  httpOnly: true,
  maxAge: 86400, // 24 hours
})
```

---

## Going to Production

If you want to build a real x402 system, you'll need:

### Infrastructure

- [ ] Redis or DynamoDB for distributed storage
- [ ] PostgreSQL for transaction history
- [ ] Load balancer for multiple server instances
- [ ] CDN for static assets
- [ ] Queue system (Bull, SQS) for async processing

### Security

- [ ] Rate limiting (per IP, per wallet)
- [ ] DDoS protection (Cloudflare, etc.)
- [ ] Request signing/verification
- [ ] Comprehensive audit logging
- [ ] Key management system
- [ ] Security audit by professionals

### Monitoring

- [ ] Error tracking (Sentry, DataDog)
- [ ] Performance monitoring (New Relic)
- [ ] Blockchain monitoring (failed transactions)
- [ ] Alert system (PagerDuty, OpsGenie)
- [ ] Analytics dashboard

### Features

- [ ] Multiple payment networks
- [ ] Multiple tokens/currencies
- [ ] Refund mechanism
- [ ] Dispute resolution
- [ ] Webhook notifications
- [ ] Admin dashboard
- [ ] Customer support system

### Testing

- [ ] Unit tests (95%+ coverage)
- [ ] Integration tests
- [ ] E2E tests (Playwright)
- [ ] Load testing (k6, Artillery)
- [ ] Security testing
- [ ] Chaos engineering

---

## Resources

### x402 Protocol

- [x402 GitHub](https://github.com/coinbase/x402) - Official specification
- [x402 Documentation](https://docs.payai.network/x402/introduction) - PayAI docs
- [HTTP 402 Status Code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/402) - MDN reference

### Solana

- [Solana Documentation](https://docs.solana.com/) - Official docs
- [Solana Cookbook](https://solanacookbook.com/) - Practical guides
- [Gill](https://github.com/anza-xyz/gill) - Modern, type-safe Solana SDK (used in this template)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/) - Classic JavaScript SDK
- [Solana Wallet Adapter](https://github.com/anza-xyz/wallet-adapter) - Standard wallet integration
- [Solana Explorer](https://explorer.solana.com/) - View transactions

### Development Tools

- [Phantom Wallet](https://phantom.app/) - Solana wallet
- [Circle USDC Faucet](https://faucet.circle.com/) - Get test USDC
- [Solana Faucet](https://faucet.solana.com/) - Get test SOL
- [Zod](https://zod.dev/) - TypeScript-first schema validation
- [Next.js](https://nextjs.org/) - React framework (App Router)

---

## Questions for Understanding

Test your knowledge:

1. **Why does x402 use HTTP 402 instead of 401 or 403?**
   <details>
   <summary>Answer</summary>
   402 specifically means "Payment Required" - you have no authentication issues (401) or permission issues (403), you simply need to pay to access the resource.
   </details>

2. **Why do we store transaction signatures instead of just setting cookies?**
   <details>
   <summary>Answer</summary>
   To prevent replay attacks and verify the payment is legitimate. Anyone could set a cookie, but only real transactions have valid blockchain signatures we can verify.
   </details>

3. **What happens if a user pays but the server crashes before setting the cookie?**
   <details>
   <summary>Answer</summary>
   The payment is already on-chain, so when the user retries, the signature is verified against the blockchain. In our current implementation, they'd need to send the X-PAYMENT header again. Production systems should handle this more gracefully.
   </details>

4. **Why use httpOnly cookies instead of localStorage?**
   <details>
   <summary>Answer</summary>
   Security. HttpOnly cookies can't be accessed by JavaScript, protecting against XSS attacks. An attacker who injects malicious JavaScript can't steal the payment session.
   </details>

5. **Why do we need both verify AND settle endpoints?**
   <details>
   <summary>Answer</summary>
   Verify checks if the transaction exists and succeeded. Settle checks if the transaction actually contains a transfer from the correct sender to the correct receiver with the correct amount. Without settle, someone could submit any successful transaction signature, even one that didn't pay you!
   </details>

6. **Why use Gill on the server but web3.js on the client?**
   <details>
   <summary>Answer</summary>
   Wallet adapters (Phantom, Solflare, etc.) only accept web3.js Transaction objects. So we use Gill for clean, type-safe server-side code and convert to web3.js format when communicating with wallets. This gives us the best of both worlds: modern SDK for our code, compatibility with existing wallets.
   </details>

---

## Contributing to Your Learning

As you work through this guide:

1. **Take notes** on what confuses you
2. **Try breaking things** to understand how they work
3. **Read the code** - it's well-commented
4. **Experiment** with changes
5. **Share** what you learn

---

## License

MIT License - Use this freely for learning and experimentation.

---

## Final Thoughts

**You've learned:**

- ✅ What x402 protocol is and why it matters
- ✅ How HTTP 402 enables seamless payments
- ✅ How blockchain provides payment proof
- ✅ How to verify transactions on-chain with verify + settle pattern
- ✅ How session management works
- ✅ Modern Solana development with Gill
- ✅ Type-safe development with Zod
- ✅ React hooks patterns for blockchain interactions
- ✅ The difference between learning code and production code

**Next steps:**

- Try the learning exercises (beginner → advanced)
- Read through all the code (well-commented!)
- Experiment with the hooks and components
- Explore Gill's capabilities
- Build your own x402 implementation
- Share your learnings with others

**Key Takeaways:**

- Settlement verification is crucial for security (not just transaction existence)
- Type safety (Gill + Zod) prevents many runtime errors
- Hooks make blockchain interactions testable and reusable
- Modern tooling makes Solana development more approachable

**Remember:** This is a learning tool, not production software. Use it to understand concepts, then build robust production systems with proper infrastructure, security, and testing.

Happy learning! 🎓

## Courtesy

[Kronos](https://kronos.build) team: [X402 template](https://github.com/Kronos-Guild/x402-template)
