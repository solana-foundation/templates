import { PublicKey } from '@solana/web3.js'
import { AppText } from '@/components/app-text'
import { ActivityIndicator, View } from 'react-native'
import { ellipsify } from '@/utils/ellipsify'
import { AccountUiTokenBalance } from '@/components/account/account-ui-token-balance'
import { useGetTokenAccounts } from '@/components/account/use-get-token-accounts'
import { DataTable, Text } from 'react-native-paper'
import { useMemo, useState } from 'react'

export function AccountUiTokenAccounts({ address }: { address: PublicKey }) {
  let query = useGetTokenAccounts({ address })
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 3 // Items per page

  const items = useMemo(() => {
    const start = currentPage * itemsPerPage
    const end = start + itemsPerPage
    return query.data?.slice(start, end) ?? []
  }, [query.data, currentPage, itemsPerPage])

  // Calculate the total number of pages
  const numberOfPages = useMemo(() => {
    return Math.ceil((query.data?.length ?? 0) / itemsPerPage)
  }, [query.data, itemsPerPage])

  return (
    <>
      <AppText variant="titleMedium">Token Accounts</AppText>
      {query.isLoading && <ActivityIndicator animating={true} />}
      {query.isError && (
        <AppText style={{ padding: 8, backgroundColor: 'red' }}>Error: {query.error?.message.toString()}</AppText>
      )}
      {query.isSuccess && (
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Public Key</DataTable.Title>
            <DataTable.Title>Mint</DataTable.Title>
            <DataTable.Title numeric>Balance</DataTable.Title>
          </DataTable.Header>

          {query.data.length === 0 && (
            <View style={{ marginTop: 12 }}>
              <Text variant="bodyMedium">No token accounts found.</Text>
            </View>
          )}

          {items?.map(({ account, pubkey }) => (
            <DataTable.Row key={pubkey.toString()}>
              <DataTable.Cell>{ellipsify(pubkey.toString())}</DataTable.Cell>
              <DataTable.Cell>{ellipsify(account.data.parsed.info.mint)}</DataTable.Cell>
              <DataTable.Cell numeric>
                <AccountUiTokenBalance address={pubkey} />
              </DataTable.Cell>
            </DataTable.Row>
          ))}

          {(query.data?.length ?? 0) > 3 && (
            <DataTable.Pagination
              page={currentPage}
              numberOfPages={numberOfPages}
              onPageChange={(page) => setCurrentPage(page)}
              label={`${currentPage + 1} of ${numberOfPages}`}
              numberOfItemsPerPage={itemsPerPage}
              selectPageDropdownLabel={'Rows per page'}
            />
          )}
        </DataTable>
      )}
    </>
  )
}
