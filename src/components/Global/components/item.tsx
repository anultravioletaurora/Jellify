import { StackParamList } from '../../../components/types'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { getTokens, Separator, Spacer, View, XStack, YStack } from 'tamagui'
import { Text } from '../helpers/text'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import Icon from '../helpers/icon'
import { QueuingType } from '../../../enums/queuing-type'
import { RunTimeTicks } from '../helpers/time-codes'
import { useQueueContext } from '../../../providers/Player/queue'
import { usePlayerContext } from '../../../providers/Player'
import ItemImage from './image'

export default function Item({
	item,
	queueName,
	navigation,
}: {
	item: BaseItemDto
	queueName: string
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	const { useStartPlayback } = usePlayerContext()
	const { useLoadNewQueue } = useQueueContext()

	const { width } = useSafeAreaFrame()

	return (
		<View flex={1}>
			<Separator />

			<XStack
				alignContent='center'
				flex={1}
				minHeight={width / 9}
				onPress={() => {
					switch (item.Type) {
						case 'MusicArtist': {
							navigation.navigate('Artist', {
								artist: item,
							})
							break
						}

						case 'MusicAlbum': {
							navigation.navigate('Album', {
								album: item,
							})
							break
						}

						case 'Audio': {
							useLoadNewQueue.mutate(
								{
									track: item,
									tracklist: [item],
									index: 0,
									queue: 'Search',
									queuingType: QueuingType.FromSelection,
								},
								{
									onSuccess: () => useStartPlayback.mutate(),
								},
							)
							break
						}
					}
				}}
				onLongPress={() => {
					navigation.navigate('Details', {
						item,
						isNested: false,
					})
				}}
				paddingVertical={'$2'}
				marginHorizontal={'$1'}
			>
				<YStack flex={1}>
					<ItemImage item={item} height={'$12'} width={'$12'} />
				</YStack>

				<YStack
					marginLeft={'$1'}
					alignContent='center'
					justifyContent='flex-start'
					flex={3}
				>
					<Text bold lineBreakStrategyIOS='standard' numberOfLines={1}>
						{item.Name ?? ''}
					</Text>
					{(item.Type === 'Audio' || item.Type === 'MusicAlbum') && (
						<Text
							lineBreakStrategyIOS='standard'
							numberOfLines={1}
							color={'$amethyst'}
							bold
						>
							{item.AlbumArtist ?? 'Untitled Artist'}
						</Text>
					)}
				</YStack>

				<XStack justifyContent='space-between' alignItems='center' flex={2}>
					{item.UserData?.IsFavorite ? (
						<Icon small color={getTokens().color.telemagenta.val} name='heart' />
					) : (
						<Spacer />
					)}
					{/* Runtime ticks for Songs */}
					{item.Type === 'Audio' ? (
						<RunTimeTicks>{item.RunTimeTicks}</RunTimeTicks>
					) : (
						<Spacer />
					)}

					{item.Type === 'Audio' || item.Type === 'MusicAlbum' ? (
						<Icon
							name='dots-horizontal'
							onPress={() => {
								navigation.navigate('Details', {
									item,
									isNested: false,
								})
							}}
						/>
					) : (
						<Spacer />
					)}
				</XStack>
			</XStack>
		</View>
	)
}
