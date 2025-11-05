# AtomID Verification Template

A production-ready Solana template for implementing permanent onchain identity, proof-of-sacrifice verification, and rank-based access control using the [AtomID SDK](https://github.com/astrohackerx/AtomID).

## What is AtomID?

AtomID is a groundbreaking decentralized identity protocol on Solana that creates **permanent, soulbound cryptographic identities** through proof-of-sacrifice. It represents a paradigm shift in how identity and commitment are verified onchain.

### Key Innovations

🔐 **Permanent Soulbound Identity**
Non-transferable, cryptographic identities that prove longterm commitment and cannot be bought or sold.

🏛️ **First PDA-Owned Attestation Issuer on Solana**
AtomID is the first protocol to implement autonomous, program-derived address (PDA) ownership of attestation issuance in the Solana ecosystem.

🛡️ **Solana Attestation Service (SAS) Integration**
Built on SAS, the official Solana Foundation-supported attestation infrastructure, ensuring enterprise-grade verification and interoperability.

🔥 **Proof of Sacrifice**
Users permanently burn $ATOM tokens to advance through 10 ranks (0-9), demonstrating irreversible commitment that can't be faked or gamed.

### Why AtomID Matters

Traditional blockchain identity systems rely on holdings that can be borrowed or temporarily acquired. AtomID solves this by requiring permanent sacrifice:

- **Unfakeable Commitment**: Burned tokens prove genuine skin-in-the-game
- **Sybil Resistance**: Economic cost prevents identity farming
- **Trustless Verification**: No centralized authority needed
- **Ecosystem-Wide Recognition**: SAS attestations work across all Solana dApps
- **Autonomous Operation**: PDA-owned issuance requires no human intervention

### Technical Architecture

AtomID leverages cutting-edge Solana primitives:

- **SAS (Solana Attestation Service)**: Official attestation standard backed by Solana Foundation
- **PDA-Owned Attestation Issuer**: Autonomous, permissionless credential issuance
- **Onchain Schema Registry**: Standardized attestation format for interoperability
- **Verifiable Credentials**: Cryptographically signed, tamper-proof identity proofs

### Rank System

Users progress through 10 ranks by burning increasing amounts of $ATOM:

- 🌱 **Rank 0: Initiate** - Entry level (0-999 $ATOM)
- 🔥 **Rank 1: Believer** - Early commitment
- 💎 **Rank 2: Devotee** - Growing dedication
- 🛡️ **Rank 3: Guardian** - Proven loyalty
- 🗝️ **Rank 4: Keeper** - Trusted member
- 🔮 **Rank 5: Oracle** - 50,000+ $ATOM burned
- ⚡ **Rank 6: Architect** - Elite tier
- 🌟 **Rank 7: Sage** - Master level
- 👑 **Rank 8: Ascended** - Nearly complete
- ♾️ **Rank 9: Eternal** - Maximum commitment (1M+ $ATOM)

## Template Features

This template provides everything needed to integrate AtomID verification into your Solana application:

### Core Features

- ✅ **Wallet Integration**: Multi-wallet support via Solana wallet adapter
- ✅ **Real-Time Verification**: Instant rank checking and display
- ✅ **Access Control**: Gate features, content, and actions by rank
- ✅ **Leaderboard**: Display top AtomID holders
- ✅ **Progress Tracking**: Show users their path to next rank
- ✅ **React Hooks**: Simple integration with `useAtomID` and `AtomIDGate`
- ✅ **TypeScript**: Full type safety and IntelliSense
- ✅ **Responsive Design**: Mobile-first UI with Tailwind CSS
- ✅ **Production Ready**: Optimized and battle-tested components

### Use Cases

**DeFi Protocols**

- Tier-based trading limits and fee structures
- Lending risk assessment based on commitment
- Governance voting weight

**NFT Marketplaces**

- Creator verification and reputation
- Collector status tiers
- Early access to drops

**Social Platforms**

- Bot filtering and Sybil resistance
- Verification badges
- Reputation systems

**Gaming**

- Achievement systems
- Leaderboards and competitive rankings
- Exclusive access to game modes

**DAOs**

- Membership tiers
- Proposal creation rights
- Voting power allocation

## Quick Start

### Prerequisites

- Node.js 20 or higher
- pnpm or npm

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SOLANA_RPC_URL=your_rpc_url_here
```

Get a free RPC endpoint from:

- [Helius](https://helius.dev)
- [QuickNode](https://quicknode.com)
- Or use the public endpoint: `https://api.mainnet-beta.solana.com`

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Build

```bash
npm run build
```

## Usage Examples

### 1. Verify a Wallet's Rank

```tsx
import { useAtomID } from 'atomid-sdk/react'
import { useWallet } from '@solana/wallet-adapter-react'

function RankDisplay() {
  const { publicKey } = useWallet()
  const { account, isLoading } = useAtomID(publicKey)

  if (isLoading) return <div>Loading...</div>
  if (!account) return <div>No AtomID found</div>

  return (
    <div>
      Your rank: {account.rank}
      Total burned: {account.totalBurned} $ATOM
    </div>
  )
}
```

### 2. Gate Content by Rank

```tsx
import { AtomIDGate } from 'atomid-sdk/react'
import { useWallet } from '@solana/wallet-adapter-react'

function PremiumContent() {
  const { publicKey } = useWallet()

  return (
    <AtomIDGate wallet={publicKey} minRank={5} fallback={<div>Requires Oracle rank (5) or higher</div>}>
      <div>🔮 Premium Oracle-level content unlocked!</div>
    </AtomIDGate>
  )
}
```

### 3. Display Leaderboard

```tsx
import { AtomIDClient } from 'atomid-sdk'
import { useEffect, useState } from 'react'

function Leaderboard() {
  const [leaders, setLeaders] = useState([])

  useEffect(() => {
    const client = new AtomIDClient({
      rpcUrl: import.meta.env.VITE_SOLANA_RPC_URL,
    })

    client.getLeaderboard(10).then(setLeaders)
  }, [])

  return (
    <div>
      {leaders.map((account, i) => (
        <div key={i}>
          #{i + 1} - {account.wallet.toString()} - Rank {account.rank}
        </div>
      ))}
    </div>
  )
}
```

### 4. Direct SAS Attestation Verification

```tsx
import { PublicKey } from '@solana/web3.js'

// Verify attestation exists for a wallet
const [attestationPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from('attestation'), CREDENTIAL_PDA.toBuffer(), SCHEMA_PDA.toBuffer(), userWallet.toBuffer()],
  SAS_PROGRAM_ID,
)

// Read attestation data
const attestation = await connection.getAccountInfo(attestationPDA)
```

## Project Structure

```
.
├── src/
│   ├── components/
│   │   ├── Header.tsx           # Wallet connection header
│   │   ├── RankDisplay.tsx      # User rank display
│   │   ├── RankProgress.tsx     # Progress to next rank
│   │   ├── GatedContent.tsx     # Rank-gated features demo
│   │   ├── Leaderboard.tsx      # Top holders leaderboard
│   │   ├── RankTable.tsx        # All ranks reference table
│   │   ├── UseCases.tsx         # Example use cases
│   │   └── WalletProvider.tsx   # Wallet context setup
│   ├── App.tsx                  # Main application
│   └── main.tsx                 # Entry point
├── package.json                 # Dependencies and scripts
├── og-image.svg                 # Social media preview image
└── README.md                    # This file
```

## Integration Approaches

### Option 1: Full AtomID Program Integration

For apps that need to create AtomIDs or upgrade ranks:

```tsx
import { AtomIDProgram } from 'atomid-sdk'

// Create new AtomID
await AtomIDProgram.createAtomID(wallet, initialBurnAmount)

// Upgrade rank
await AtomIDProgram.upgradeRank(wallet, additionalBurnAmount)
```

### Option 2: SAS-Only Integration (Read-Only)

For apps that only need to verify existing AtomIDs:

```tsx
import { useAtomID } from 'atomid-sdk/react'

// Lightweight verification
const { account } = useAtomID(walletPublicKey)
if (account && account.rank >= 5) {
  // Grant access
}
```

This approach is permissionless and requires no program calls.

## Customization

### Add Custom Gated Features

Edit `src/components/GatedContent.tsx` to add your own rank-gated features:

```tsx
<GatedFeature minRank={7} title="Your Feature Name" description="Feature description" icon="crown" />
```

### Change Styling

This template uses Tailwind CSS. Customize colors in `tailwind.config.js` or modify component styles directly.

### Adjust RPC Configuration

Update the RPC endpoint in `.env` to use your preferred provider for optimal performance.

## Advanced: SAS Schema Details

AtomID attestations use the following schema structure:

```rust
pub struct AtomIDAttestation {
    pub rank: u8,              // Current rank (0-9)
    pub total_burned: u64,     // Total $ATOM burned
    pub created_at: i64,       // Timestamp of creation
}
```

This schema is registered onchain and can be read by any Solana program or dApp.

## Resources

- [AtomID SDK Documentation](https://github.com/astrohackerx/AtomID)
- [Lost Bitcoin Layer (AtomID Protocol)](https://lostatom.org)
- [Solana Attestation Service](https://github.com/solana-foundation/solana-attestation-service)
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)
- [AtomID NPM Package](https://www.npmjs.com/package/atomid-sdk)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues or questions:

- AtomID SDK: [GitHub Issues](https://github.com/astrohackerx/AtomID/issues)
- Lost Bitcoin Layer: [Discord](https://discord.gg/lostatom)
- Template Issues: Open an issue in this repository
