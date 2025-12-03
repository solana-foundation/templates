import type { Metadata } from 'next'
import './globals.css'
import ConnectionProvider from '@/provider/ConnectionProvider'
import { ThemeProvider } from '@/provider/ThemeProvider'

export const metadata: Metadata = {
  title: 'Phantom Embedded Wallet',
  description: 'Built with Phantom Connect SDK - React Starter',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ConnectionProvider>{children}</ConnectionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
