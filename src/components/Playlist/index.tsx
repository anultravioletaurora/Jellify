import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StackParamList } from '../types'
import { getToken, Separator, Spacer, XStack, YStack } from 'tamagui'
import { RunTimeTicks } from '../Global/helpers/time-codes'
import { H4, H5, Text } from '../Global/helpers/text'
import Track from '../Global/components/track'
import DraggableFlatList from 'react-native-draggable-flatlist'
import { removeFromPlaylist, updatePlaylist } from '../../api/mutations/playlists'
import { useEffect, useState } from 'react'
import Icon from '../Global/helpers/icon'
import { useMutation, useQuery } from '@tanstack/react-query'
import { trigger } from 'react-native-haptic-feedback'
import { queryClient } from '../../constants/query-client'
import { QueryKeys } from '../../enums/query-keys'
import { getImageApi, getItemsApi } from '@jellyfin/sdk/lib/utils/api'
import { RefreshControl } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useJellifyContext } from '../provider'

interface PlaylistProps {
	playlist: BaseItemDto
	navigation: NativeStackNavigationProp<StackParamList>
}

interface PlaylistOrderMutation {
	playlist: BaseItemDto
	track: BaseItemDto
	to: number
}

interface RemoveFromPlaylistMutation {
	playlist: BaseItemDto
	track: BaseItemDto
	index: number
}

export default function Playlist({ playlist, navigation }: PlaylistProps): React.JSX.Element {
	const { api, user } = useJellifyContext()

	const [editing, setEditing] = useState<boolean>(false)
	const [playlistTracks, setPlaylistTracks] = useState<BaseItemDto[]>([])
	const {
		data: tracks,
		isPending,
		isSuccess,
		refetch,
	} = useQuery({
		queryKey: [QueryKeys.ItemTracks, playlist.Id!],
		queryFn: () => {
			return getItemsApi(api!)
				.getItems({
					parentId: playlist.Id!,
				})
				.then((response) => {
					return response.data.Items ? response.data.Items! : []
				})
		},
		staleTime: 1000 * 60 * 1 * 1 * 1, // 1 minute, since these are mutable by nature
	})

	navigation.setOptions({
		headerRight: () => {
			return (
				<XStack justifyContent='space-between'>
					{editing && (
						<Icon
							color={getToken('$color.danger')}
							name='delete-sweep-outline' // otherwise use "delete-circle"
							onPress={() => navigation.navigate('DeletePlaylist', { playlist })}
						/>
					)}

					<Spacer />

					<Icon
						color={getToken('$color.amethyst')}
						name={editing ? 'content-save-outline' : 'pencil'}
						onPress={() => setEditing(!editing)}
					/>
				</XStack>
			)
		},
	})

	// If we've got the playlist tracks, set our component state
	useEffect(() => {
		if (!isPending && isSuccess) setPlaylistTracks(tracks)
	}, [isPending, isSuccess])

	// Refresh playlist tracks if we've finished editing
	useEffect(() => {
		if (!editing) refetch()
	}, [editing])

	const useUpdatePlaylist = useMutation({
		mutationFn: ({ playlist, tracks }: { playlist: BaseItemDto; tracks: BaseItemDto[] }) => {
			return updatePlaylist(
				api,
				playlist.Id!,
				playlist.Name!,
				tracks.map((track) => track.Id!),
			)
		},
		onSuccess: () => {
			trigger('notificationSuccess')

			// Refresh playlist component data
			queryClient.invalidateQueries({
				queryKey: [QueryKeys.ItemTracks, playlist.Id],
			})
		},
		onError: () => {
			trigger('notificationError')

			setPlaylistTracks(tracks ?? [])
		},
	})

	const useRemoveFromPlaylist = useMutation({
		mutationFn: ({ playlist, track, index }: RemoveFromPlaylistMutation) => {
			return removeFromPlaylist(api, track, playlist)
		},
		onSuccess: (data, { index }) => {
			trigger('notificationSuccess')

			setPlaylistTracks(
				playlistTracks
					.slice(0, index)
					.concat(playlistTracks.slice(index + 1, playlistTracks.length - 1)),
			)
		},
		onError: () => {
			trigger('notificationError')
		},
	})

	return (
		<DraggableFlatList
			refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} />}
			contentInsetAdjustmentBehavior='automatic'
			data={playlistTracks}
			dragHitSlop={{ left: -50 }} // https://github.com/computerjazz/react-native-draggable-flatlist/issues/336
			keyExtractor={({ Id }, index) => {
				return `${index}-${Id}`
			}}
			ItemSeparatorComponent={() => <Separator />}
			ListHeaderComponent={
				<YStack alignItems='center' marginTop={'$4'}>
					<FastImage
						source={{ uri: getImageApi(api!).getItemImageUrlById(playlist.Id!) }}
						style={{
							borderRadius: getToken('$5'),
							width: getToken('$20') + getToken('$15'),
							height: getToken('$20') + getToken('$15'),
						}}
					/>

					<H4>{playlist.Name ?? 'Untitled Playlist'}</H4>
					<H5>{playlist.ProductionYear?.toString() ?? ''}</H5>
				</YStack>
			}
			numColumns={1}
			onDragBegin={() => {
				trigger('impactMedium')
			}}
			onDragEnd={({ data, from, to }) => {
				console.debug(`Moving playlist item from ${from} to ${to}`)

				setPlaylistTracks(data)
				useUpdatePlaylist.mutate({
					playlist,
					tracks: data,
				})
			}}
			refreshing={isPending}
			renderItem={({ item: track, getIndex, drag }) => (
				<XStack alignItems='center'>
					{editing && <Icon name='drag' onPress={drag} />}

					<Track
						navigation={navigation}
						track={track}
						tracklist={tracks!}
						index={getIndex() ?? 0}
						queue={playlist}
						showArtwork
						onLongPress={() => {
							editing
								? drag()
								: navigation.navigate('Details', {
										item: track,
										isNested: false,
									})
						}}
						showRemove={editing}
						onRemove={() =>
							useRemoveFromPlaylist.mutate({ playlist, track, index: getIndex()! })
						}
					/>
				</XStack>
			)}
			ListFooterComponent={
				<XStack justifyContent='flex-end'>
					<Text color={'$borderColor'} style={{ display: 'block' }}>
						Total Runtime:
					</Text>
					<RunTimeTicks>{playlist.RunTimeTicks}</RunTimeTicks>
				</XStack>
			}
			style={{
				marginHorizontal: 2,
			}}
		/>
	)
}
