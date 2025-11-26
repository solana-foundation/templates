import SocialLinks from './SocialLinks'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <SocialLinks textSize="text-lg" />
          <div className="text-lg text-gray-400">
            Powered by{' '}
            <span className="font-semibold bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text">
              SOLANA
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
