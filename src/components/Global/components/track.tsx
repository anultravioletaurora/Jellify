import { usePlayerContext } from '../../../player/player-provider'
import React from 'react'
import { getToken, getTokens, Theme, useTheme, XStack, YStack } from 'tamagui'
import { Text } from '../helpers/text'
import { RunTimeTicks } from '../helpers/time-codes'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import Icon from '../helpers/icon'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StackParamList } from '../../../components/types'
import { QueuingType } from '../../../enums/queuing-type'
import { Queue } from '../../../player/types/queue-item'
import FavoriteIcon from './favorite-icon'
import FastImage from 'react-native-fast-image'
import { getImageApi } from '@jellyfin/sdk/lib/utils/api'
import Client from '../../../api/client'
import { networkStatusTypes } from '../../../components/Network/internetConnectionWatcher'
import { useNetworkContext } from '../../../components/Network/provider'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '../../../enums/query-keys'
import { fetchMediaInfo } from '../../../api/queries/media'
import { useQueueContext } from '../../../player/queue-provider'

interface TrackProps {
	track: BaseItemDto
	navigation: NativeStackNavigationProp<StackParamList>
	tracklist?: BaseItemDto[] | undefined
	index: number
	queue: Queue
	showArtwork?: boolean | undefined
	onPress?: () => void | undefined
	onLongPress?: () => void | undefined
	isNested?: boolean | undefined
	invertedColors?: boolean | undefined
	prependElement?: React.JSX.Element | undefined
	showRemove?: boolean | undefined
	onRemove?: () => void | undefined

	/**
	 * Optional prepend element function.
	 * If provided, function will be called when the user
	 * presses the prepend element.
	 */
	prependOnPress?: (() => void) | undefined
}

export default function Track({
	track,
	tracklist,
	navigation,
	index,
	queue,
	showArtwork,
	onPress,
	onLongPress,
	isNested,
	invertedColors,
	prependElement,
	showRemove,
	onRemove,
}: TrackProps): React.JSX.Element {
	const theme = useTheme()
	const { nowPlaying, useStartPlayback } = usePlayerContext()
	const { playQueue, useLoadNewQueue } = useQueueContext()
	const { downloadedTracks, networkStatus } = useNetworkContext()

	const isPlaying = nowPlaying?.item.Id === track.Id

	const offlineAudio = downloadedTracks?.find((t) => t.item.Id === track.Id)
	const isDownloaded = offlineAudio?.item?.Id

	const isOffline = networkStatus === networkStatusTypes.DISCONNECTED

	const mediaInfo = useQuery({
		queryKey: [QueryKeys.MediaSources, track.Id!],
		queryFn: () => fetchMediaInfo(track.Id!),
	})

	return (
		<Theme name={invertedColors ? 'inverted_purple' : undefined}>
			<XStack
				alignContent='center'
				alignItems='center'
				flex={1}
				onPress={() => {
					if (onPress) {
						onPress()
					} else {
						useLoadNewQueue.mutate(
							{
								track,
								index,
								tracklist: tracklist ?? playQueue.map((track) => track.item),
								queue,
								queuingType: QueuingType.FromSelection,
							},
							{
								onSuccess: () => useStartPlayback.mutate(),
							},
						)
					}
				}}
				onLongPress={
					onLongPress
						? () => onLongPress()
						: () => {
								navigation.navigate('Details', {
									item: track,
									isNested: isNested,
								})
							}
				}
				paddingVertical={'$2'}
			>
				{prependElement && (
					<YStack alignContent='center' justifyContent='center' flex={1}>
						{prependElement}
					</YStack>
				)}

				<XStack
					alignContent='center'
					justifyContent='center'
					flex={1}
					marginHorizontal={'$2'}
					minHeight={showArtwork ? '$4' : 'unset'}
				>
					{showArtwork ? (
						<FastImage
							source={{
								uri: getImageApi(Client.api!).getItemImageUrlById(track.AlbumId!),
							}}
							style={{
								width: getToken('$12'),
								height: getToken('$12'),
								borderRadius: getToken('$1'),
							}}
						/>
					) : (
						<Text color={isPlaying ? getTokens().color.telemagenta : theme.color}>
							{track.IndexNumber?.toString() ?? ''}
						</Text>
					)}
				</XStack>

				<YStack alignContent='center' justifyContent='flex-start' flex={6}>
					<Text
						bold
						color={
							isPlaying
								? getTokens().color.telemagenta
								: isOffline
									? isDownloaded
										? theme.color
										: '$purpleGray'
									: theme.color
						}
						lineBreakStrategyIOS='standard'
						numberOfLines={1}
					>
						{track.Name ?? 'Untitled Track'}
					</Text>

					{(showArtwork || (track.ArtistCount ?? 0 > 1)) && (
						<Text lineBreakStrategyIOS='standard' numberOfLines={1}>
							{track.Artists?.join(', ') ?? ''}
						</Text>
					)}
				</YStack>

				<XStack
					alignItems='center'
					justifyContent='space-between'
					alignContent='center'
					flex={4}
				>
					<FavoriteIcon item={track} />

					<YStack alignContent='center' justifyContent='space-around'>
						<RunTimeTicks>{track.RunTimeTicks}</RunTimeTicks>
					</YStack>

					<YStack alignContent='center' justifyContent='flex-start' marginRight={'$3'}>
						<Icon
							name={showRemove ? 'close' : 'dots-horizontal'}
							onPress={() => {
								if (showRemove) {
									if (onRemove) onRemove()
								} else {
									navigation.navigate('Details', {
										item: track,
										isNested: isNested,
									})
								}
							}}
						/>
					</YStack>
				</XStack>
			</XStack>
		</Theme>
	)
}
