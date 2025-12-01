# Phantom Embedded Wallet React Starter

A modern, production-ready starter template for building Solana dApps with the [Phantom Connect SDK](https://docs.phantom.com).

## Features

- ⚡️ **Next.js 16** - Latest App Router with React Server Components
- 👻 **Phantom Connect SDK** - Integrated wallet with built-in modal UI
- 🎨 **Tailwind CSS** - Utility-first styling with custom design tokens
- 🌗 **Dark Mode** - Built-in dark mode support
- 📱 **Responsive** - Mobile-first responsive design
- 🔐 **TypeScript** - Full type safety

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [@phantom/react-sdk](https://docs.phantom.com) - Phantom Connect SDK for React
- [@phantom/browser-sdk](https://docs.phantom.com) - Phantom Connect SDK core
- [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/) - Solana JavaScript API
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd phantom-embedded-react-starter
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
```

3. Copy the environment variables:

```bash
cp .env.example .env.local
```

4. Update the environment variables in `.env.local` with your configuration.

### Development

Run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### Build

Build the application for production:

```bash
pnpm build
# or
npm run build
```

### Start Production Server

```bash
pnpm start
# or
npm start
```

## Project Structure

```
phantom-embedded-react-starter/
├── public/              # Static assets
│   └── phantom-logo.png
├── src/
│   └── app/            # Next.js App Router
│       ├── globals.css # Global styles with design tokens
│       ├── layout.tsx  # Root layout
│       └── page.tsx    # Home page
├── .env.example        # Environment variables template
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # Tailwind configuration
└── tsconfig.json       # TypeScript configuration
```

## Design System

This starter uses a custom design token system for consistent theming:

- **Color Tokens**: Defined in `globals.css` using CSS variables
- **Tailwind Integration**: Design tokens mapped to Tailwind utilities
- **Dark Mode**: Automatic dark mode support via `prefers-color-scheme`

### Key Design Tokens

- `--color-brand`: Primary brand color
- `--color-ink`: Primary text color
- `--color-paper`: Background color
- Additional semantic colors for states (success, warning, info)

## Environment Variables

See `.env.example` for required environment variables.

## License

ISC

## Learn More

- [Phantom Connect SDK Docs](https://docs.phantom.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Solana Web3.js Documentation](https://solana-labs.github.io/solana-web3.js/)
