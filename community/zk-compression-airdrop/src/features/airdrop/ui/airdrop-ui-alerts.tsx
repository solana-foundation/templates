import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface AirdropAlertsProps {
  error?: string | null
  hasWallet: boolean
  isAuthorized: boolean
  expectedAuthority: string
}

export function AirdropAlerts({ error, hasWallet, isAuthorized, expectedAuthority }: AirdropAlertsProps) {
  return (
    <>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!hasWallet && (
        <Alert>
          <AlertTitle>Wallet Required</AlertTitle>
          <AlertDescription>Please connect your wallet to execute the airdrop</AlertDescription>
        </Alert>
      )}

      {hasWallet && !isAuthorized && (
        <Alert variant="destructive">
          <AlertTitle>Unauthorized</AlertTitle>
          <AlertDescription>Connected wallet is not the mint authority. Expected: {expectedAuthority}</AlertDescription>
        </Alert>
      )}
    </>
  )
}
