import { AlbumsProps } from '../types'
import { ItemCard } from '../Global/components/item-card'
import { FlatList, RefreshControl } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '../../enums/query-keys'
import { fetchFavoriteAlbums } from '../../api/queries/functions/favorites'

export default function Albums({ navigation, route }: AlbumsProps): React.JSX.Element {
	const {
		data: albums,
		refetch,
		isPending,
	} = useQuery({
		queryKey: [QueryKeys.FavoriteAlbums],
		queryFn: fetchFavoriteAlbums,
	})

	return (
		<FlatList
			contentContainerStyle={{
				flexGrow: 1,
				alignItems: 'center',
			}}
			contentInsetAdjustmentBehavior='automatic'
			numColumns={2}
			data={route.params.albums ? route.params.albums : albums ? albums : []}
			refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} />}
			renderItem={({ index, item: album }) => (
				<ItemCard
					item={album}
					caption={album.Name ?? 'Untitled Album'}
					subCaption={album.ProductionYear?.toString() ?? ''}
					squared
					onPress={() => {
						navigation.navigate('Album', { album })
					}}
					size={'$14'}
				/>
			)}
		/>
	)
}
