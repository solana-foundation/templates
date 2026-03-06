import { Shield, Github } from 'lucide-react'
import Link from 'next/link'

/**
 * Enhanced footer with resource links and branding.
 */
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link href="/" className="navbar-brand">
            <Shield size={20} />
            <span className="footer-brand-title">Privy Auth Template</span>
          </Link>
          <p className="footer-brand-desc">
            A minimalist starting point for Solana dApps with embedded wallets and social authentication.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Resources</h4>
            <a href="https://docs.privy.io" target="_blank" rel="noopener noreferrer">
              Privy Documentation
            </a>
            <a href="https://dashboard.privy.io" target="_blank" rel="noopener noreferrer">
              Privy Dashboard
            </a>
            <a href="https://solana.com/developers" target="_blank" rel="noopener noreferrer">
              Solana Developers
            </a>
          </div>

          <div className="footer-col">
            <h4>Community</h4>
            <a
              href="https://github.com/solana-developers/solana-templates"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <Github size={14} /> GitHub Template
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Built for the Solana Foundation Templates repo.</p>
        <p className="flex items-center gap-1">
          Powered by
          <a
            href="https://privy.io"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground text-primary font-medium"
          >
            Privy
          </a>
        </p>
      </div>
    </footer>
  )
}
