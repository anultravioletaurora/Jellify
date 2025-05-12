import { SizeTokens, XStack, Separator, Switch, Theme, styled, getToken, useTheme } from 'tamagui'
import { Label } from './text'
import { useColorScheme } from 'react-native'

interface SwitchWithLabelProps {
	onCheckedChange: (value: boolean) => void
	size: SizeTokens
	checked: boolean
	label: string
	width?: number | undefined
}

const JellifySliderThumb = styled(Switch.Thumb, {
	borderColor: getToken('$color.amethyst'),
	backgroundColor: getToken('$color.purpleDark'),
})

export function SwitchWithLabel(props: SwitchWithLabelProps) {
	const theme = useTheme()

	const id = `switch-${props.size.toString().slice(1)}-${props.checked ?? ''}}`
	return (
		<XStack alignItems='center' gap='$3'>
			<Switch
				id={id}
				size={props.size}
				checked={props.checked}
				onCheckedChange={(checked: boolean) => props.onCheckedChange(checked)}
				backgroundColor={props.checked ? '$success' : '$borderColor'}
				borderColor={'$borderColor'}
			>
				<JellifySliderThumb animation='bouncy' />
			</Switch>
			<Separator minHeight={20} vertical />
			<Label size={props.size} htmlFor={id}>
				{props.label}
			</Label>
		</XStack>
	)
}
