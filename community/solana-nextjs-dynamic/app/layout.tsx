import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/header'
import Footer from '@/components/footer'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Solana + Dynamic',
  description: 'Solana Next.js starter with Dynamic wallet authentication',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={roboto.className} suppressHydrationWarning={true}>
        <Providers>
          <Header />
          <div className="min-h-screen pb-16" style={{ background: 'rgb(249,249,249)' }}>
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
