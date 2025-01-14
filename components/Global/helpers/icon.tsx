import React from "react"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { Colors } from "../../../enums/colors"

const regularSize = 36;

const largeSize = 48

export default function Icon({ name, onPress, large }: { name: string, onPress?: Function, large?: boolean }) : React.JSX.Element {
    
    let size = large ? largeSize : regularSize
    
    return (
        <MaterialCommunityIcons 
            color={Colors.White}
            name={name} 
            onPress={() => {
                if (onPress)
                    onPress();
            }}
            size={size}
        />
    )
}