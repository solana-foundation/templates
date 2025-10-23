import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Terms of Use | Solana DEX Analytics Template',
  description: 'Terms of use for the Solana DEX Analytics Template',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-3xl font-mono">Terms of Use</CardTitle>
            <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold font-mono text-primary mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using the Solana DEX Analytics Template, you accept and agree to be bound by the terms
                and provisions of this agreement. If you do not agree to these terms, please do not use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-mono text-primary mb-3">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                This template is a decentralized exchange interface that facilitates token swaps on the Solana
                blockchain through Jupiter Ultra's aggregation technology. We provide a user interface for interacting
                with smart contracts but do not custody funds or execute trades directly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-mono text-primary mb-3">3. User Responsibilities</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>You are responsible for maintaining the security of your wallet and private keys</li>
                <li>You must comply with all applicable laws and regulations</li>
                <li>You acknowledge the risks associated with cryptocurrency trading</li>
                <li>You are responsible for any taxes or fees associated with your transactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-mono text-primary mb-3">4. Risks and Disclaimers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cryptocurrency trading involves substantial risk of loss. Prices can be volatile, and you may lose your
                entire investment. This template is provided "as is" without warranties of any kind. We are not
                responsible for losses incurred through the use of our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-mono text-primary mb-3">5. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                The template authors and contributors shall not be liable for any direct, indirect, incidental, special,
                or consequential damages resulting from the use or inability to use our platform, including but not
                limited to loss of funds, data, or profits.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-mono text-primary mb-3">6. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our platform integrates with third-party services including Jupiter Ultra, Solana blockchain, and wallet
                providers. We are not responsible for the performance or security of these third-party services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-mono text-primary mb-3">7. Modifications to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. Continued use of the platform after changes
                constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold font-mono text-primary mb-3">8. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These terms shall be governed by and construed in accordance with applicable laws, without regard to
                conflict of law provisions.
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
