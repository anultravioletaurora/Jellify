import Icon from '../../../components/Global/helpers/icon'
import Track from '../../../components/Global/components/track'
import { StackParamList } from '../../../components/types'
import { usePlayerContext } from '../../../player/player-provider'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import DraggableFlatList from 'react-native-draggable-flatlist'
import { Separator, XStack, YStack } from 'tamagui'
import { useQueueContext } from '../../../player/queue-provider'
import Animated from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { useState } from 'react'
import { trigger } from 'react-native-haptic-feedback'

const gesture = Gesture.Pan()

export default function Queue({
	navigation,
}: {
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	const { width } = useSafeAreaFrame()
	const { nowPlaying } = usePlayerContext()

	const {
		playQueue,
		queueRef,
		useRemoveUpcomingTracks,
		useRemoveFromQueue,
		useReorderQueue,
		useSkip,
	} = useQueueContext()

	navigation.setOptions({
		headerRight: () => {
			return (
				<Icon
					name='notification-clear-all'
					onPress={() => {
						useRemoveUpcomingTracks.mutate()
					}}
				/>
			)
		},
	})

	const scrollIndex = playQueue.findIndex(
		(queueItem) => queueItem.item.Id! === nowPlaying!.item.Id!,
	)

	const [isReordering, setIsReordering] = useState(false)

	return (
		<Animated.View>
			<DraggableFlatList
				contentInsetAdjustmentBehavior='automatic'
				data={playQueue}
				dragHitSlop={{
					left: -50, // https://github.com/computerjazz/react-native-draggable-flatlist/issues/336
					right: isReordering ? -(width * 0.95 - 20) : width,
				}}
				extraData={nowPlaying}
				// enableLayoutAnimationExperimental
				getItemLayout={(data, index) => ({
					length: width / 9,
					offset: (width / 9) * index,
					index,
				})}
				initialScrollIndex={scrollIndex !== -1 ? scrollIndex : 0}
				ItemSeparatorComponent={() => <Separator />}
				// itemEnteringAnimation={FadeIn}
				// itemExitingAnimation={FadeOut}
				// itemLayoutAnimation={SequencedTransition}
				keyExtractor={({ item }, index) => {
					return `${index}-${item.Id}`
				}}
				numColumns={1}
				onDragBegin={() => {
					// setIsReordering(true)
				}}
				onDragEnd={({ data, from, to }) => {
					setIsReordering(false)
					useReorderQueue.mutate({ newOrder: data, from, to })
				}}
				renderItem={({ item: queueItem, getIndex, drag, isActive }) => (
					<XStack
						alignItems='center'
						onPress={(event) => {
							trigger('impactLight')
							drag()
						}}
					>
						<YStack>
							<Icon name='drag' />
						</YStack>

						<Track
							invertedColors={isActive}
							queue={queueRef}
							navigation={navigation}
							track={queueItem.item}
							index={getIndex() ?? 0}
							showArtwork
							onPress={() => {
								const index = getIndex()
								console.debug(`Skip triggered on index ${index}`)
								useSkip.mutate(index)
							}}
							onLongPress={() => {
								navigation.navigate('Details', {
									item: queueItem.item,
									isNested: true,
								})
							}}
							isNested
							showRemove
							onRemove={() => {
								if (getIndex()) useRemoveFromQueue.mutate(getIndex()!)
							}}
						/>
					</XStack>
				)}
			/>
		</Animated.View>
	)
}
