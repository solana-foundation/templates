export default function HowItWorks() {
  return (
    <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/20 rounded-2xl p-8">
      <h3 className="text-2xl font-bold mb-4">How it works</h3>
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <div className="w-10 h-10 bg-[#9945FF]/20 rounded-lg flex items-center justify-center mb-3 font-bold text-[#9945FF]">
            1
          </div>
          <h4 className="font-bold mb-2">Connect Wallet</h4>
          <p className="text-sm text-gray-400">Connect your Solana wallet (Phantom, Solflare, etc.)</p>
        </div>
        <div>
          <div className="w-10 h-10 bg-[#14F195]/20 rounded-lg flex items-center justify-center mb-3 font-bold text-[#14F195]">
            2
          </div>
          <h4 className="font-bold mb-2">Choose Tier</h4>
          <p className="text-sm text-gray-400">Select a tier and click "Fetch Data" to make a request</p>
        </div>
        <div>
          <div className="w-10 h-10 bg-[#9945FF]/20 rounded-lg flex items-center justify-center mb-3 font-bold text-[#9945FF]">
            3
          </div>
          <h4 className="font-bold mb-2">Automatic Payment</h4>
          <p className="text-sm text-gray-400">SPL-402 handles payment verification automatically</p>
        </div>
      </div>
    </div>
  )
}
