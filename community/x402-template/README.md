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
      "network": "solana-devnet",
      "extra": {
        "feePayer": "2wKupLR9q6w..."
      }
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
        extra: {
          feePayer: process.env.TREASURY_WALLET_ADDRESS,
        },
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
       │ "Yes, valid!" or "No, invalid because..."
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
│         ↓                            │
│  ┌──────────────────────────────┐   │
│  │ app/api/facilitator/         │   │
│  │   verify/route.ts            │   │
│  └──────┬───────────────────────┘   │
└─────────┼──────────────────────────┘
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
- **Wallet:** Phantom
- **Framework:** Next.js
- **Price:** 0.01 USDC per access

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                             │
│  ┌──────────────┐           ┌──────────────┐                │
│  │ Phantom      │           │ Paywall UI   │                │
│  │ Wallet       │◄─────────►│ (HTML)       │                │
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
│  │ • Returns 402 if no payment                          │   │
│  │ • Verifies X-PAYMENT header                          │   │
│  └────────────┬─────────────────────────────────────────┘   │
│               │                                             │
│  ┌────────────▼─────────────────────────────────────────┐   │
│  │ lib/x402-verification.ts                             │   │
│  │ • Calls facilitator                                  │   │
│  │ • Manages transaction storage                        │   │
│  └────────────┬─────────────────────────────────────────┘   │
│               │                                             │
│  ┌────────────▼─────────────────────────────────────────┐   │
│  │ app/api/facilitator/verify/route.ts                  │   │
│  │ • Validates payment parameters                       │   │
│  │ • Fetches transaction from Solana                    │   │
│  │ • Verifies transaction succeeded                     │   │
│  └────────────┬─────────────────────────────────────────┘   │
└───────────────┼─────────────────────────────────────────────┘
                │
                │ RPC calls
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

  // No valid payment found...
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
  const accept = request.headers.get('Accept')
  const userAgent = request.headers.get('User-Agent')

  // Browser gets HTML paywall
  if (accept?.includes('text/html') && userAgent?.includes('Mozilla')) {
    const response = new NextResponse(solanaPaywallHtml, {
      status: 402,
      headers: { 'Content-Type': 'text/html' },
    })
    return response
  }

  // API clients get JSON with payment requirements
  const response = NextResponse.json(
    {
      x402Version: 1,
      error: 'Payment required',
      accepts: [
        {
          scheme: 'exact',
          network: 'solana-devnet',
          maxAmountRequired: X402_CONFIG.REQUIRED_AMOUNT, // "10000"
          payTo: X402_CONFIG.TREASURY_ADDRESS,
          asset: X402_CONFIG.USDC_DEVNET_MINT,
        },
      ],
    },
    { status: 402 },
  )

  return response
}
```

**What happens:**

- Browser users see beautiful HTML paywall with Phantom integration
- API clients get structured JSON with payment requirements
- Both responses use **HTTP 402** status code
- Response tells client exactly how to pay (network, amount, token, address)

### Step 3: Client Makes Payment on Solana

**File:** `lib/paywall-template.ts` (simplified)

```javascript
// User clicks "Pay with Phantom"
async function makePayment() {
  // 1. Connect to Phantom wallet
  const walletProvider = window.phantom?.solana
  const response = await walletProvider.connect()
  const walletAddress = response.publicKey.toString()

  // 2. Create USDC transfer transaction
  const transaction = new solanaWeb3.Transaction()
  const transferInstruction = createTransferCheckedInstruction(
    senderTokenAccount, // User's USDC account
    usdcMint,
    treasuryTokenAccount, // Our treasury
    senderPubkey, // User's wallet
    10000, // 0.01 USDC
    6, // USDC decimals
  )
  transaction.add(transferInstruction)

  // 3. User signs and sends transaction
  const { signature } = await walletProvider.signAndSendTransaction(transaction)

  // 4. Wait for confirmation
  await connection.confirmTransaction(signature, 'finalized')

  // 5. Send payment proof to server
  const paymentData = {
    x402Version: 1,
    scheme: 'exact',
    network: 'solana-devnet',
    payload: {
      signature: signature, // Transaction ID
      from: walletAddress, // Who paid
      to: TREASURY_ADDRESS, // Where payment went
      amount: '10000', // How much
      token: USDC_DEVNET_MINT, // What token
    },
  }

  // Retry original request with payment proof
  const response = await fetch(window.location.href, {
    method: 'GET',
    headers: {
      'X-PAYMENT': JSON.stringify(paymentData),
    },
  })
}
```

**What happens:**

- User connects Phantom wallet
- Creates USDC transfer transaction on Solana
- Phantom prompts user to approve transaction
- Transaction broadcasts to Solana network
- Client waits for blockchain confirmation
- Client constructs x402 payment header with proof
- Client retries original request with `X-PAYMENT` header

### Step 4: Server Verifies Payment

**File:** `lib/x402-verification.ts`

```typescript
export async function verifyPayment(payment: Payment, resource: string): Promise<VerificationResult> {
  const { signature, from, to, amount } = payment.payload

  // Check if we already verified this transaction
  if (await transactionStorage.has(signature)) {
    return { isValid: true, signature }
  }

  // Build payment requirements for facilitator
  const paymentRequirements = {
    scheme: 'exact',
    network: 'solana-devnet',
    maxAmountRequired: X402_CONFIG.REQUIRED_AMOUNT,
    payTo: X402_CONFIG.TREASURY_ADDRESS,
    asset: X402_CONFIG.USDC_DEVNET_MINT,
  }

  // Call facilitator to verify on-chain
  const verifyResponse = await fetch(`${X402_CONFIG.FACILITATOR_BASE_URL}/verify`, {
    method: 'POST',
    body: JSON.stringify({ payment, paymentRequirements }),
  })

  const result = await verifyResponse.json()

  if (result.isValid) {
    // Store signature to prevent replay attacks
    await transactionStorage.add(signature, { from, to, amount })
    console.log('Payment verified successfully:', signature)
  }

  return result
}
```

**What happens:**

- Extract transaction signature from payment header
- Check if we've already verified this transaction (prevent replay)
- Call facilitator service to verify payment
- Facilitator checks blockchain to confirm transaction
- If valid, store signature in verified transactions
- Return verification result

### Step 5: Facilitator Checks Blockchain

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

  // Fetch transaction from Solana
  const connection = new Connection('https://api.devnet.solana.com')
  const transaction = await connection.getTransaction(signature, {
    maxSupportedTransactionVersion: 0,
  })

  if (!transaction) {
    return NextResponse.json({ isValid: false, reason: 'Transaction not found' })
  }

  // Check if transaction succeeded
  if (transaction.meta?.err) {
    return NextResponse.json({ isValid: false, reason: 'Transaction failed' })
  }

  // All checks passed!
  return NextResponse.json({
    isValid: true,
    transactionId: signature,
  })
}
```

