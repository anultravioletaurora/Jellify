import React from 'react'
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons'
import { CheckboxProps, XStack, Checkbox, Label, useTheme, FontSizeTokens } from 'tamagui'

type CheckboxWithLabelSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// Checkbox no longer has a `size` variant in Tamagui v3, so map our named sizes
// to an explicit box dimension and a corresponding label font size ourselves.
const CHECKBOX_SIZE_PX: Record<CheckboxWithLabelSize, number> = {
	xs: 24,
	sm: 32,
	md: 36,
	lg: 40,
	xl: 48,
}

const CHECKBOX_LABEL_FONT_SIZE: Record<CheckboxWithLabelSize, FontSizeTokens> = {
	xs: '2',
	sm: '3',
	md: '4',
	lg: '5',
	xl: '6',
}

export function CheckboxWithLabel({
	size,
	label = 'Toggle',
	id,
	...checkboxProps
}: Omit<CheckboxProps, 'size'> & {
	label?: string
	id?: string
	size?: CheckboxWithLabelSize
}) {
	const theme = useTheme()
	const checkboxId = id || `checkbox-${label}`
	const boxSize = CHECKBOX_SIZE_PX[size ?? 'md']
	return (
		<XStack width={150} alignItems='center' gap='4'>
			<Checkbox id={checkboxId} width={boxSize} height={boxSize} {...checkboxProps}>
				<Checkbox.Indicator>
					<MaterialDesignIcons name='check' />
				</Checkbox.Indicator>
			</Checkbox>

			<Label
				color={checkboxProps.disabled ? 'borderColor' : theme.primary.val}
				size={CHECKBOX_LABEL_FONT_SIZE[size ?? 'md']}
				htmlFor={checkboxId}
			>
				{label}
			</Label>
		</XStack>
	)
}
