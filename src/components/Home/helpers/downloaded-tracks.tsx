import React from 'react'
import { StackParamList } from '../../types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNetworkContext } from '../../Network/provider'
import { H2 } from '../../Global/helpers/text'
import Icon from '../../Global/helpers/icon'
import HorizontalCardList from '../../Global/components/horizontal-list'
import { ItemCard } from '../../Global/components/item-card'
import { trigger } from 'react-native-haptic-feedback'
import { View, XStack } from 'tamagui'
import { useQueueContext } from '../../../player/queue-provider'
import { usePlayerContext } from '../../../player/player-provider'

export default function DownloadedTracks({
	navigation,
}: {
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element | null {
	const { downloadedTracks } = useNetworkContext()
	if (!downloadedTracks || downloadedTracks.length === 0) return null

	const items = downloadedTracks.map((d) => d.item)
	const preview = items.slice(0, 10)

	const { useLoadNewQueue } = useQueueContext()
	const { useStartPlayback } = usePlayerContext()

	return (
		<View>
			<XStack
				alignItems='center'
				onPress={() =>
					navigation.navigate('Tracks', {
						tracks: items,
						queue: 'Downloaded',
					})
				}
			>
				<H2 marginLeft='$2'>Downloaded</H2>
				<Icon name='arrow-right' />
			</XStack>

			<HorizontalCardList
				data={preview}
				renderItem={({ item: track, index }) => (
					<ItemCard
						item={track}
						size='$12'
						caption={track.Name ?? ''}
						subCaption={track.Artists?.join(', ') ?? ''}
						squared
						onPress={() => {
							useLoadNewQueue.mutate(
								{
									track,
									index,
									tracklist: items,
									queue: 'Downloaded',
									queuingType: undefined,
								},
								{ onSuccess: () => useStartPlayback.mutate() },
							)
						}}
						onLongPress={() => {
							trigger('impactMedium')
							navigation.navigate('Details', {
								item: track,
								isNested: false,
							})
						}}
					/>
				)}
			/>
		</View>
	)
}
