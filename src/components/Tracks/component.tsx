import React from 'react'
import Track from '../Global/components/track'
import { FlatList } from 'react-native'
import { getTokens, Separator } from 'tamagui'
import { StackParamList } from '../types'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Queue } from '../../player/types/queue-item'
import { InfiniteData } from '@tanstack/react-query'

export default function Tracks({
	tracks,
	queue,
	fetchNextPage,
	hasNextPage,
	navigation,
}: {
	tracks: InfiniteData<BaseItemDto[], unknown> | undefined
	queue: Queue
	fetchNextPage: () => void
	hasNextPage: boolean
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	return (
		<FlatList
			contentInsetAdjustmentBehavior='automatic'
			contentContainerStyle={{
				marginVertical: getTokens().size.$1.val,
			}}
			ItemSeparatorComponent={() => <Separator />}
			numColumns={1}
			data={tracks?.pages.flatMap((page) => page) ?? []}
			renderItem={({ index, item: track }) => (
				<Track
					navigation={navigation}
					showArtwork
					index={0}
					track={track}
					tracklist={
						tracks ? tracks.pages.flatMap((page) => page).slice(index, index + 50) : []
					}
					queue={queue}
				/>
			)}
			removeClippedSubviews
			onEndReached={() => {
				if (hasNextPage) fetchNextPage()
			}}
			onEndReachedThreshold={0.25}
		/>
	)
}
