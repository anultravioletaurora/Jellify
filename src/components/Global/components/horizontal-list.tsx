import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models/base-item-dto'
import React from 'react'
import { FlatList, FlatListProps, ListRenderItem } from 'react-native'

interface HorizontalCardListProps extends FlatListProps<BaseItemDto> {}

/**
 * Displays a Horizontal FlatList of 20 ItemCards
 * then shows a "See More" button
 * @param param0
 * @returns
 */
export default function HorizontalCardList({
	...props
}: HorizontalCardListProps): React.JSX.Element {
	return (
		<FlatList
			horizontal
			data={props.data}
			renderItem={props.renderItem}
			removeClippedSubviews
			style={{
				overflow: 'hidden',
			}}
		/>
	)
}
