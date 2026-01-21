import React, { Fragment } from 'react'
import { Linking, StyleSheet } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { ellipsify } from '@/utils/ellipsify'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import { useCluster } from '@/components/cluster/cluster-provider'
import { AppText } from '@/components/app-text'
import * as Dropdown from '@rn-primitives/dropdown-menu'
import { WalletUiButtonConnect } from './wallet-ui-button-connect'
import { useWalletUiTheme } from '@/components/solana/use-wallet-ui-theme'

function useDropdownItems() {
  const { getExplorerUrl } = useCluster()
  const { account, disconnect } = useMobileWallet()
  if (!account) {
    return []
  }
  return [
    {
      label: 'Copy Address',
      onPress: () => Clipboard.setString(account.address.toString()),
    },
    {
      label: 'View in Explorer',
      onPress: async () => await Linking.openURL(getExplorerUrl(`account/${account.address.toString()}`)),
    },
    {
      label: 'Disconnect',
      onPress: async () => await disconnect(),
    },
  ]
}

export function WalletUiDropdown() {
  const { account } = useMobileWallet()
  const { backgroundColor, borderColor, textColor } = useWalletUiTheme()

  const items = useDropdownItems()

  if (!account || !items.length) {
    return <WalletUiButtonConnect />
  }

  return (
    <Dropdown.Root>
      <Dropdown.Trigger style={[styles.trigger, { backgroundColor, borderColor }]}>
        <UiIconSymbol name="wallet.pass.fill" color={textColor} />
        <AppText>{ellipsify(account.address.toString())}</AppText>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Overlay style={StyleSheet.absoluteFill}>
          <Dropdown.Content style={{ ...styles.list, backgroundColor, borderColor }}>
            {items.map((item, index) => (
              <Fragment key={item.label}>
                <Dropdown.Item onPress={item.onPress} style={[styles.item, { borderColor }]}>
                  <AppText>{item.label}</AppText>
                </Dropdown.Item>
                {index < items.length - 1 && <Dropdown.Separator style={{ backgroundColor: borderColor, height: 1 }} />}
              </Fragment>
            ))}
          </Dropdown.Content>
        </Dropdown.Overlay>
      </Dropdown.Portal>
    </Dropdown.Root>
  )
}

export const styles = StyleSheet.create({
  trigger: {
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  list: {
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 8,
  },
  item: {
    padding: 12,
    flexWrap: 'nowrap',
  },
})
