import { useNavigation } from '@react-navigation/native'
import Artists from '../../Artists/component'
import { useLibraryContext } from '../../../providers/Library'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StackParamList } from '../../types'

export default function ArtistsTab(): React.JSX.Element {
	const { artists, fetchNextArtistsPage, hasNextArtistsPage } = useLibraryContext()

	const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>()

	return (
		<Artists
			artists={artists}
			navigation={navigation}
			fetchNextPage={fetchNextArtistsPage}
			hasNextPage={hasNextArtistsPage}
		/>
	)
}
