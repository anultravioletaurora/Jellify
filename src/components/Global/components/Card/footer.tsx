import { useAppSettingsStore } from '../../../../stores/settings/app'
import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client'
import { StyleSheet } from 'react-native'
import { Spacer, Square, Card, View } from 'tamagui'
import Icon from '../icon'
import { CardSizeToken } from './types'

const footerTypesNeedingIndicating: BaseItemKind[] = [
	BaseItemKind.MusicAlbum,
	BaseItemKind.Playlist,
]

interface ItemCardComponentFooterProps {
	type: BaseItemKind
	size: CardSizeToken
}

export default function ItemCardFooter({ size, type }: ItemCardComponentFooterProps) {
	const { hideItemIndicators } = useAppSettingsStore()

	const displayFooter = footerTypesNeedingIndicating.includes(type) && !hideItemIndicators

	const iconName: 'cassette' | 'disc' = type === BaseItemKind.Playlist ? 'cassette' : 'disc'

	return displayFooter ? (
		<Card.Footer overflow='hidden'>
			<Spacer flexGrow={1} />

			<Square
				backgroundColor='primary'
				size={size}
				style={styles.shadow}
				overflow={'hidden'}
				transform={[{ rotate: '45deg' }, { translateX: '50%' }, { translateY: '20%' }]}
			>
				<View rotate='-45deg' y={-size} x={-size}>
					<Icon color={'background'} name={iconName} style={styles[iconName]} />
				</View>
			</Square>
		</Card.Footer>
	) : null
}

const styles = StyleSheet.create({
	cassette: {
		shadowColor: 'black',
		shadowRadius: 3,
		shadowOpacity: 0.1,
		shadowOffset: {
			height: 3,
			width: 0,
		},
		transform: [
			{
				translate: [-10, -20],
			},
		],
	},
	disc: {
		shadowColor: 'black',
		shadowRadius: 3,
		shadowOpacity: 0.1,
		shadowOffset: {
			height: 3,
			width: 0,
		},
		transform: [
			{
				translate: [-10, -25],
			},
		],
	},
	shadow: {
		boxShadow: [
			{
				offsetY: 3,
				offsetX: 0,
				blurRadius: 6,
				spreadDistance: 1,
				color: 'black',
			},
		],
	},
})
