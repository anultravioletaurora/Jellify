import { HomeAlbumProps } from '../types'
import { YStack, XStack, Separator, getToken } from 'tamagui'
import { BaseItemDto, ItemSortBy } from '@jellyfin/sdk/lib/generated-client/models'
import { H5, Text } from '../Global/helpers/text'
import { FlatList, SectionList } from 'react-native'
import { RunTimeTicks } from '../Global/helpers/time-codes'
import Track from '../Global/components/track'
import FavoriteButton from '../Global/components/favorite-button'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '../../enums/query-keys'
import { getImageApi, getItemsApi } from '@jellyfin/sdk/lib/utils/api'
import Client from '../../api/client'
import { ItemCard } from '../Global/components/item-card'
// import { Image } from 'expo-image'
import FastImage from 'react-native-fast-image'
import { groupBy, isEqual } from 'lodash'

export function AlbumScreen({ route, navigation }: HomeAlbumProps): React.JSX.Element {
	const { album } = route.params

	navigation.setOptions({
		headerRight: () => {
			return <FavoriteButton item={album} />
		},
	})

	const { data: discs } = useQuery({
		queryKey: [QueryKeys.ItemTracks, album.Id!],
		queryFn: () => {
			let sortBy: ItemSortBy[] = []

			sortBy = [ItemSortBy.ParentIndexNumber, ItemSortBy.IndexNumber, ItemSortBy.SortName]

			return new Promise<{ title: string; data: BaseItemDto[] }[]>((resolve, reject) => {
				getItemsApi(Client.api!)
					.getItems({
						parentId: album.Id!,
						sortBy,
					})
					.then(({ data }) => {
						const discs = data.Items
							? Object.keys(
									groupBy(data.Items, (track) => track.ParentIndexNumber),
							  ).map((discNumber) => {
									console.debug(discNumber)
									return {
										title: discNumber,
										data: data.Items!.filter((track: BaseItemDto) =>
											track.ParentIndexNumber
												? isEqual(
														discNumber,
														(track.ParentIndexNumber ?? 0).toString(),
												  )
												: track,
										),
									}
							  })
							: [{ title: '1', data: [] }]

						resolve(discs)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
	})

	return (
		<SectionList
			contentInsetAdjustmentBehavior='automatic'
			sections={discs ? discs : [{ title: '1', data: [] }]}
			keyExtractor={(item, index) => item.Id! + index}
			ItemSeparatorComponent={() => <Separator />}
			renderSectionHeader={({ section }) => {
				return discs && discs.length >= 2 ? (
					<Text
						paddingVertical={'$2'}
						paddingLeft={'$4.5'}
						backgroundColor={'$background'}
						bold
					>{`Disc ${section.title}`}</Text>
				) : null
			}}
			ListHeaderComponent={
				<YStack marginTop={'$2'} minHeight={getToken('$20') + getToken('$15')}>
					<FastImage
						source={{ uri: getImageApi(Client.api!).getItemImageUrlById(album.Id!) }}
						style={{
							borderRadius: getToken('$5'),
							width: getToken('$20') + getToken('$15'),
							height: getToken('$20') + getToken('$15'),
							alignSelf: 'center',
						}}
					/>

					<H5 textAlign='center'>{album.Name ?? 'Untitled Album'}</H5>

					<XStack justifyContent='space-evenly'>
						<Text>{album.ProductionYear?.toString() ?? ''}</Text>
					</XStack>

					<FlatList
						contentContainerStyle={{
							marginLeft: 2,
						}}
						style={{
							alignSelf: 'center',
						}}
						horizontal
						keyExtractor={(item) => item.Id!}
						data={album.ArtistItems}
						renderItem={({ index, item: artist }) => (
							<ItemCard
								size={'$8'}
								item={artist}
								caption={artist.Name ?? 'Unknown Artist'}
								onPress={() => {
									navigation.navigate('Artist', {
										artist,
									})
								}}
							/>
						)}
					/>
				</YStack>
			}
			renderItem={({ item: track, index }) => (
				<Track
					track={track}
					tracklist={discs?.flatMap((disc) => disc.data)}
					index={discs?.flatMap((disc) => disc.data).indexOf(track) ?? index}
					navigation={navigation}
					queue={album}
				/>
			)}
			ListFooterComponent={
				<XStack marginRight={'$2'} justifyContent='flex-end'>
					<Text color={'$purpleGray'} paddingRight={'$1'}>
						Total Runtime:
					</Text>
					<RunTimeTicks>{album.RunTimeTicks}</RunTimeTicks>
				</XStack>
			}
		/>
	)
}
