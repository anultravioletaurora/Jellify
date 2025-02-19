import { ToastViewport } from '@tamagui/toast'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function SafeToastViewport() : React.JSX.Element {
  const { left, top, right } = useSafeAreaInsets()
  return (
    <ToastViewport flexDirection="column-reverse" top={top} left={left} right={right} />
  )
}