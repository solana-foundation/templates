import '../global.css'

import { Slot } from 'expo-router'

import { AppProviders } from '../features/core/data-access/app-providers'

export default function Layout() {
  return (
    <AppProviders>
      <Slot />
    </AppProviders>
  )
}
