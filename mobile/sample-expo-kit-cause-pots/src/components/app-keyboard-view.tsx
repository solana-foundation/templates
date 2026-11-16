import { useEffect, useRef, useState, type ComponentRef, type PropsWithChildren } from 'react'
import { Keyboard, View } from 'react-native'

// Shrinks its content by the keyboard overlap, so the ScrollView inside gets
// smaller and Android's scroll-to-focused-input behavior kicks in. With
// edge-to-edge Android the window no longer resizes for the keyboard, and the
// core KeyboardAvoidingView judges the overlap from parent-relative
// coordinates, which is wrong under a native header — so this measures the
// real overlap in window coordinates instead.
export function AppKeyboardView({ children }: PropsWithChildren) {
  const ref = useRef<ComponentRef<typeof View>>(null)
  const [overlap, setOverlap] = useState(0)

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (event) => {
      ref.current?.measureInWindow((x, y, width, height) => {
        setOverlap(Math.max(0, y + height - event.endCoordinates.screenY))
      })
    })
    const hide = Keyboard.addListener('keyboardDidHide', () => setOverlap(0))
    return () => {
      show.remove()
      hide.remove()
    }
  }, [])

  return (
    <View ref={ref} className="flex-1" style={{ paddingBottom: overlap }}>
      {children}
    </View>
  )
}
