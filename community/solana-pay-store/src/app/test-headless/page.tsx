import { TestHeadlessPayment } from '@/components/test-headless-payment'

export default function TestHeadlessPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Commerce Kit Headless Payment Test</h1>
        <p className="text-muted-foreground mb-8">
          Testing the @solana-commerce/headless payment flow with @solana/client (no web3.js)
        </p>
        <TestHeadlessPayment />
      </div>
    </main>
  )
}
