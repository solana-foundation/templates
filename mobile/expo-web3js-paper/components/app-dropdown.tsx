import React, { useState } from 'react'
import { Button, Menu } from 'react-native-paper'

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

  return (
    <Menu
      visible={isOpen}
      onDismiss={() => setIsOpen(false)}
      anchor={
        <Button icon="server-network" mode="contained-tonal" onPress={() => setIsOpen(true)}>
          {selectedItem}
        </Button>
      }
      style={{
        paddingTop: 48,
      }}
    >
      {items.map((option, index) => (
        <Menu.Item
          key={index}
          onPress={() => {
            selectItem(option)
            setIsOpen(false)
          }}
          title={option}
        />
      ))}
    </Menu>
  )
}
