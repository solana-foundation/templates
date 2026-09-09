import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Solana Account Index',
  description: 'Query Solana program accounts indexed in Supabase',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
