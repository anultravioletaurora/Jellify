import { usePlayerContext } from '../../../player/provider'
import { StackParamList } from '../../../components/types'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import {
	Circle,
	getToken,
	getTokens,
	ListItem,
	Separator,
	Spacer,
	Spinner,
	XStack,
	YGroup,
	YStack,
} from 'tamagui'
import { QueuingType } from '../../../enums/queuing-type'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import IconButton from '../../../components/Global/helpers/icon-button'
import { Text } from '../../../components/Global/helpers/text'
import React from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AddToPlaylistMutation } from '../types'
import { addToPlaylist } from '../../../api/mutations/functions/playlists'
import { trigger } from 'react-native-haptic-feedback'
import { queryClient } from '../../../constants/query-client'
import { QueryKeys } from '../../../enums/query-keys'
import { fetchItem } from '../../../api/queries/functions/item'
import { fetchUserPlaylists } from '../../../api/queries/functions/playlists'

import * as Burnt from 'burnt'
import { Image } from 'expo-image'
import { getImageApi } from '@jellyfin/sdk/lib/utils/api'
import Client from '../../../api/client'
import { useNetworkContext } from '../../../components/Network/provider'

interface TrackOptionsProps {
	track: BaseItemDto
	navigation: NativeStackNavigationProp<StackParamList>

	/**
	 * Whether this is nested in the player modal
	 */
	isNested: boolean | undefined
}

export default function TrackOptions({
	track,
	navigation,
	isNested,
}: TrackOptionsProps): React.JSX.Element {
	const { data: album, isSuccess: albumFetchSuccess } = useQuery({
		queryKey: [QueryKeys.Item, track.AlbumId!],
		queryFn: () => fetchItem(track.AlbumId!),
	})

	const { useDownload, useRemoveDownload, downloadedTracks } = useNetworkContext()

	const isDownloaded = downloadedTracks?.find((t) => t.item.Id === track.Id)?.item?.Id

	const {
		data: playlists,
		isPending: playlistsFetchPending,
		isSuccess: playlistsFetchSuccess,
	} = useQuery({
		queryKey: [QueryKeys.UserPlaylists],
		queryFn: () => fetchUserPlaylists(),
	})

	const { useAddToQueue } = usePlayerContext()

	const { width } = useSafeAreaFrame()

	const useAddToPlaylist = useMutation({
		mutationFn: ({ track, playlist }: AddToPlaylistMutation) => {
			trigger('impactLight')
			return addToPlaylist(track, playlist)
		},
		onSuccess: (data, { playlist }) => {
			Burnt.alert({
				title: `Added to playlist`,
				duration: 1,
				preset: 'done',
			})

			trigger('notificationSuccess')

			queryClient.invalidateQueries({
				queryKey: [QueryKeys.UserPlaylists],
			})

			queryClient.invalidateQueries({
				queryKey: [QueryKeys.ItemTracks, playlist.Id!],
			})
		},
		onError: () => {
			Burnt.alert({
				title: `Unable to add`,
				duration: 1,
				preset: 'error',
			})

			trigger('notificationError')
		},
	})

	return (
		<YStack width={width}>
			<XStack justifyContent='space-evenly'>
				{albumFetchSuccess && album ? (
					<IconButton
						name='music-box'
						title='Go to Album'
						onPress={() => {
							if (isNested) navigation.goBack()

							navigation.goBack()

							if (isNested)
								navigation.navigate('Tabs', {
									screen: 'Home',
									params: {
										screen: 'Album',
										params: {
											album,
										},
									},
								})
							else
								navigation.navigate('Album', {
									album,
								})
						}}
						size={width / 6}
					/>
				) : (
					<Spacer />
				)}

				<IconButton
					circular
					name='table-column-plus-before'
					title='Play Next'
					onPress={() => {
						useAddToQueue.mutate({
							track: track,
							queuingType: QueuingType.PlayingNext,
						})
					}}
					size={width / 6}
				/>

				<IconButton
					circular
					name='table-column-plus-after'
					title='Queue'
					onPress={() => {
						useAddToQueue.mutate({
							track: track,
						})
					}}
					size={width / 6}
				/>

				{useDownload.isPending ? (
					<Circle size={width / 6} disabled>
						<Spinner marginHorizontal={10} size='small' color={'$amethyst'} />
					</Circle>
				) : (
					<IconButton
						disabled={!!isDownloaded}
						circular
						name={isDownloaded ? 'delete' : 'download'}
						title={isDownloaded ? 'Remove Download' : 'Download'}
						onPress={() => {
							(isDownloaded ? useRemoveDownload : useDownload).mutate(track)
						}}
						size={width / 6}
					/>
				)}
			</XStack>

			<Spacer />

			{playlistsFetchPending && <Spinner />}

			{!playlistsFetchPending && playlistsFetchSuccess && (
				<>
					<Text bold fontSize={'$6'}>
						Add to Playlist
					</Text>

					<YGroup separator={<Separator />}>
						{playlists?.map((playlist) => {
							return (
								<YGroup.Item key={playlist.Id!}>
									<ListItem
										hoverTheme
										onPress={() => {
											useAddToPlaylist.mutate({
												track,
												playlist,
											})
										}}
									>
										<XStack alignItems='center'>
											<YStack flex={1}>
												<Image
													source={getImageApi(
														Client.api!,
													).getItemImageUrlById(playlist.Id!)}
													style={{
														borderRadius: getToken('$1.5'),
														width: getToken('$12'),
														height: getToken('$12'),
													}}
												/>
											</YStack>

											<YStack alignItems='flex-start' flex={5}>
												<Text bold fontSize={'$6'}>
													{playlist.Name ?? 'Untitled Playlist'}
												</Text>

												<Text color={getTokens().color.amethyst}>{`${
													playlist.ChildCount ?? 0
												} tracks`}</Text>
											</YStack>
										</XStack>
									</ListItem>
								</YGroup.Item>
							)
						})}
					</YGroup>
				</>
			)}
		</YStack>
	)
}
