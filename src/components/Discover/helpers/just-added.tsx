import { StackParamList } from '../../../components/types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import HorizontalCardList from '../../../components/Global/components/horizontal-list'
import { ItemCard } from '../../../components/Global/components/item-card'
import { useDiscoverContext } from '../provider'
import { View, XStack } from 'tamagui'
import { H2 } from '../../../components/Global/helpers/text'
import Icon from '../../../components/Global/helpers/icon'

export default function RecentlyAdded({
	navigation,
}: {
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	const { recentlyAdded } = useDiscoverContext()

	return (
		<View>
			<XStack
				alignItems='center'
				onPress={() => {
					navigation.navigate('Albums', {
						albums: recentlyAdded,
					})
				}}
			>
				<H2 marginLeft={'$2'}>Recently Added</H2>
				<Icon name='arrow-right' />
			</XStack>

			<HorizontalCardList
				squared
				data={recentlyAdded?.length ?? 0 > 10 ? recentlyAdded!.slice(0, 10) : recentlyAdded}
				renderItem={({ item }) => (
					<ItemCard
						caption={item.Name}
						subCaption={`${item.Artists?.join(', ')}`}
						squared
						size={'$12'}
						item={item}
						onPress={() => {
							navigation.navigate('Album', {
								album: item,
							})
						}}
					/>
				)}
			/>
		</View>
	)
}
