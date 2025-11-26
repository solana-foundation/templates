import { Globe, ExternalLink } from 'lucide-react'
import TwitterIcon from './icons/TwitterIcon'
import GitHubIcon from './icons/GitHubIcon'
import NpmIcon from './icons/NpmIcon'

interface SocialLinksProps {
  textSize?: string
}

export default function SocialLinks({ textSize = "text-base" }: SocialLinksProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <a
        href="https://spl402.org"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <Globe size={18} />
        <span className={textSize}>Website</span>
        <ExternalLink size={14} />
      </a>
      <a
        href="https://x.com/spl402"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <TwitterIcon />
        <span className={textSize}>Twitter</span>
        <ExternalLink size={14} />
      </a>
      <a
        href="https://github.com/astrohackerx/spl402"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <GitHubIcon />
        <span className={textSize}>GitHub</span>
        <ExternalLink size={14} />
      </a>
      <a
        href="https://www.npmjs.com/package/spl402"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <NpmIcon />
        <span className={textSize}>npm</span>
        <ExternalLink size={14} />
      </a>
    </div>
  )
}
