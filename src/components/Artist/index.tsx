import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StackParamList } from '../types'
import { ArtistProvider } from './provider'
import ArtistNavigation from './navigation'

export function ArtistScreen({
	route,
	navigation,
}: {
	route: RouteProp<StackParamList, 'Artist'>
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	const { artist } = route.params

	return (
		<ArtistProvider artist={artist}>
			<ArtistNavigation navigation={navigation} />
		</ArtistProvider>
	)
}
