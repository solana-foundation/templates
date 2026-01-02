import { ProductGrid } from '@/store/components/product-grid'
import { products } from '@/store/data'

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <section className="flex flex-col items-center my-12 gap-10 w-full">
        <div className="flex flex-col md:flex-row items-center px-2 md:px-0 md:gap-6 gap-4 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl h-fit uppercase font-bold max-w-xl leading-none">
            <span className="text-5xl font-black md:text-6xl lg:text-7xl h-fit block">Solana Pay</span>
            Sample Store
          </h1>
          <div className="max-w-2xl space-y-3">
            <p className="text-muted-foreground text-lg">
              An educational Next.js template demonstrating how to implement Solana Pay on your store. Receive payments
              by creating QR codes, payment links, and more.
            </p>
            <p className="text-muted-foreground text-sm">
              Verify onchain payments, and manage your products and orders. Built with Next.js 15, TypeScript, and the
              Wallet Standard.
            </p>
          </div>
        </div>
      </section>
      <div className="w-full h-px bg-border" />

      <section className="flex flex-col items-center my-12 gap-10 w-full">
        <ProductGrid products={products} />
      </section>
    </div>
  )
}
