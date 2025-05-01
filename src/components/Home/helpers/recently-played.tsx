import React, { useMemo } from 'react'
import { View, XStack } from 'tamagui'
import { useHomeContext } from '../provider'
import { H2 } from '../../Global/helpers/text'
import { ItemCard } from '../../Global/components/item-card'
import { usePlayerContext } from '../../../player/player-provider'
import { StackParamList } from '../../../components/types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { trigger } from 'react-native-haptic-feedback'
import { QueuingType } from '../../../enums/queuing-type'
import HorizontalCardList from '../../../components/Global/components/horizontal-list'
import Icon from '../../../components/Global/helpers/icon'
import { useQueueContext } from '../../../player/queue-provider'

export default function RecentlyPlayed({
	navigation,
}: {
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	const { nowPlaying, useStartPlayback } = usePlayerContext()
	const { useLoadNewQueue } = useQueueContext()
	const { recentTracks } = useHomeContext()

	return useMemo(() => {
		return (
			<View>
				<XStack
					alignItems='center'
					onPress={() => {
						navigation.navigate('Tracks', {
							tracks: recentTracks,
							queue: 'Recently Played',
						})
					}}
				>
					<H2 marginLeft={'$2'}>Play it again</H2>
					<Icon name='arrow-right' />
				</XStack>

				<HorizontalCardList
					squared
					data={
						(recentTracks?.length ?? 0 > 10) ? recentTracks!.slice(0, 10) : recentTracks
					}
					renderItem={({ index, item: recentlyPlayedTrack }) => (
						<ItemCard
							size={'$12'}
							caption={recentlyPlayedTrack.Name}
							subCaption={`${recentlyPlayedTrack.Artists?.join(', ')}`}
							squared
							item={recentlyPlayedTrack}
							onPress={() => {
								useLoadNewQueue.mutate(
									{
										track: recentlyPlayedTrack,
										index: index,
										tracklist: recentTracks ?? [recentlyPlayedTrack],
										queue: 'Recently Played',
										queuingType: QueuingType.FromSelection,
									},
									{
										onSuccess: () => useStartPlayback.mutate(),
									},
								)
							}}
							onLongPress={() => {
								trigger('impactMedium')
								navigation.navigate('Details', {
									item: recentlyPlayedTrack,
									isNested: false,
								})
							}}
						/>
					)}
				/>
			</View>
		)
	}, [recentTracks, nowPlaying])
}
