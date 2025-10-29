interface WalletAddressProps {
  address: string
}

export function WalletAddress({ address }: WalletAddressProps) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg mb-4 font-mono text-sm text-gray-700 break-all">
      ✓ Connected: {address.slice(0, 4)}...{address.slice(-4)}
    </div>
  )
}