**What happens:**

- Receives payment and requirements from verifier
- Validates payment parameters match requirements
- Connects to Solana RPC endpoint
- Fetches actual transaction from blockchain
- Verifies transaction exists and succeeded
- Returns verification result

### Step 6: Grant Access with Session

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

## Learning Exercises

Now that you understand the flow, try these exercises:

### Beginner

1. **Change the Price**
   - Edit `lib/x402-config.ts`
   - Change `REQUIRED_AMOUNT` to `"20000"` (0.02 USDC)
   - Test the payment flow

2. **Customize the Paywall**
   - Edit `lib/paywall-template.ts`
   - Change colors, text, or styling
   - See your changes at `/protected`

3. **Add a New Protected Route**
   - Create `app/premium/page.tsx`
   - Access it - should show paywall
   - Why? Check `proxy.ts` matcher config

### Intermediate

4. **Track Payment Analytics**
   - Add logging to `lib/x402-verification.ts`
   - Log: timestamp, amount, from address
   - Build a simple analytics view

5. **Different Prices for Different Routes**
   - Modify `proxy.ts` to check pathname
   - Set different `REQUIRED_AMOUNT` based on route
   - `/protected` = 0.01 USDC, `/premium` = 0.05 USDC

6. **Add Payment Expiry**
   - Modify `lib/transaction-storage.ts`
   - Add shorter TTL (e.g., 1 hour instead of 24)
   - Test cookie expiration

### Advanced

7. **Implement Mainnet Support**
   - Add mainnet configuration
   - Handle both devnet and mainnet
   - Add network selection UI

8. **Build Redis Storage**
   - Replace `lib/transaction-storage.ts`
   - Use Redis for distributed caching
   - Handle multiple server instances

9. **Add Webhook Notifications**
   - Create `/api/webhooks` endpoint
   - Send notifications on successful payment
   - Integrate with Discord/Slack

---

## What This Project Is

✅ **An Educational Tool**

- Learn x402 protocol concepts
- Understand Solana payments
- See blockchain verification in action
- Study clean TypeScript architecture

✅ **A Working Demonstration**

- Complete payment flow end-to-end
- Real Solana transactions on devnet
- Functional Phantom wallet integration
- Verifiable on Solana Explorer

✅ **A Starting Point**

- Clean, modular codebase (71 line middleware!)
- Well-documented and commented
- Easy to understand and modify
- Foundation for your own system

✅ **Best Practices Example**

- Separation of concerns
- Type-safe TypeScript
- Secure cookie handling
- On-chain verification

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
git clone <your-repo-url>
cd x402-template

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

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
│   ├── x402-config.ts          # ⚙️  Configuration
│   ├── x402-responses.ts       # 📄 402 responses
│   ├── x402-verification.ts    # ✅ Payment verification
│   ├── transaction-storage.ts  # 💾 Storage layer
│   └── paywall-template.ts     # 🎨 HTML paywall UI
├── app/
│   ├── api/facilitator/
│   │   ├── verify/route.ts     # 🔍 Blockchain verification
│   │   ├── settle/route.ts     # 💰 Settlement (optional)
│   │   └── supported/route.ts  # 📋 Supported methods
│   ├── protected/page.tsx      # 🔒 Protected content
│   └── page.tsx                # 🏠 Public homepage
├── proxy.ts                    # 🛡️  x402 middleware (71 lines!)
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
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/) - JavaScript SDK
- [Solana Explorer](https://explorer.solana.com/) - View transactions

### Tools

- [Phantom Wallet](https://phantom.app/) - Solana wallet
- [Circle USDC Faucet](https://faucet.circle.com/) - Get test USDC
- [Solana Faucet](https://faucet.solana.com/) - Get test SOL

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
- ✅ How to verify transactions on-chain
- ✅ How session management works
- ✅ The difference between learning code and production code

**Next steps:**

- Try the learning exercises
- Read through all the code
- Experiment with modifications
- Build your own x402 implementation
- Share your learnings with others

**Remember:** This is a learning tool, not production software. Use it to understand concepts, then build robust production systems with proper infrastructure, security, and testing.

Happy learning! 🎓
