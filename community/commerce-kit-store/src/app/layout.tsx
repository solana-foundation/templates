import type { Metadata } from 'next'
import './globals.css'
import { AppProviders } from '@/components/app-providers'
import { CartProvider } from '@/store/providers/cart-provider'
import { Navbar } from '@/components/navbar'
import { Toaster } from 'sonner'
import NoiseBackground from '@/components/noise-background'

export const metadata: Metadata = {
  title: 'Solana Pay Store',
  description: 'An educational Next.js template demonstrating how to implement Solana Pay on your store',
  openGraph: {
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <NoiseBackground />
        <AppProviders>
          <CartProvider>
            <Navbar />
            <main className="">{children}</main>
            <Toaster />
          </CartProvider>
        </AppProviders>
      </body>
    </html>
  )
}
// Patch BigInt so we can log it using JSON.stringify without any errors
declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}
