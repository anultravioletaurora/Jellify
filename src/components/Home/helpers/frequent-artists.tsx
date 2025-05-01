import HorizontalCardList from '../../../components/Global/components/horizontal-list'
import { StackParamList } from '../../../components/types'
import { QueryKeys } from '../../../enums/query-keys'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React from 'react'
import { ItemCard } from '../../../components/Global/components/item-card'
import { View, XStack } from 'tamagui'
import { H2 } from '../../../components/Global/helpers/text'
import Icon from '../../../components/Global/helpers/icon'
import { useHomeContext } from '../provider'

export default function FrequentArtists({
	navigation,
}: {
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	const { frequentArtists } = useHomeContext()

	return (
		<View>
			<XStack
				alignItems='center'
				onPress={() => {
					navigation.navigate('Artists', {
						artists: frequentArtists,
					})
				}}
			>
				<H2 marginLeft={'$2'}>Most Played</H2>
				<Icon name='arrow-right' />
			</XStack>

			<HorizontalCardList
				data={
					(frequentArtists?.length ?? 0 > 10)
						? frequentArtists!.slice(0, 10)
						: frequentArtists
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
						size={'$12'}
					/>
				)}
			/>
		</View>
	)
}
