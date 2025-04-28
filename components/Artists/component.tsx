import React from 'react'
import { ItemCard } from '../Global/components/item-card'
import { ArtistsProps } from '../types'
import { QueryKeys } from '../../enums/query-keys'
import { useQuery } from '@tanstack/react-query'
import { fetchFavoriteArtists } from '../../api/queries/functions/favorites'
import { YStack } from 'tamagui'
import { Text } from '../Global/helpers/text'
import { FlatList } from 'react-native'

export default function Artists({ navigation, route }: ArtistsProps): React.JSX.Element {
	const {
		data: favoriteArtists,
		refetch,
		isPending,
	} = useQuery({
		queryKey: [QueryKeys.FavoriteArtists],
		queryFn: fetchFavoriteArtists,
	})

	return (
		<FlatList
			contentContainerStyle={{
				flexGrow: 1,
				alignItems: 'center',
			}}
			contentInsetAdjustmentBehavior='automatic'
			numColumns={2}
			data={
				route.params.artists ? route.params.artists : favoriteArtists ? favoriteArtists : []
			}
			renderItem={({ index, item: artist }) => (
				<ItemCard
					item={artist}
					caption={artist.Name ?? 'Unknown Artist'}
					onPress={() => {
						navigation.navigate('Artist', { artist })
					}}
					size={'$14'}
				/>
			)}
			ListEmptyComponent={
				<YStack justifyContent='center'>
					<Text>No artists</Text>
				</YStack>
			}
		/>
	)
}
