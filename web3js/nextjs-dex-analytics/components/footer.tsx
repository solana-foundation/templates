import Link from 'next/link'
import { Badge } from './ui/badge'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/50">
      {/* Upper section with CTA and links */}
      <div className="bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-16">
            {/* Left: CTA Section */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
                Trade Smarter on Solana’s Analytics-Driven DEX
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl text-pretty">
                Enjoy superior Solana token swap execution, price, and protection powered by Jupiter Ultra API. <br />{' '}
                Dive into cutting-edge analytics powered by Helius, CoinGecko, and DeFiLlama data.
              </p>
            </div>

            {/* Right: Link Columns */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {/* Platform Column */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground/90 uppercase tracking-wider border-b border-primary/20 pb-2">
                  Platform
                </h3>
                <nav className="flex flex-col space-y-3">
                  <Link href="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Swap
                  </Link>
                  <Link
                    href="/dex-analytics"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Analytics
                  </Link>
                  <Link href="/#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    AI Assistant <Badge variant="outline">Coming Soon</Badge>
                  </Link>
                  <Link
                    href="/stablecoins"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Stablecoins <Badge variant="outline">Coming Soon</Badge>
                  </Link>
                </nav>
              </div>

              {/* Resources Column */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground/90 uppercase tracking-wider border-b border-primary/20 pb-2">
                  DEX Analytics
                </h3>
                <nav className="flex flex-col space-y-3">
                  <Link
                    href="/dex-analytics/orca-dex"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Orca
                  </Link>
                  <Link
                    href="/dex-analytics/raydium-amm"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Raydium
                  </Link>
                  <Link
                    href="/dex-analytics/meteora-dlmm"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Meteora
                  </Link>
                  <Link
                    href="/dex-analytics/pump.fun"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Pump.fun
                  </Link>
                </nav>
              </div>

              {/* Community Column */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground/90 uppercase tracking-wider border-b border-primary/20 pb-2">
                  Community
                </h3>
                <nav className="flex flex-col space-y-3">
                  <Link
                    href="https://x.com/Cybersage_"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Twitter
                  </Link>
                  <Link
                    href="https://arena.colosseum.org/profiles/Cybersage"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Cypherpunk Hackathon
                  </Link>
                  <Link
                    href="mailto:hello@solana-templates.dev"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Email
                  </Link>
                  <Link
                    href="https://github.com/starmorph"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    GitHub
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower section with logo and decorative pattern */}
      <div className="relative  overflow-hidden">
        {/* Decorative dot pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Gradient overlay on right side */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-primary/5 to-transparent" />

        <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo and branding */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-primary" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">SOLANA DEX</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Analytics Template</div>
              </div>
            </div>

            {/* Legal links */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/terms-of-service" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <div className="text-xs">© 2025 Solana DEX Analytics Template.</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
