# Solana DEX Analytics Template (Next.js 15)

Open-source template for building Solana DEX analytics and a swap interface using Next.js 15, TypeScript, shadcn/ui, Jupiter Ultra, Helius, CoinGecko, and DeFiLlama. Designed to align with the Solana Foundation community templates program.

## Features

- **DEX Analytics**: Protocol volumes, market share, 7d/30d trends (DeFiLlama)
- **Best Routes**: Jupiter Ultra swap routing and referral support
- **L2 Data**: Token metadata and price feeds via Helius and CoinGecko
- **Modern UI**: shadcn/ui + Tailwind + Radix primitives
- **Wallet Ready**: Solana Wallet Adapter integration

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Package Manager**: pnpm
- **UI Components**: Radix UI / shadcn/ui
- **Styling**: Tailwind CSS
- **Blockchain**: Solana Web3.js
- **Wallet**: Solana Wallet Adapter
- **Swap Aggregator**: Jupiter Ultra
- **Analytics**: Vercel Analytics
- **Data Sources**: Helius, CoinGecko, DeFiLlama

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## SEO & Template Guide

This project includes comprehensive SEO optimization and follows the Solana community template guidance. See: [Solana Community Template Guide](https://github.com/solana-foundation/templates/blob/main/COMMUNITY_TEMPLATE_GUIDE.md).

- **Metadata**: Complete Open Graph and Twitter Card metadata
- **Sitemap**: Dynamic sitemap generation (`/sitemap.xml`)
- **Robots.txt**: Search engine crawler instructions
- **Manifest**: PWA manifest for mobile optimization
- **Structured Data**: JSON-LD schema for rich search results
- **OG Images**: Static Open Graph image included (`app/opengraph-image.png`)
- **Semantic HTML**: Proper heading hierarchy and ARIA labels

### SEO Configuration

Update the following files with your actual values:

1. **`app/layout.tsx`**: Uses `NEXT_PUBLIC_SITE_URL` for canonical/OG. Update verification codes.
2. **`app/sitemap.ts`**: Add additional pages as your app grows
3. **`public/manifest.json`**: Customize theme colors and icons
4. **Social**: Add your social handles in metadata if desired

### Icons & Images Needed

Place the following files in the `/public` directory (optional):

- `favicon.ico` - Browser favicon
- `icon.svg` - Vector icon
- `apple-touch-icon.png` - 180x180 Apple touch icon
  If you add PWA icons, also update `public/manifest.json` accordingly.

## Project Structure

```
solana-dex-analytics-template/
├── app/
│   ├── layout.tsx          # Root layout with SEO metadata
│   ├── page.tsx            # Home page
│   ├── sitemap.ts          # Dynamic sitemap
│   ├── opengraph-image.tsx # OG image generator
│   └── jsonld.tsx          # Structured data
├── components/
│   ├── navbar.tsx
│   ├── swap-interface.tsx
│   ├── stats-bar.tsx
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── jupiter-ultra.ts    # Jupiter swap integration
│   ├── solana-tokens.ts    # Token definitions
│   └── utils.ts            # Utility functions
└── public/
    ├── robots.txt          # Crawler instructions
    └── manifest.json       # PWA manifest (update icons if you add them)
```

### Environment Variables

Create a `.env.local` file:

See `env.example` for the required variables.

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_ULTRA_REFERRAL_ACCOUNT=
NEXT_PUBLIC_ULTRA_REFERRAL_FEE_BPS=50
```

## Deployment

This project is optimized for deployment on Vercel:

```bash
pnpm build
```

## License

MIT. Attribution appreciated.

---

Built with ❤️ for the Solana community.
