import { GridBackground } from "./components/grid-background";
import { ThemeToggle } from "./components/theme-toggle";
import { ClusterSelect } from "./components/cluster-select";
import { WalletButton } from "./components/wallet-button";
import { WalletDashboard } from "./components/wallet-dashboard";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <GridBackground />

      <div className="relative z-10">
        {/* Header */}
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-sm font-semibold tracking-tight">
            Solana Starter Kit
          </span>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ClusterSelect />
            <WalletButton />
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6">
          {/* Hero */}
          <section className="pt-6 pb-20 md:pt-8 md:pb-32">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="font-black tracking-tight text-foreground">
                  <span className="block text-7xl md:text-8xl">Solana</span>
                  <span className="block text-5xl md:text-6xl">Starter</span>
                </h1>
              </div>

              <div className="flex max-w-2xl flex-col gap-3">
                <p className="text-base leading-relaxed text-foreground/50">
                  A minimal Next.js starter for building on Solana. Connect your
                  wallet, check your balance, and request devnet SOL. Built with{" "}
                  <code className="font-mono text-sm">@solana/kit</code>,{" "}
                  <code className="font-mono text-sm">@solana/connector</code>,
                  and the wallet-standard protocol for wallet discovery.
                </p>
                <p className="text-sm leading-relaxed text-foreground/40">
                  Add your own program interaction, token transfers, or NFT
                  logic on top of this foundation. Check the{" "}
                  <a
                    href="https://github.com/solana-foundation/templates/blob/main/kit/nextjs/README.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2"
                  >
                    README
                  </a>{" "}
                  for setup instructions.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://solana.com/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-foreground/70 underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    Solana docs
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                  <a
                    href="https://www.anchor-lang.com/docs/quickstart"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-foreground/70 underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    Anchor quickstart
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                  <a
                    href="https://faucet.solana.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-foreground/70 underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    Faucet
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                  <a
                    href="https://github.com/solana-foundation/templates/blob/main/kit/nextjs/README.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-foreground/70 underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    Template README
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Template content */}
          <div className="space-y-10 pb-20">
            <WalletDashboard />
          </div>
        </main>
      </div>
    </div>
  );
}
