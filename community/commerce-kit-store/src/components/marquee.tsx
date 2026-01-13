import localFont from 'next/font/local'

const font = localFont({
  src: '../../public/aipointe.woff2',
})

const Divider = () => <div className="h-8 md:h-10 w-[1px] bg-[#9945FF] mx-2" />

const MarqueeText = ({ children }: { children: React.ReactNode }) => (
  <span className="text-3xl md:text-4xl mx-1 -mb-1 text-red-100/30">{children}</span>
)

const MarqueeLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-3xl md:text-4xl mx-1 -mb-1 text-red-100/30 transition-all duration-300 ease-in-out hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#9945FF] hover:to-[#14F195]"
  >
    {children}
  </a>
)

const MarqueeItems = () => (
  <>
    <Divider />
    <MarqueeText>SOLANA PAY</MarqueeText>
    <Divider />
    <MarqueeLink href="https://github.com/solana-foundation/templates">SOLANA TEMPLATES</MarqueeLink>
    <Divider />
    <MarqueeLink href="https://solana.com/">SOLANA.COM</MarqueeLink>
  </>
)

export const Marquee = () => {
  return (
    <section
      className={`w-full mx-auto border-t border-b overflow-hidden border-neutral-100 ${font.className} tracking-widest blur-[1px]`}
    >
      <div className="flex animate-[marquee_25s_linear_infinite] whitespace-nowrap">
        <div className="flex items-center shrink-0">
          <MarqueeItems />
          <MarqueeItems />
          <MarqueeItems />
          <MarqueeItems />
        </div>
        <div className="flex items-center shrink-0">
          <MarqueeItems />
          <MarqueeItems />
          <MarqueeItems />
          <MarqueeItems />
        </div>
      </div>
    </section>
  )
}
