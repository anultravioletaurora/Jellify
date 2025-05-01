import React from 'react'
import { View, XStack } from 'tamagui'
import { useHomeContext } from '../provider'
import { H2 } from '../../Global/helpers/text'
import { StackParamList } from '../../types'
import { ItemCard } from '../../Global/components/item-card'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import HorizontalCardList from '../../../components/Global/components/horizontal-list'
import Icon from '../../../components/Global/helpers/icon'

export default function RecentArtists({
	navigation,
}: {
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	const { recentArtists } = useHomeContext()

	return (
		<View>
			<XStack
				alignItems='center'
				onPress={() => {
					navigation.navigate('Artists', {
						artists: recentArtists,
					})
				}}
			>
				<H2 marginLeft={'$2'}>Recent Artists</H2>
				<Icon name='arrow-right' />
			</XStack>

			<HorizontalCardList
				data={recentArtists?.length ?? 0 > 10 ? recentArtists!.slice(0, 10) : recentArtists}
				renderItem={({ item: recentArtist }) => (
					<ItemCard
						item={recentArtist}
						caption={recentArtist.Name ?? 'Unknown Artist'}
						onPress={() => {
							navigation.navigate('Artist', {
								artist: recentArtist,
							})
						}}
						size={'$12'}
					></ItemCard>
				)}
			/>
		</View>
	)
}
