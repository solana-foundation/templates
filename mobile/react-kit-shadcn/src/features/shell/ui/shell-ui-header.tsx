import { ClusterUiSelect } from '@/features/cluster/ui/cluster-ui-select'
import { WalletUiConnectMenu } from '@/features/wallet/ui/wallet-ui-connect-menu'

import { ShellUiThemeSwitcher } from './shell-ui-theme-switcher'

export function ShellUiHeader() {
  return (
    <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-3 px-4 py-3">
        <a className="mr-auto flex items-center gap-2 font-semibold" href="/">
          {/*
            The logo is masked rather than rendered as an <img> so it paints in `currentColor` and
            follows the theme the page is actually using. An <img> can only follow the SVG's own
            `prefers-color-scheme`, which stops matching the moment the theme switcher overrides the
            system preference. Same single file either way — `public/favicon.svg` is still the only
            thing to edit, and its internal colors remain what the browser tab renders.
          */}
          <span aria-hidden className="app-logo size-6 shrink-0" />
          <span className="max-sm:sr-only">React Kit Shadcn</span>
        </a>
        <ClusterUiSelect />
        <WalletUiConnectMenu />
        <ShellUiThemeSwitcher />
      </div>
    </header>
  )
}
