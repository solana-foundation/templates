import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useThemeColor } from '@/hooks/use-theme-color'

// TODO: Implement using @rn-primitives/dropdown-menu like in WalletUiDropdown
export function AppDropdown({
  items,
  selectedItem,
  selectItem,
}: {
  items: readonly string[]
  selectedItem: string
  selectItem: (item: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const backgroundColor = useThemeColor({ light: '#f0f0f0', dark: '#333333' }, 'background')
  const listBackgroundColor = useThemeColor({ light: '#ffffff', dark: '#1c1c1e' }, 'background')
  const borderColor = useThemeColor({ light: '#cccccc', dark: '#555555' }, 'border')
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text')

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TouchableOpacity style={[styles.header, { backgroundColor, borderColor }]} onPress={() => setIsOpen(!isOpen)}>
        <Text style={{ color: textColor }}>{selectedItem}</Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={[styles.list, { backgroundColor: listBackgroundColor, borderColor }]}>
          {items.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.item, { borderBottomColor: borderColor }]}
              onPress={() => {
                selectItem(option)
                setIsOpen(false)
              }}
            >
              <Text style={{ color: textColor }}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 'auto',
    borderRadius: 5,
    position: 'relative',
  },
  header: {
    padding: 10,
    borderRadius: 5,
  },
  list: {
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 38,
    width: 'auto',
    position: 'absolute',
    zIndex: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
  },
})
