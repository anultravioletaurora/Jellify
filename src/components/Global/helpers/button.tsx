import { Button as TamaguiButton, ButtonProps as TamaguiButtonProps } from 'tamagui'

interface ButtonProps extends TamaguiButtonProps {
	children?: Element | string | undefined
	onPress?: () => void | undefined
	disabled?: boolean | undefined
	danger?: boolean | undefined
}

export default function Button(props: ButtonProps): React.JSX.Element {
	return (
		<TamaguiButton bordered opacity={props.disabled ? 0.5 : 1} marginVertical={30} {...props} />
	)
}
