import Color from 'color'
import { useTheme } from 'expo-router'
import { PropsWithChildren } from 'react'
import { Pressable, PressableProps, StyleSheet, Text } from 'react-native'

type AppButtonProps = PropsWithChildren<
  Omit<PressableProps, 'children'> & {
    color?: string
    variant?: 'filled' | 'plain' | 'tinted'
  }
>

export function AppButton({
  android_ripple,
  children,
  color: customColor,
  style,
  variant = 'tinted',
  ...props
}: AppButtonProps) {
  const { colors, fonts } = useTheme()
  const color = customColor ?? (colors.primary as string)
  const backgroundColor =
    variant === 'plain' ? 'transparent' : variant === 'filled' ? color : Color(color).fade(0.85).string()
  const textColor =
    variant === 'filled' ? (Color(color).isDark() ? 'white' : Color(color).darken(0.71).string()) : color

  return (
    <Pressable
      {...props}
      android_ripple={{
        color: Color(textColor).fade(0.85).string(),
        radius: 40,
        ...android_ripple,
      }}
      role="button"
      style={(state) => [
        { backgroundColor, opacity: state.pressed ? 0.3 : 1 },
        styles.button,
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      <Text style={[{ color: textColor }, fonts.regular, styles.text]}>{children}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    borderCurve: 'continuous',
    borderRadius: 40,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  text: {
    fontSize: 14,
    letterSpacing: 0.1,
    lineHeight: 20,
    textAlign: 'center',
  },
})
