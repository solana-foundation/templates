import { useRoutes } from 'react-router'
import { lazy } from 'react'

const AppHome = lazy(() => import('./app-home.tsx'))

export function AppRoutes() {
  return useRoutes([{ index: true, element: <AppHome /> }])
}
