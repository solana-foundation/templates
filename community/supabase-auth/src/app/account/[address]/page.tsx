import AccountFeatureDetail from '@/features/account/account-feature-detail'
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function Page() {
  return (
    <ProtectedRoute>
      <AccountFeatureDetail />
    </ProtectedRoute>
  )
}
