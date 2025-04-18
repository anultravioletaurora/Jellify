import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTheme } from 'tamagui'

const smallSize = 24

const regularSize = 36

const largeSize = 48

const extraLargeSize = 96

export default function Icon({
	name,
	onPress,
	onPressIn,
	onLongPress,
	small,
	large,
	extraLarge,
	color,
}: {
	name: string
	onPress?: () => void
	onPressIn?: () => void
	onLongPress?: () => void
	small?: boolean
	large?: boolean
	extraLarge?: boolean
	color?: string | undefined
}): React.JSX.Element {
	const theme = useTheme()
	const size = extraLarge ? extraLargeSize : large ? largeSize : small ? smallSize : regularSize

	return (
		<MaterialCommunityIcons
			color={color ? color : theme.color.val}
			name={name}
			onPress={onPress}
			onPressIn={onPressIn}
			onLongPress={onLongPress}
			size={size}
		/>
	)
}
