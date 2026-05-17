import { DynamicWidget } from '@dynamic-labs/sdk-react-core'
import DynamicLogo from './dynamic/logo'

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between h-16 px-6 bg-white"
      style={{
        borderBottom: '1px solid #DADADA',
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.08)',
      }}
    >
      <a href="/" className="flex items-center">
        <DynamicLogo width={120} height={24} className="text-[#030303]" />
      </a>

      <div className="flex items-center gap-3">
        <DynamicWidget />
      </div>
    </header>
  )
}
