import React, { useEffect, useState } from 'react'
import { ItemCard } from '../Global/components/item-card'
import { ArtistAlbumsProps, ArtistEpsProps, ArtistFeaturedOnProps } from '../types'
import { Text } from '../Global/helpers/text'
import { useArtistContext } from './provider'
import { convertRunTimeTicksToSeconds } from '../../helpers/runtimeticks'
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated'
import { ActivityIndicator } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { getToken } from 'tamagui'
export default function Albums({
	route,
	navigation,
}: ArtistAlbumsProps | ArtistEpsProps | ArtistFeaturedOnProps): React.JSX.Element {
	const { width } = useSafeAreaFrame()
	const { albums, fetchingAlbums, featuredOn, scroll } = useArtistContext()
	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			'worklet'
			scroll.value = event.contentOffset.y
		},
	})

	const [columns, setColumns] = useState(Math.floor(width / getToken('$20')))

	useEffect(() => {
		setColumns(Math.floor(width / getToken('$20')))
	}, [width])

	return (
		<Animated.FlatList
			contentContainerStyle={{
				flexGrow: 1,
				justifyContent: 'flex-start',
				alignSelf: 'center',
			}}
			data={
				route.name === 'ArtistFeaturedOn' && featuredOn
					? featuredOn
					: albums
						? albums.filter(
								(album) =>
									// If we're displaying albums, limit the album array
									// to those that have at least 6 songs or a runtime longer
									// than 30 minutes
									(route.name === 'ArtistAlbums' &&
										((album.ChildCount && album.ChildCount >= 6) ||
											convertRunTimeTicksToSeconds(album.RunTimeTicks ?? 0) /
												60 >
												30)) ||
									(route.name === 'ArtistEps' &&
										((album.ChildCount && album.ChildCount < 6) ||
											convertRunTimeTicksToSeconds(album.RunTimeTicks ?? 0) /
												60 <=
												30)),
							)
						: []
			}
			key={`${route.name}-${columns}`}
			keyExtractor={(item) => `${item.Id}-${item.Name}-${columns}`}
			numColumns={columns}
			renderItem={({ item: album }) => (
				<ItemCard
					caption={album.Name}
					subCaption={album.ProductionYear?.toString()}
					size={'$14'}
					squared
					item={album}
					onPress={() => {
						navigation.navigate('Album', {
							album,
						})
					}}
				/>
			)}
			onScroll={scrollHandler}
			ListEmptyComponent={
				fetchingAlbums ? (
					<ActivityIndicator />
				) : (
					<Text textAlign='center' justifyContent='center'>
						No albums
					</Text>
				)
			}
		/>
	)
}
