import { useAppSettingsStore } from '../../../../stores/settings/app'
import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client'
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons'
import { StyleSheet } from 'react-native'
import { useTheme, Spacer, Square, Card, View } from 'tamagui'

const footerTypesNeedingIndicating: BaseItemKind[] = [
	BaseItemKind.MusicAlbum,
	BaseItemKind.Playlist,
]

interface ItemCardComponentFooterProps {
	type: BaseItemKind
}

export default function ItemCardFooter({ type }: ItemCardComponentFooterProps) {
	const theme = useTheme()

	const { hideItemIndicators } = useAppSettingsStore()

	const displayFooter = footerTypesNeedingIndicating.includes(type) && !hideItemIndicators

	const iconName: 'cassette' | 'disc' = type === BaseItemKind.Playlist ? 'cassette' : 'disc'

	const footerShadowStyle = {
		boxShadow: [
			{
				offsetY: 3,
				offsetX: 0,
				blurRadius: 6,
				spreadDistance: 1,
				color: theme.darkBackground75.val,
			},
		],
	}

	return displayFooter ? (
		<Card.Footer overflow='hidden'>
			<Spacer flexGrow={1} />

			<Square
				x='8'
				y='10'
				backgroundColor='primary'
				width={'8'}
				height={'8'}
				rotate='45deg'
				style={footerShadowStyle}
			>
				<View rotate='-45deg' {...offsets[iconName]}>
					<MaterialDesignIcons
						size={26}
						color={theme.background.val}
						name={iconName}
						style={styles[iconName]}
					/>
				</View>
			</Square>
		</Card.Footer>
	) : null
}

const offsets = {
	cassette: {
		x: '-4',
		y: '0',
	},
	disc: {
		x: '-4',
		y: '-4',
	},
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
	},
	disc: {
		shadowColor: 'black',
		shadowRadius: 3,
		shadowOpacity: 0.1,
		shadowOffset: {
			height: 3,
			width: 0,
		},
	},
})
