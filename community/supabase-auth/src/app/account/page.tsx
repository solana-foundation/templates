import AccountFeatureIndex from '@/features/account/account-feature-index'
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function Page() {
  return (
    <ProtectedRoute>
      <AccountFeatureIndex />
    </ProtectedRoute>
  )
}
