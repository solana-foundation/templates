import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import PrivyClientProvider from '@/components/providers/privy-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Privy Auth | Minimalist Template',
  description:
    'A minimalist Solana dApp template with Privy authentication — social logins, embedded wallets, and protected routes.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <PrivyClientProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </PrivyClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
