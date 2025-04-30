import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { FlatList, RefreshControl } from 'react-native'
import { StackParamList } from '../types'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import Item from '../Global/components/item'
import { H3, Text } from '../Global/helpers/text'
import { YStack } from 'tamagui'
import { ItemCard } from '../Global/components/item-card'
import HorizontalCardList from '../Global/components/horizontal-list'

interface SuggestionsProps {
	suggestions: BaseItemDto[] | undefined
	navigation: NativeStackNavigationProp<StackParamList>
}

export default function Suggestions(props: SuggestionsProps): React.JSX.Element {
	return (
		<FlatList
			// Artists are displayed in the header, so we'll filter them out here
			data={props.suggestions?.filter((suggestion) => suggestion.Type !== 'MusicArtist')}
			ListHeaderComponent={
				<YStack>
					<H3>Suggestions</H3>

					<HorizontalCardList
						data={props.suggestions?.filter(
							(suggestion) => suggestion.Type === 'MusicArtist',
						)}
						renderItem={({ item: suggestedArtist }) => {
							return (
								<ItemCard
									item={suggestedArtist}
									onPress={() => {
										props.navigation.push('Artist', {
											artist: suggestedArtist,
										})
									}}
									size={'$8'}
									caption={suggestedArtist.Name ?? 'Untitled Artist'}
								/>
							)
						}}
					/>
				</YStack>
			}
			ListEmptyComponent={
				<Text textAlign='center'>
					Wake now, discover that you are the eyes of the world...
				</Text>
			}
			renderItem={({ item }) => {
				return <Item item={item} queueName={'Suggestions'} navigation={props.navigation} />
			}}
			style={{
				marginHorizontal: 2,
			}}
		/>
	)
}
