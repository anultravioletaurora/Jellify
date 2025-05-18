import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getToken, getTokens, XStack, YStack } from 'tamagui'
import { Text } from '../Global/helpers/text'
import { ActivityIndicator, RefreshControl } from 'react-native'
import { ArtistsProps } from '../types'
import Item from '../Global/components/item'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { alphabet } from '../../providers/Library'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models/base-item-dto'
import { trigger } from 'react-native-haptic-feedback'
import { FlashList } from '@shopify/flash-list'
import { useLibraryContext } from '../../providers/Library'
import { sleepify } from '../../helpers/sleep'

export default function Artists({
	artists,
	navigation,
	fetchNextPage,
	hasNextPage,
	isPending,
	isFetchingNextPage,
	showAlphabeticalSelector,
}: ArtistsProps): React.JSX.Element {
	const { width, height } = useSafeAreaFrame()

	const { artistPageParams } = useLibraryContext()

	const memoizedAlphabet = useMemo(() => alphabet, [])

	const sectionListRef = useRef<FlashList<string | number | BaseItemDto>>(null)

	const itemHeight = getToken('$6')

	const MemoizedItem = React.memo(Item)

	const artistsRef = useRef<(string | number | BaseItemDto)[]>(artists ?? [])

	const [refreshing, setRefreshing] = useState(false)

	const alphabeticalSelectorCallback = useCallback(async (letter: string) => {
		do {
			await sleepify(100)
			fetchNextPage()
			console.debug(
				`Alphabetical Selector Callback: ${letter}, ${artistPageParams.current.join(', ')}`,
			)
		} while (
			artistsRef.current?.indexOf(letter) === -1 ||
			!artistPageParams.current.includes(letter)
		)

		sleepify(250).then(() => {
			sectionListRef.current?.scrollToIndex({
				index:
					(artistsRef.current?.indexOf(letter) ?? 0) > -1
						? artistsRef.current!.indexOf(letter)
						: 0,
				viewPosition: 0.2,
				animated: true,
			})
		})
	}, [])

	useEffect(() => {
		console.debug(`Fetching Artist Component: ${artistPageParams.current.join(', ')}`)
	}, [artistPageParams])

	useEffect(() => {
		artistsRef.current = artists ?? []
	}, [artists])

	return (
		<XStack flex={1}>
			<FlashList
				ref={sectionListRef}
				style={{
					width: getToken('$10'),
					marginRight: getToken('$4'),
				}}
				contentContainerStyle={{
					paddingTop: getToken('$1'),
				}}
				contentInsetAdjustmentBehavior='automatic'
				keyExtractor={(item) =>
					typeof item === 'string'
						? item
						: typeof item === 'number'
							? item.toString()
							: item.Id!
				}
				estimatedItemSize={itemHeight}
				data={artists}
				refreshControl={<RefreshControl refreshing={isPending} />}
				renderItem={({ index, item: artist }) =>
					typeof artist === 'string' ? (
						<XStack
							padding={'$2'}
							backgroundColor={'$background'}
							borderRadius={'$5'}
							borderWidth={'$1'}
							borderColor={'$borderColor'}
							margin={'$2'}
						>
							<Text>{artist.toUpperCase()}</Text>
						</XStack>
					) : typeof artist === 'number' ? null : typeof artist === 'object' ? (
						<MemoizedItem
							item={artist}
							queueName={artist.Name ?? 'Unknown Artist'}
							navigation={navigation}
						/>
					) : null
				}
				ListEmptyComponent={
					isPending || isFetchingNextPage ? (
						<ActivityIndicator />
					) : (
						<YStack justifyContent='center'>
							<Text>No artists</Text>
						</YStack>
					)
				}
				ListFooterComponent={isPending ? <ActivityIndicator /> : null}
				stickyHeaderIndices={
					showAlphabeticalSelector
						? artists
								?.map((artist, index, artists) =>
									typeof artist === 'string' ? index : 0,
								)
								.filter((value, index, indices) => indices.indexOf(value) === index)
						: []
				}
				onEndReached={() => {
					if (hasNextPage) fetchNextPage()
				}}
				onEndReachedThreshold={0.8}
				removeClippedSubviews={false}
			/>

			{showAlphabeticalSelector && (
				<YStack
					maxWidth={'$4'}
					margin={'$2'}
					minWidth={'$2'}
					width={width / 8}
					height={height - getTokens().size.$15.val}
					alignItems='center'
					justifyContent='center'
					borderWidth={'$1'}
					borderColor={'$borderColor'}
					borderRadius={'$5'}
					gap={0}
					flex={1}
				>
					{memoizedAlphabet.map((letter) => (
						<Text
							display='flex'
							paddingHorizontal={'$3'}
							flex={1}
							alignItems='center'
							justifyContent='center'
							key={letter}
							bold
							fontSize={'$6'}
							onPressOut={() => {
								trigger('impactLight')
								alphabeticalSelectorCallback(letter)
							}}
						>
							{letter.toUpperCase()}
						</Text>
					))}
				</YStack>
			)}
		</XStack>
	)
}
