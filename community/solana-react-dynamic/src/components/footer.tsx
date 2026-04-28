import DynamicLogo from './dynamic/logo'

interface FooterProps {
  bottomLinks?: {
    text: string
    url: string
  }[]
}

export default function Footer({
  bottomLinks = [
    { text: 'GitHub', url: 'https://github.com/dynamic-labs-oss' },
    { text: 'Docs', url: 'https://docs.dynamic.xyz' },
    { text: 'Dashboard', url: 'https://app.dynamic.xyz' },
    { text: 'Slack', url: 'https://www.dynamic.xyz/join-slack' },
  ],
}: FooterProps) {
  return (
    <footer
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur"
      style={{ borderTop: '1px solid #DADADA' }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[#606060]">
          <div className="flex items-center gap-2">
            <span className="font-medium">powered by</span>
            <DynamicLogo width={75} height={15} className="text-[#030303]" />
          </div>
          <ul className="flex gap-4">
            {bottomLinks.map((link, linkIdx) => (
              <li key={linkIdx}>
                <a
                  href={link.url}
                  className="hover:text-[#030303] transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
