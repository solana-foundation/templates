import { router } from 'expo-router'
import { useAuth } from '@/components/auth/auth-provider'
import { AppErrorSnackbar, useErrorSnackbar } from '@/components/app-error-snackbar'
import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { AppConfig } from '@/constants/app-config'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View } from 'react-native'
import { Image } from 'expo-image'
import { Button } from 'expo-router/react-navigation'
import { useState } from 'react'

export default function SignIn() {
  const { signIn } = useAuth()
  const { dismiss, message, showError } = useErrorSnackbar()
  const [isSigningIn, setIsSigningIn] = useState(false)

  // Sign-in goes through the wallet, which can decline or fail the request.
  async function handleSignIn() {
    if (isSigningIn) {
      return
    }
    setIsSigningIn(true)
    try {
      await signIn()
      // We only get here when sign-in succeeded, so it is safe to navigate.
      router.replace('/')
    } catch (error) {
      showError('Could not sign in', error)
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <AppView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
      }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        {/* Dummy view to push the next view to the center. */}
        <View />
        <View style={{ alignItems: 'center', gap: 16 }}>
          <AppText variant="headlineMedium">{AppConfig.name}</AppText>
          <Image source={require('../assets/images/icon.png')} style={{ width: 128, height: 128 }} />
        </View>
        <View style={{ marginBottom: 16 }}>
          <Button
            variant="filled"
            style={{ marginHorizontal: 16 }}
            disabled={isSigningIn}
            onPress={() => void handleSignIn()}
          >
            {isSigningIn ? 'Connecting...' : 'Connect'}
          </Button>
        </View>
      </SafeAreaView>
      <AppErrorSnackbar message={message} onDismiss={dismiss} />
    </AppView>
  )
}
