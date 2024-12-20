import { Button as TamaguiButton } from 'tamagui';
import { styles } from './text';

interface ButtonProps {
    children: string;
    onPress: () => void;
    disabled?: boolean | undefined;
}

export default function Button(props: ButtonProps): React.JSX.Element {

    return (
        <TamaguiButton 
            style={styles.heading}
            disabled={props.disabled}
            marginVertical={30}
            onPress={props.onPress}
        >
            { props.children }
        </TamaguiButton>
    )
}