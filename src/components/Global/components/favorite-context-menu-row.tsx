import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { ListItem, SizableText, XStack } from 'tamagui'
import Icon from './icon'
import Animated, { Easing, FadeIn, FadeOut } from 'react-native-reanimated'
import { useIsFavorite } from '../../../api/queries/user-data'
import { useAddFavorite, useRemoveFavorite } from '../../../api/mutations/favorite'

export default function FavoriteContextMenuRow({ item }: { item: BaseItemDto }): React.JSX.Element {
	const { data: isFavorite } = useIsFavorite(item)

	return isFavorite ? (
		<RemoveFavoriteContextMenuRow item={item} />
	) : (
		<AddFavoriteContextMenuRow item={item} />
	)
}

function AddFavoriteContextMenuRow({ item }: { item: BaseItemDto }): React.JSX.Element {
	const { mutate, isPending } = useAddFavorite()

	return (
		<ListItem
			transition={'quick'}
			backgroundColor={'transparent'}
			justifyContent='flex-start'
			opacity='press:0.5'
			onPress={() => {
				mutate({ item })
			}}
			disabled={isPending}
		>
			<Animated.View
				entering={FadeIn.easing(Easing.in(Easing.ease))}
				exiting={FadeOut.easing(Easing.out(Easing.ease))}
				key={`${item.Id}-favorite-row`}
			>
				<XStack alignItems='center' justifyContent='flex-start' gap='3'>
					<Icon small name={'heart-outline'} color={'primary'} />

					<SizableText fontWeight='bold'>Add to favorites</SizableText>
				</XStack>
			</Animated.View>
		</ListItem>
	)
}

function RemoveFavoriteContextMenuRow({ item }: { item: BaseItemDto }): React.JSX.Element {
	const { mutate, isPending } = useRemoveFavorite()

	return (
		<ListItem
			transition={'quick'}
			backgroundColor={'transparent'}
			justifyContent='flex-start'
			opacity='press:0.5'
			onPress={() => {
				mutate({ item })
			}}
			disabled={isPending}
		>
			<Animated.View
				entering={FadeIn.easing(Easing.in(Easing.ease))}
				exiting={FadeOut.easing(Easing.out(Easing.ease))}
				key={`${item.Id}-favorite-row`}
			>
				<XStack alignItems='center' justifyContent='flex-start' gap='3'>
					<Icon small name={'heart'} color={'primary'} />

					<SizableText fontWeight='bold'>Remove from favorites</SizableText>
				</XStack>
			</Animated.View>
		</ListItem>
	)
}
