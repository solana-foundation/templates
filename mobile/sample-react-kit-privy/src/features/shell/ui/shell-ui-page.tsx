import type { ReactNode } from 'react'

import { ShellUiHeader } from './shell-ui-header'

export function ShellUiPage({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh">
      <ShellUiHeader />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">{children}</main>
    </div>
  )
}
