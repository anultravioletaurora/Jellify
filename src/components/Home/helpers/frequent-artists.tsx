import HorizontalCardList from '../../../components/Global/components/horizontal-list'
import { StackParamList } from '../../../components/types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React from 'react'
import { ItemCard } from '../../../components/Global/components/item-card'
import { View, XStack } from 'tamagui'
import { H2, H4, Text } from '../../../components/Global/helpers/text'
import Icon from '../../Global/components/icon'
import { useHomeContext } from '../../../providers/Home'
import { ActivityIndicator } from 'react-native'

export default function FrequentArtists({
	navigation,
}: {
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	const {
		frequentArtists,
		fetchNextFrequentArtists,
		hasNextFrequentArtists,
		isFetchingFrequentArtists,
	} = useHomeContext()

	return (
		<View>
			<XStack
				alignItems='center'
				onPress={() => {
					navigation.navigate('MostPlayedArtists', {
						artists: frequentArtists,
						fetchNextPage: fetchNextFrequentArtists,
						hasNextPage: hasNextFrequentArtists,
						isPending: isFetchingFrequentArtists,
					})
				}}
			>
				<H4 marginLeft={'$2'}>Most Played</H4>
				<Icon name='arrow-right' />
			</XStack>

			<HorizontalCardList
				data={
					(frequentArtists?.pages.flatMap((page) => page).length ?? 0 > 10)
						? frequentArtists?.pages.flatMap((page) => page).slice(0, 10)
						: frequentArtists?.pages.flatMap((page) => page)
				}
				renderItem={({ item: artist }) => (
					<ItemCard
						item={artist}
						caption={artist.Name ?? 'Unknown Artist'}
						onPress={() => {
							navigation.navigate('Artist', {
								artist,
							})
						}}
						size={'$11'}
					/>
				)}
				ListEmptyComponent={
					isFetchingFrequentArtists ? (
						<ActivityIndicator />
					) : (
						<Text>No frequent artists</Text>
					)
				}
			/>
		</View>
	)
}
