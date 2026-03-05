import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import WalletContextProvider from '@/components/WalletContextProvider'
import { ToastProvider } from '@/components/Toast'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Solana Staking | Community Template',
  description:
    'A full-featured SPL token staking application built with Anchor and Next.js. Stake tokens, earn rewards, and manage your DeFi position.',
  keywords: ['solana', 'staking', 'anchor', 'defi', 'spl-token'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>
        <WalletContextProvider>
          <ToastProvider>{children}</ToastProvider>
        </WalletContextProvider>
      </body>
    </html>
  )
}
