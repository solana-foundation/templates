# API Definitions

This folder contains modular API endpoint definitions. Each API is a self-contained TypeScript module that handles its own logic.

## Fully Automatic System

**Just drop a new `*API.ts` file in this folder and it automatically:**

- Gets discovered and registered (using Vite's `import.meta.glob`)
- Generates the UI (button, response box, styling)
- Sets up event listeners
- Matches the existing visual design
- Type-safe with TypeScript
- No manual registration needed!
- No HTML editing needed!

**File naming:** Your file must end with `API.ts` (e.g., `StatusAPI.ts`, `MyNewAPI.ts`)

## How to Add a New API (1 Step!)

### 1. Create a New API File

Create a new file in this folder (must end with `API.ts`), e.g., `MyCustomAPI.ts`:

```typescript
import { BaseAPI } from './BaseAPI'
import { log } from '../utils/logger'

/**
 * My Custom API
 * Description of what this API does
 */
export class MyCustomAPI extends BaseAPI {
  constructor() {
    super({
      name: 'My Custom Endpoint',
      path: '/api/my-custom',
      method: 'POST', // or 'GET'
      description: 'What this endpoint does',
      requiresPayment: false, // true if requires payment
      buttonId: 'test-my-custom-btn',
      responseId: 'my-custom-response',
    })
  }

  // Optional: Override if you need custom logic
  async call(apiBaseUrl: string): Promise<any> {
    log('info', 'Custom logic before calling API...')

    // Call parent implementation
    const result = await super.call(apiBaseUrl)

    log('info', 'Custom logic after calling API...')
    return result
  }

  // Optional: Override for custom headers or request body
  async makeRequest(apiBaseUrl: string, options: RequestInit = {}): Promise<Response> {
    return super.makeRequest(apiBaseUrl, {
      ...options,
      headers: {
        'Custom-Header': 'value',
        ...options.headers,
      },
      body: JSON.stringify({ customData: 'value' }),
    })
  }
}
```

### That's It!

Your API is now fully integrated and will automatically:

- Get type-checked at compile time
- Set up event listeners on page load
- Handle requests and responses
- Log activity to the activity log
- Display results in the UI

## BaseAPI Reference

### Constructor Options (APIConfig interface)

```typescript
interface APIConfig {
  name: string // Display name for the API
  path: string // API endpoint path (e.g., `/api/my-endpoint`)
  method: string // HTTP method (`GET`, `POST`, etc.)
  description?: string // Description of what the API does
  requiresPayment?: boolean // Whether this endpoint requires x402 payment
  buttonId: string // HTML element ID of the test button
  responseId: string // HTML element ID of the response container
}
```

### Methods You Can Override

#### `async call(apiBaseUrl: string): Promise<APIResponse | null>`

Main method that handles the API call. Override for custom pre/post processing.

#### `async makeRequest(apiBaseUrl: string, options: RequestInit = {}): Promise<Response>`

Makes the actual HTTP request. Override to customize headers, body, etc.

## Examples

### Simple GET Endpoint

```typescript
import { BaseAPI } from './BaseAPI'

export class StatusAPI extends BaseAPI {
  constructor() {
    super({
      name: 'Status Check',
      path: '/api/status',
      method: 'GET',
      buttonId: 'test-status-btn',
      responseId: 'status-response',
    })
  }
}
```

### POST with Custom Body

```typescript
import { BaseAPI } from './BaseAPI'

interface CreateUserBody {
  username: string
  email: string
}

export class CreateUserAPI extends BaseAPI {
  constructor() {
    super({
      name: 'Create User',
      path: '/api/users',
      method: 'POST',
      buttonId: 'create-user-btn',
      responseId: 'user-response',
    })
  }

  async makeRequest(apiBaseUrl: string, options: RequestInit = {}): Promise<Response> {
    const userData: CreateUserBody = {
      username: 'testuser',
      email: 'test@example.com',
    }

    return super.makeRequest(apiBaseUrl, {
      ...options,
      body: JSON.stringify(userData),
    })
  }
}
```

### API with Custom Authentication

```typescript
import { BaseAPI } from './BaseAPI'

export class AuthenticatedAPI extends BaseAPI {
  constructor() {
    super({
      name: 'Protected Resource',
      path: '/api/protected',
      method: 'GET',
      buttonId: 'test-protected-btn',
      responseId: 'protected-response',
    })
  }

  async makeRequest(apiBaseUrl: string, options: RequestInit = {}): Promise<Response> {
    const token = localStorage.getItem('auth_token')

    return super.makeRequest(apiBaseUrl, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    })
  }
}
```

## Payment Endpoints

For endpoints that require x402 payment, see `PaidAPI.ts` as a reference. Payment endpoints need to:

1. Set `requiresPayment: true`
2. Implement payment transaction building
3. Include the payment payload in the `X-PAYMENT` header

The `PaidAPI` class has complete examples of:

- Building Solana payment transactions with full type safety
- Creating x402 payment payloads
- Handling payment verification

## Utilities Available

All APIs have access to these typed utilities:

```typescript
import { log } from '../utils/logger'
import { getWallet, getConnection } from '../utils/wallet'
import { getCurrentNetwork } from '../utils/network'
```

- **log(type: LogType, message: string)**: Log to activity feed (`'info'`, `'success'`, `'error'`)
- **getWallet(): Keypair | null**: Get the loaded wallet
- **getConnection(): Connection | null**: Get the Solana connection
- **getCurrentNetwork(): NetworkType**: Get current network (`'devnet'` or `'mainnet'`)

## TypeScript Benefits

This codebase is fully TypeScript with strict mode enabled:

- Full type safety and autocomplete
- Compile-time error detection
- Better IDE support
- Self-documenting code with interfaces
- Refactoring safety

The auto-discovery system works seamlessly with TypeScript - just create a new `*API.ts` file and everything else happens automatically!
