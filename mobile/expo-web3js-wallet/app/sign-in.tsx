import { router } from 'expo-router'
import { AppButton } from '@/components/app-button'
import { useAuth } from '@/components/auth/auth-provider'
import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { AppConfig } from '@/constants/app-config'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View } from 'react-native'
import { Image } from 'expo-image'
import { useState } from 'react'
import { showError } from '@/utils/show-error'

export default function SignIn() {
  const { signIn } = useAuth()
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
          <AppText type="title">{AppConfig.name}</AppText>
          <Image source={require('../assets/images/icon.png')} style={{ width: 128, height: 128 }} />
        </View>
        <View style={{ marginBottom: 16 }}>
          <AppButton
            variant="filled"
            style={{ marginHorizontal: 16 }}
            disabled={isSigningIn}
            onPress={() => void handleSignIn()}
          >
            {isSigningIn ? 'Connecting...' : 'Connect'}
          </AppButton>
        </View>
      </SafeAreaView>
    </AppView>
  )
}
