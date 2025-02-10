import React from "react";
import { Square, Theme } from "tamagui";
import Icon from "./icon";
import { TouchableOpacity } from "react-native";
import { Text } from "./text";

interface IconButtonProps {
    onPress: () => void;
    name: string;
    title?: string | undefined;
    circular?: boolean | undefined;
    size?: number;
    largeIcon?: boolean | undefined;
}

export default function IconButton({
    name,
    onPress,
    title,
    circular,
    size,
    largeIcon
} : IconButtonProps) : React.JSX.Element {

    return (
        <Theme name={"inverted_purple"}>
            <TouchableOpacity>
                <Square
                    animation={"bouncy"}
                    borderRadius={!circular ? "$4" : undefined}
                    circular={circular}
                    elevate
                    hoverStyle={{ scale: 0.925 }}
                    pressStyle={{ scale: 0.875 }}
                    onPress={onPress}
                    width={size}
                    height={size}
                    alignContent="center"
                    justifyContent="center"
                    backgroundColor={"$background"}
                    >
                        <Icon 
                            large={largeIcon}
                            small={!!!largeIcon}
                            name={name} 
                            color={"$color"}
                        />

                        { title && (
                            <Text>{ title }</Text>
                        )}
                </Square>
            </TouchableOpacity>
        </Theme>
    )
}