import { FlatList, RefreshControl } from 'react-native-gesture-handler'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { ItemCard } from '../Global/components/item-card'
import Icon from '../Global/helpers/icon'
import { getToken } from 'tamagui'
import { fetchFavoritePlaylists } from '../../api/queries/favorites'
import { QueryKeys } from '../../enums/query-keys'
import { useQuery } from '@tanstack/react-query'
import { useJellifyContext } from '../../providers'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StackParamList } from '../types'

export default function Playlists({
	navigation,
}: {
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	const { api, user, library } = useJellifyContext()
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
		queryFn: () => fetchFavoritePlaylists(api, user, library),
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
			removeClippedSubviews
		/>
	)
}
