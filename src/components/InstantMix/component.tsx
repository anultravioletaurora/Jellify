import { InstantMixProps } from '../types'
import { FlatList } from 'react-native'
import Track from '../Global/components/track'
import { Separator } from 'tamagui'

export default function InstantMix({ route, navigation }: InstantMixProps): React.JSX.Element {
	const { item, mix } = route.params

	return (
		<FlatList
			data={mix}
			ItemSeparatorComponent={() => <Separator />}
			renderItem={({ item, index }) => (
				<Track
					showArtwork
					track={item}
					navigation={navigation}
					index={index}
					queue={'Instant Mix'}
					tracklist={mix}
				/>
			)}
		/>
	)
}
