import { Text, TextProps } from 'react-native-paper'
import { Text as NativeText } from 'react-native'

export function AppText({ ...rest }: Omit<TextProps<NativeText>, 'ref'>) {
  return <Text {...rest} />
}
