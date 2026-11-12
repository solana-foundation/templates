import { Pressable, Text } from 'react-native'

const variants = {
  danger: 'bg-red-500 active:bg-red-600',
  primary: 'bg-blue-600 active:bg-blue-700',
  success: 'bg-green-600 active:bg-green-700',
}

export function AppButton({
  disabled = false,
  label,
  onPress,
  variant = 'primary',
}: {
  disabled?: boolean
  label: string
  onPress: () => void
  variant?: keyof typeof variants
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={`${variants[variant]} px-6 py-3 rounded-xl items-center ${disabled ? 'opacity-50' : ''}`}
    >
      <Text className="text-white font-bold">{label}</Text>
    </Pressable>
  )
}
