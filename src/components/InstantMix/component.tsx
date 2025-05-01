import { InstantMixProps } from '../types'
import { FlatList } from 'react-native'
import Track from '../Global/components/track'
import ItemImage from '../Global/components/image'
import { Separator } from 'tamagui'

export default function InstantMix({ route, navigation }: InstantMixProps): React.JSX.Element {
	const { item, mix } = route.params

	return (
		<FlatList
			data={mix}
			ListHeaderComponent={<ItemImage item={item} height={'$16'} width={'$16'} />}
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
