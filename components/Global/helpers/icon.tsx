import React from "react"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useTheme } from "tamagui";

const smallSize = 24;

const regularSize = 36;

const largeSize = 48

export default function Icon({ 
    name, 
    onPress, 
    small, 
    large, 
    color 
}: { 
    name: string, 
    onPress?: () => void, 
    small?: boolean, 
    large?: boolean, 
    color?: string | undefined
}) : React.JSX.Element {
    
    const theme = useTheme();
    let size = large ? largeSize : small ? smallSize : regularSize
    
    return (
        <MaterialCommunityIcons 
            color={color ? color 
                : theme.color.val
            }
            name={name} 
            onPress={onPress}
            size={size}
        />
    )
}