import type { Metadata } from 'next'
import './globals.css'
import ConnexionProvider from '@/provider/ConnectionProvider'
import { ThemeProvider } from '@/provider/ThemeProvider'

export const metadata: Metadata = {
  title: 'Phantom Embedded Wallet',
  description: 'Phantom Embedded Wallet React Starter',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ConnexionProvider>{children}</ConnexionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
