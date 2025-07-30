import { Text, TextProps } from 'react-native-paper'
import { Text as NativeText } from 'react-native'

export function AppText({ ...rest }: TextProps<NativeText>) {
  return <Text {...rest} />
}
