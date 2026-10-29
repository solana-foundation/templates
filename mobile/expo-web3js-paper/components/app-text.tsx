import { ComponentProps } from 'react'
import { Text } from 'react-native-paper'

export function AppText({ ...rest }: ComponentProps<typeof Text>) {
  return <Text {...rest} />
}
