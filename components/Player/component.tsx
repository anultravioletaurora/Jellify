import React from "react";
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../types";
import PlayerScreen from "./screens";
import Queue from "./screens/queue";

export const PlayerStack = createNativeStackNavigator<StackParamList>();

export default function Player({ navigation }: { navigation: NativeStackNavigationProp<StackParamList>}) : React.JSX.Element {
    return (
        <PlayerStack.Navigator
            id="Player"
            initialRouteName="Player"
            screenOptions={{}}
        >
            <PlayerStack.Screen
                name="Player"
                component={PlayerScreen}
                options={{
                    headerShown: false,
                    headerTitle: "",
                }}
            />

            <PlayerStack.Screen
                name="Queue"
                component={Queue}
                options={{
                    headerTitle: ""
                }}
            />

        </PlayerStack.Navigator>
    );
}

