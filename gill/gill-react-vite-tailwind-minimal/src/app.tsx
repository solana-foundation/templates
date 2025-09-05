import { AppProviders } from '@/components/app-providers.tsx'
import { AppRoutes } from '@/app-routes.tsx'

export function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  )
}
