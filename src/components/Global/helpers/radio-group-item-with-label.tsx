import { SizeTokens, XStack, RadioGroup, Label } from 'tamagui'

interface RadioGroupItemWithLabelProps {
	size: SizeTokens
	value: string
	label: string
}

export function RadioGroupItemWithLabel({ size, value, label }: RadioGroupItemWithLabelProps) {
	const id = `radiogroup-${value}`
	return (
		<XStack alignItems='center' gap='4'>
			<RadioGroup.Item value={value} id={id} size={size}>
				<RadioGroup.Indicator />
			</RadioGroup.Item>

			<Label size={size} htmlFor={id}>
				{label}
			</Label>
		</XStack>
	)
}
