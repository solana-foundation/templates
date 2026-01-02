import type { Metadata } from 'next'
import './globals.css'
import { AppProviders } from '@/components/app-providers'
import { CartProvider } from '@/store/providers/cart-provider'
import { Navbar } from '@/components/navbar'
import { Toaster } from 'sonner'
import React from 'react'

export const metadata: Metadata = {
  title: 'Solana Pay Store',
  description: 'An educational Next.js template demonstrating how to implement Solana Pay on your store',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <AppProviders>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
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
