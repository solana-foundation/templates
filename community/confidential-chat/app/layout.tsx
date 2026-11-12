import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Confidential Chat',
  description: 'A chat encrypted in the browser to an attested enclave',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
