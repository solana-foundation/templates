import type { Metadata } from 'next'
import './globals.css'
import config from '../../oar.config.json'

export const metadata: Metadata = {
  title: config.name,
  description: 'An OAR-ready Solana application, not yet registered or verified.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
