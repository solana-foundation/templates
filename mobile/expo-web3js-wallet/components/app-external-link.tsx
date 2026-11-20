import { Href, Link } from 'expo-router'
import { Platform } from 'react-native'
import { openBrowserAsync } from 'expo-web-browser'
import type { ComponentProps } from 'react'

export type AppExternalLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string }

export function AppExternalLink({ href, ...rest }: AppExternalLinkProps) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (Platform.OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault()
          // Open the link in an in-app browser.
          await openBrowserAsync(href)
        }
      }}
    />
  )
}
