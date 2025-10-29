import { env } from '@/lib/env'

export function PriceBox() {
  const formattedAmount = env.NEXT_PUBLIC_PAYMENT_AMOUNT_USD.toFixed(2)

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6 border-2 border-[#14F195]">
      <div className="text-xs uppercase tracking-wider text-gray-600 mb-2">Price</div>
      <div className="text-5xl font-extrabold bg-gradient-to-r from-[#14F195] to-[#9945FF] bg-clip-text text-transparent mb-2">
        ${formattedAmount}
      </div>
      <div className="text-sm text-gray-500">USDC on Solana Devnet</div>
    </div>
  )
}
