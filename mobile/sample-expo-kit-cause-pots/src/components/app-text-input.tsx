import { Text, TextInput, View, type KeyboardTypeOptions } from 'react-native'

export function AppTextInput({
  keyboardType,
  label,
  multiline = false,
  onChangeText,
  placeholder,
  value,
}: {
  keyboardType?: KeyboardTypeOptions
  label?: string
  multiline?: boolean
  onChangeText: (value: string) => void
  placeholder?: string
  value: string
}) {
  return (
    <View className="w-full">
      {label ? <Text className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">{label}</Text> : null}
      <TextInput
        autoCapitalize="none"
        className="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-800 dark:text-white"
        keyboardType={keyboardType}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={value}
      />
    </View>
  )
}
