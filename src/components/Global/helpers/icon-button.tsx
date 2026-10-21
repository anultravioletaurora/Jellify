import React from 'react'
import { Square, SizableText, useTheme, Circle } from 'tamagui'
import Icon from '../components/icon'
import { BUTTON_PRESS_STYLES } from '../../../configs/styling/elements'
import { MaterialDesignIconsIconName } from '@react-native-vector-icons/material-design-icons'

interface IconButtonProps {
	onPress: () => Promise<void>
	name: MaterialDesignIconsIconName
	title?: string | undefined
	circular?: boolean | undefined
	size?: number
	largeIcon?: boolean | undefined
	disabled?: boolean | undefined
	testID?: string | undefined
}

export default function IconButton({
	name,
	onPress,
	title,
	circular,
	testID,
	size,
	largeIcon,
	disabled,
}: IconButtonProps): React.JSX.Element {
	const { darkBackground75 } = useTheme()

	const shadowStyle = {
		boxShadow: [
			{
				offsetY: 2,
				offsetX: 0,
				blurRadius: 4,
				spreadDistance: 1,
				color: darkBackground75.val,
			},
		],
	}

	const Shape = circular ? Circle : Square

	return (
		<Shape
			{...BUTTON_PRESS_STYLES}
			size={size}
			alignContent='center'
			justifyContent='center'
			backgroundColor={'transparent'}
			borderWidth={5}
			borderColor='primary'
			padding='1'
			style={shadowStyle}
			onPress={onPress}
			testID={testID ?? undefined}
		>
			<Icon
				large={largeIcon}
				small={!largeIcon}
				name={name}
				disabled={disabled}
				color={'primary'}
			/>

			{title && (
				<SizableText textAlign='center' size={'2'}>
					{title}
				</SizableText>
			)}
		</Shape>
	)
}
