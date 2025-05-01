import { FlatList, RefreshControl } from 'react-native-gesture-handler'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { ItemCard } from '../Global/components/item-card'
import { FavoritePlaylistsProps } from '../types'
import Icon from '../Global/helpers/icon'
import { getToken } from 'tamagui'
import { fetchFavoritePlaylists } from '../../api/queries/favorites'
import { QueryKeys } from '../../enums/query-keys'
import { useQuery } from '@tanstack/react-query'

export default function FavoritePlaylists({
	navigation,
}: FavoritePlaylistsProps): React.JSX.Element {
	navigation.setOptions({
		headerRight: () => {
			return (
				<Icon
					name='plus-circle-outline'
					color={getToken('$color.telemagenta')}
					onPress={() => navigation.navigate('AddPlaylist')}
				/>
			)
		},
	})

	const {
		data: playlists,
		isPending,
		refetch,
	} = useQuery({
		queryKey: [QueryKeys.UserPlaylists],
		queryFn: () => fetchFavoritePlaylists(),
	})

	return (
		<FlatList
			contentContainerStyle={{
				flexGrow: 1,
				alignItems: 'center',
			}}
			contentInsetAdjustmentBehavior='automatic'
			numColumns={2}
			data={playlists}
			refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} />}
			renderItem={({ index, item: playlist }) => (
				<ItemCard
					item={playlist}
					caption={playlist.Name ?? 'Untitled Playlist'}
					onPress={() => {
						navigation.navigate('Playlist', { playlist })
					}}
					size={'$14'}
					squared
				/>
			)}
		/>
	)
}
