import { address, isAddress } from '@solana/kit'
import { useLocalSearchParams } from 'expo-router'
import { Text, View } from 'react-native'
import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { usePotQuery } from '../../../features/pots/data-access/use-pot-query'
import { PotDetailFeature } from '../../../features/pots/pot-detail-feature'
import { formatError } from '../../../utils/format-error'

export default function PotDetailScreen() {
  const { pot } = useLocalSearchParams<{ pot: string }>()
  const { account } = useMobileWallet()
  // The route parameter can be anything (a malformed deep link); validate it
  // instead of letting the address parser throw during render.
  const potAddress = typeof pot === 'string' && isAddress(pot) ? address(pot) : undefined
  const potQuery = usePotQuery({ pot: potAddress })

  if (!potAddress) {
    return <Message text="This pot address is not valid." />
  }
  if (potQuery.isLoading || !account) {
    return <Message text="Loading pot…" />
  }
  if (potQuery.error) {
    return <Message text={formatError(potQuery.error)} />
  }
  if (!potQuery.data) {
    return <Message text="This pot does not exist on the selected network." />
  }
  return <PotDetailFeature pot={potQuery.data.data} potAddress={potAddress} viewer={account.address} />
}

function Message({ text }: { text: string }) {
  return (
    <View className="flex-1 bg-white dark:bg-black items-center justify-center px-8">
      <Text className="text-gray-600 dark:text-gray-400 text-center">{text}</Text>
    </View>
  )
}
