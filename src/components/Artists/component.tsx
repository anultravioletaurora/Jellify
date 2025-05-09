import React, { useEffect } from 'react'
import { ItemCard } from '../Global/components/item-card'
import { getTokens, YStack } from 'tamagui'
import { Text } from '../Global/helpers/text'
import { ActivityIndicator, FlatList } from 'react-native'
import { useDisplayContext } from '../../providers/Display/display-provider'
import { StackParamList } from '../types'
import { ArtistsProps } from '../types'

export default function Artists({
	artists,
	navigation,
	fetchNextPage,
	hasNextPage,
	isPending,
}: ArtistsProps): React.JSX.Element {
	const { numberOfColumns } = useDisplayContext()

	useEffect(() => {
		console.debug(hasNextPage)
	}, [hasNextPage])

	return (
		<FlatList
			contentContainerStyle={{
				flexGrow: 1,
				alignItems: 'center',
				marginVertical: getTokens().size.$1.val,
			}}
			contentInsetAdjustmentBehavior='automatic'
			numColumns={numberOfColumns}
			data={artists?.pages.flatMap((page) => page) ?? []}
			renderItem={({ index, item: artist }) => (
				<ItemCard
					item={artist}
					caption={artist.Name ?? 'Unknown Artist'}
					onPress={() => {
						navigation.navigate('Artist', { artist })
					}}
					size={'$11'}
				/>
			)}
			ListEmptyComponent={
				isPending ? (
					<ActivityIndicator />
				) : (
					<YStack justifyContent='center'>
						<Text>No artists</Text>
					</YStack>
				)
			}
			onEndReached={() => {
				if (hasNextPage) fetchNextPage()
			}}
			onEndReachedThreshold={0.25}
			removeClippedSubviews
		/>
	)
}
