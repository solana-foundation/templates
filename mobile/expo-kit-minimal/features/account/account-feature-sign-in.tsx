import { SeekerWalletAccount, useSeekerWallet } from '@/components/seeker-wallet-provider'
import { AppActionButton } from '@/components/app-action-button'

export function AccountFeatureSignIn({ account }: { account?: SeekerWalletAccount }) {
  const { chain, identity, signIn } = useSeekerWallet()

  return (
    <AppActionButton
      onPress={async () => {
        const result = await signIn({
          address: account?.address,
          chainId: chain,
          uri: identity.uri,
        })
        return {
          description: `Signed in with ${result.address}`,
          status: 'success',
          title: 'Sign In',
        } as const
      }}
      title={`Sign In ${account ? `with ${account.label}` : 'and connect'}`}
    />
  )
}
