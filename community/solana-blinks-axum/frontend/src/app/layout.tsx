import type { Metadata } from 'next'
import { Providers } from '@/components/providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Solana Blinks',
  description: 'Solana Actions / Blinks frontend powered by @solana/kit',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-surface text-text-primary min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
