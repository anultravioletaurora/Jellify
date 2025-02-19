import { Card, getTokens, View } from "tamagui";
import { H2, H4 } from "./text";
import Icon from "./icon";

interface IconCardProps {
    name: string;
    circular?: boolean | undefined;
    onPress: () => void;
    width?: number | undefined
    caption?: string | undefined;
    largeIcon?: boolean | undefined
}

export default function IconCard({ 
    name, 
    circular = false,
    onPress,
    width,
    caption,
    largeIcon
 }: IconCardProps) : React.JSX.Element {

    return (
        <View 
            alignItems="center"
            margin={5}
            >
            <Card 
                animation="bouncy"
                borderRadius={circular ? 300 : 5}
                hoverStyle={{ scale: 0.925 }}
                pressStyle={{ scale: 0.875 }}
                width={width ? width : 150}
                height={width ? width : 150}
                onPress={onPress}
            >
                <Card.Header>
                    <H4 color={getTokens().color.purpleDark}>{ caption ?? "" }</H4>
                    <Icon 
                        color={getTokens().color.purpleDark.val} 
                        name={name} 
                        large={largeIcon}
                        small={!!!largeIcon}
                    />
                </Card.Header>
                <Card.Footer padded>
                </Card.Footer>
                <Card.Background 
                    backgroundColor={getTokens().color.telemagenta}
                    borderRadius={circular ? 300 : 5}
                >

                </Card.Background>
            </Card>
        </View>
    )
}