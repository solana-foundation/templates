export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="w-full">
          <h1 className="text-4xl font-bold mb-4">Welcome to x402 Solana Template</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This is a Next.js template with Solana payment integration using the x402 protocol.
          </p>
          <a
            href="/protected"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#14F195] to-[#9945FF] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Go to Protected Page
          </a>
        </div>
      </main>
    </div>
  )
}
