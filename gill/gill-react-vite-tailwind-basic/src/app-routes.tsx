import { useRoutes } from 'react-router'
import { lazy } from 'react'

const AccountDetailFeature = lazy(() => import('@/features/account/account-feature-detail.tsx'))
const AccountIndexFeature = lazy(() => import('@/features/account/account-feature-index.tsx'))
const BasicFeature = lazy(() => import('@/features/basic/basic-feature'))
const DashboardFeature = lazy(() => import('@/features/dashboard/dashboard-feature'))

export function AppRoutes() {
  return useRoutes([
    { index: true, element: <DashboardFeature /> },
    {
      path: 'account',
      children: [
        { index: true, element: <AccountIndexFeature /> },
        { path: ':address', element: <AccountDetailFeature /> },
      ],
    },
    {
      path: 'basic',
      element: <BasicFeature />,
    },
  ])
}
