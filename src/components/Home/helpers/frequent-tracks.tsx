import { StackParamList } from '../../../components/types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useHomeContext } from '../provider'
import { View, XStack } from 'tamagui'
import HorizontalCardList from '../../../components/Global/components/horizontal-list'
import { ItemCard } from '../../../components/Global/components/item-card'
import { QueuingType } from '../../../enums/queuing-type'
import { trigger } from 'react-native-haptic-feedback'
import { H2 } from '../../../components/Global/helpers/text'
import Icon from '../../../components/Global/helpers/icon'
import { useQueueContext } from '../../../player/queue-provider'
import { usePlayerContext } from '../../../player/player-provider'

export default function FrequentlyPlayedTracks({
	navigation,
}: {
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	const { frequentlyPlayed } = useHomeContext()

	const { useStartPlayback } = usePlayerContext()
	const { useLoadNewQueue } = useQueueContext()

	return (
		<View>
			<XStack
				alignItems='center'
				onPress={() => {
					navigation.navigate('Tracks', {
						tracks: frequentlyPlayed,
						queue: 'On Repeat',
					})
				}}
			>
				<H2 marginLeft={'$2'}>On Repeat</H2>
				<Icon name='arrow-right' />
			</XStack>

			<HorizontalCardList
				data={
					(frequentlyPlayed?.length ?? 0 > 10)
						? frequentlyPlayed!.slice(0, 10)
						: frequentlyPlayed
				}
				renderItem={({ item: track, index }) => (
					<ItemCard
						item={track}
						size={'$12'}
						caption={track.Name}
						subCaption={`${track.Artists?.join(', ')}`}
						squared
						onPress={() => {
							useLoadNewQueue.mutate(
								{
									track,
									index,
									tracklist: frequentlyPlayed ?? [track],
									queue: 'On Repeat',
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
