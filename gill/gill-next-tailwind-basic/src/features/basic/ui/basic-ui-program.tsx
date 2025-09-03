import { useGetProgramAccountQuery } from '@/features/basic/data-access/use-get-program-account-query'

export function BasicUiProgram() {
  const query = useGetProgramAccountQuery()

  if (query.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }
  if (!query.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }
  return (
    <div className={'space-y-6'}>
      <pre>{JSON.stringify(query.data.value.data, null, 2)}</pre>
    </div>
  )
}
