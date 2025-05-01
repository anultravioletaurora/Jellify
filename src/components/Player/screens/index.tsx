import { StackParamList } from '../../../components/types'
import { usePlayerContext } from '../../../player/player-provider'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { SafeAreaView, useSafeAreaFrame } from 'react-native-safe-area-context'
import { YStack, XStack, Spacer, getTokens, getToken } from 'tamagui'
import { Text } from '../../../components/Global/helpers/text'
import Icon from '../../../components/Global/helpers/icon'
import FavoriteButton from '../../Global/components/favorite-button'
import TextTicker from 'react-native-text-ticker'
import { TextTickerConfig } from '../component.config'
import Scrubber from '../helpers/scrubber'
import Controls from '../helpers/controls'
import FastImage from 'react-native-fast-image'
import { getImageApi } from '@jellyfin/sdk/lib/utils/api'
import Client from '../../../api/client'
import { useQueueContext } from '../../../player/queue-provider'
import Toast from 'react-native-toast-message'
import JellifyToastConfig from '../../../constants/toast.config'
import { useColorScheme } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import TrackPlayer from 'react-native-track-player'
import { JellifyShuffle, PLAY_AFTER_SHUFFLE } from '../../../helpers/shuffle'
import { JellifyTrack } from '../../../types/JellifyTrack'
import { QueuingType } from '../../../enums/queuing-type'

export default function PlayerScreen({
	navigation,
}: {
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	const [showToast, setShowToast] = useState(true)

	const isDarkMode = useColorScheme() === 'dark'

	const { nowPlaying, useStartPlayback } = usePlayerContext()

	const { queueRef, useLoadNewQueue } = useQueueContext()

	const { width, height } = useSafeAreaFrame()

	const shuffle = () => {
		TrackPlayer.getQueue().then((queue) => {
			const shuffled = JellifyShuffle(queue as JellifyTrack[])
			const baseItemDtoArr = shuffled.map((track) => track.item)
			useLoadNewQueue.mutate(
				{
					tracklist: baseItemDtoArr,
					track: baseItemDtoArr[PLAY_AFTER_SHUFFLE],
					queue: 'Shuffle',
					queuingType: QueuingType.Shuffle,
				},
				{
					onSuccess: () => {
						useStartPlayback.mutate()
					},
				},
			)
		})
	}

	useFocusEffect(
		useCallback(() => {
			setShowToast(true)

			return () => setShowToast(false)
		}, []),
	)

	return (
		<SafeAreaView edges={['right', 'left']}>
			{nowPlaying && (
				<>
					<YStack>
						{useMemo(() => {
							return (
								<>
									<XStack marginBottom={'$2'} marginHorizontal={'$2'}>
										<YStack
											alignContent='flex-end'
											flex={1}
											justifyContent='center'
										>
											<Icon
												name='chevron-down'
												onPress={() => {
													navigation.goBack()
												}}
												small
											/>
										</YStack>

										<YStack alignItems='center' alignContent='center' flex={6}>
											<Text>Playing from</Text>
											<Text
												bold
												numberOfLines={1}
												lineBreakStrategyIOS='standard'
											>
												{
													// If the Queue is a BaseItemDto, display the name of it
													typeof queueRef === 'object'
														? queueRef.Name ?? 'Untitled'
														: queueRef
												}
											</Text>
										</YStack>

										<Spacer flex={1} />
									</XStack>

									<XStack
										justifyContent='center'
										alignContent='center'
										minHeight={'$20'}
									>
										<FastImage
											source={{
												uri: getImageApi(Client.api!).getItemImageUrlById(
													nowPlaying!.item.AlbumId!,
												),
											}}
											style={{
												borderRadius: getToken('$4'),
												width:
													getToken('$20') +
													getToken('$20') +
													getToken('$5'),
												height:
													getToken('$20') +
													getToken('$20') +
													getToken('$5'),
												shadowRadius: getToken('$4'),
												shadowOffset: {
													width: 0,
													height: -getToken('$4'),
												},
												maxHeight: width / 1.1,
												maxWidth: width / 1.1,
											}}
										/>
									</XStack>
								</>
							)
						}, [nowPlaying, queueRef])}

						<XStack
							justifyContent='center'
							marginHorizontal={'auto'}
							width={getToken('$20') + getToken('$20') + getToken('$5')}
							maxWidth={width / 1.1}
							paddingVertical={5}
						>
							{/** Memoize TextTickers otherwise they won't animate due to the progress being updated in the PlayerContext */}
							{useMemo(() => {
								return (
									<YStack justifyContent='flex-start' flex={5}>
										<TextTicker {...TextTickerConfig}>
											<Text bold fontSize={'$6'}>
												{nowPlaying!.title ?? 'Untitled Track'}
											</Text>
										</TextTicker>

										<TextTicker {...TextTickerConfig}>
											<Text
												fontSize={'$6'}
												color={getTokens().color.telemagenta}
												onPress={() => {
													if (nowPlaying!.item.ArtistItems) {
														navigation.goBack() // Dismiss player modal
														navigation.navigate('Tabs', {
															screen: 'Home',
															params: {
																screen: 'Artist',
																params: {
																	artist: nowPlaying!.item
																		.ArtistItems![0],
																},
															},
														})
													}
												}}
											>
												{nowPlaying.artist ?? 'Unknown Artist'}
											</Text>
										</TextTicker>

										<TextTicker {...TextTickerConfig}>
											<Text fontSize={'$6'} color={'$borderColor'}>
												{nowPlaying!.album ?? ''}
											</Text>
										</TextTicker>
									</YStack>
								)
							}, [nowPlaying])}

							<XStack justifyContent='flex-end' alignItems='center' flex={2}>
								{/* Buttons for favorites, song menu go here */}

								<Icon
									name='dots-horizontal-circle-outline'
									onPress={() => {
										navigation.navigate('Details', {
											item: nowPlaying!.item,
											isNested: true,
										})
									}}
								/>

								<Spacer />

								<FavoriteButton item={nowPlaying!.item} />
							</XStack>
						</XStack>

						<XStack justifyContent='center' marginTop={'$3'}>
							{/* playback progress goes here */}
							<Scrubber />
						</XStack>

						<Controls />

						<YStack justifyContent='flex-end' height={'$10'} maxHeight={height / 10}>
							<XStack justifyContent='space-evenly' marginVertical={'$3'}>
								<Icon name='speaker-multiple' />

								<Spacer />

								<Icon
									name='shuffle'
									onPress={() => {
										shuffle()
									}}
								/>

								<Spacer />

								<Icon
									name='playlist-music'
									onPress={() => {
										navigation.navigate('Queue')
									}}
								/>
							</XStack>
						</YStack>
					</YStack>
				</>
			)}
			{showToast && <Toast config={JellifyToastConfig(isDarkMode)} />}
		</SafeAreaView>
	)
}
