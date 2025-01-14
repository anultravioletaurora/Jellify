import { Button as TamaguiButton } from 'tamagui';

interface ButtonProps {
    children?: Element | string | undefined;
    onPress?: () => void | undefined;
    disabled?: boolean | undefined;
}

export default function Button(props: ButtonProps): React.JSX.Element {

    return (
        <TamaguiButton 
            disabled={props.disabled}
            marginVertical={30}
            onPress={props.onPress}
        >
            { props.children }
        </TamaguiButton>
    )
}