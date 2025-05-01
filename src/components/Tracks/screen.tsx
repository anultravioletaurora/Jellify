import { TracksProps } from '../types'
import React from 'react'
import Track from '../Global/components/track'
import { FlatList } from 'react-native'
import { Separator } from 'tamagui'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '../../enums/query-keys'
import { fetchFavoriteTracks } from '../../api/queries/favorites'

export default function TracksScreen({ route, navigation }: TracksProps): React.JSX.Element {
	const { data: favoriteTracks } = useQuery({
		queryKey: [QueryKeys.FavoriteTracks],
		queryFn: fetchFavoriteTracks,
	})

	return (
		<FlatList
			contentInsetAdjustmentBehavior='automatic'
			ItemSeparatorComponent={() => <Separator />}
			numColumns={1}
			data={route.params.tracks ? route.params.tracks : favoriteTracks ? favoriteTracks : []}
			renderItem={({ index, item: track }) => (
				<Track
					navigation={navigation}
					showArtwork
					index={0}
					track={track}
					tracklist={
						route.params.tracks
							? route.params.tracks.slice(index, index + 50)
							: favoriteTracks
								? favoriteTracks.slice(index, index + 50)
								: []
					}
					queue={route.params.queue}
				/>
			)}
		/>
	)
}
