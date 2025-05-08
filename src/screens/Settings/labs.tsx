import { StackParamList } from '../../components/types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import DevTools from '../../components/Settings/dev-tools'

export default function Labs({
	navigation,
}: {
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	return <DevTools />
}
