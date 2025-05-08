import { StackParamList } from '../../components/types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import AccountDetails from '../../components/Settings/account-details'

export default function AccountDetailsScreen({
	navigation,
}: {
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	return <AccountDetails />
}
