import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { ColorTokens, getToken, getTokens, themeable, ThemeTokens, Tokens, useTheme } from 'tamagui'

const smallSize = 24

const regularSize = 36

const largeSize = 48

const extraLargeSize = 96

export default function Icon({
	name,
	onPress,
	small,
	large,
	extraLarge,
	disabled,
	color,
}: {
	name: string
	onPress?: () => void
	small?: boolean
	large?: boolean
	disabled?: boolean
	extraLarge?: boolean
	color?: ThemeTokens | undefined
}): React.JSX.Element {
	const theme = useTheme()
	const size = extraLarge ? extraLargeSize : large ? largeSize : small ? smallSize : regularSize

	return (
		<MaterialCommunityIcons
			color={color ? theme[color]?.val : theme.color.val}
			name={name}
			onPress={onPress}
			disabled={disabled}
			size={size}
		/>
	)
}
