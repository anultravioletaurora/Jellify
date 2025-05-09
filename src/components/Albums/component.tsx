import { ItemCard } from '../Global/components/item-card'
import { FlatList } from 'react-native'
import { AlbumsProps } from '../types'
import { useDisplayContext } from '../../providers/Display/display-provider'
import { getTokens } from 'tamagui'
export default function Albums({
	albums,
	navigation,
	fetchNextPage,
	hasNextPage,
}: AlbumsProps): React.JSX.Element {
	const { numberOfColumns } = useDisplayContext()

	return (
		<FlatList
			contentContainerStyle={{
				flexGrow: 1,
				alignItems: 'center',
				marginVertical: getTokens().size.$1.val,
			}}
			contentInsetAdjustmentBehavior='automatic'
			numColumns={numberOfColumns}
			data={albums?.pages.flatMap((page) => page) ?? []}
			renderItem={({ index, item: album }) => (
				<ItemCard
					item={album}
					caption={album.Name ?? 'Untitled Album'}
					subCaption={album.ProductionYear?.toString() ?? ''}
					squared
					onPress={() => {
						navigation.navigate('Album', { album })
					}}
					size={'$11'}
				/>
			)}
			onEndReached={() => {
				if (hasNextPage) fetchNextPage()
			}}
			onEndReachedThreshold={0.25}
			removeClippedSubviews
		/>
	)
}
