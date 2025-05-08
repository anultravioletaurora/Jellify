import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { useNavigation } from '@react-navigation/native'
import { StackParamList } from '../../types'
import Tracks from '../../Tracks/component'
import { useLibraryContext } from '../../../providers/Library'

export default function TracksTab(): React.JSX.Element {
	const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>()

	const { tracks } = useLibraryContext()

	return <Tracks navigation={navigation} tracks={tracks} queue={'On Repeat'} />
}
