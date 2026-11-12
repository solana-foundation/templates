import React, { PropsWithChildren } from 'react'
import { AppView, AppViewProps } from '@/components/app-view'
import { useAppTheme } from '@/components/app-theme'

export function AppPage({ children, ...props }: PropsWithChildren<AppViewProps>) {
  const { spacing } = useAppTheme()
  return (
    <AppView style={{ flex: 1, gap: spacing.md, padding: spacing.md }} {...props}>
      {children}
    </AppView>
  )
}
