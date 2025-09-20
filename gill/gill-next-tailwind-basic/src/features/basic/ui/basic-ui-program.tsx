import { useGetProgramAccountQuery } from '@/features/basic/data-access/use-get-program-account-query'

import { AppAlert } from '@/components/app-alert'
import { useSolana } from '@/components/solana/use-solana'

export function BasicUiProgram() {
  const { cluster } = useSolana()
  const query = useGetProgramAccountQuery()

  if (query.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }
  if (!query.data?.value) {
    return (
      <AppAlert>Program account not found on {cluster.label}. Be sure to deploy your program and try again.</AppAlert>
    )
  }
  return (
    <div className={'space-y-6'}>
      <pre>{JSON.stringify(query.data.value.data, null, 2)}</pre>
    </div>
  )
}
