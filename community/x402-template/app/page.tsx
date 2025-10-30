import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="w-full">
          <h1 className="text-4xl font-bold mb-4">Welcome to x402 Solana Template</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This is a Next.js template with Solana payment integration using the x402 protocol.
          </p>
          <div className="flex gap-4">
            <Link
              href="/content/cheap"
              className="inline-block px-6 py-3 bg-neutral-800 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Access Cheap Content 🪣
            </Link>
            <Link
              href="/content/expensive"
              className="inline-block px-6 py-3 bg-neutral-800 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Access Expensive Content 💰
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
