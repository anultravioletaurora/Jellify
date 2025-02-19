import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Root from "./component";
import AccountDetails from "./screens/account-details";
import DevToolsScreen from "./screens/dev-tools";
import DetailsScreen from "../ItemDetail/screen";
import { StackParamList } from "../types";

export const SettingsStack = createNativeStackNavigator<StackParamList>();

export default function Settings(): React.JSX.Element {
    return (
        <SettingsStack.Navigator>

            <SettingsStack.Screen 
                name="Settings" 
                component={Root} 
                options={{
                    headerLargeTitle: true,
                    headerLargeTitleStyle: {
                        fontFamily: 'Aileron-Bold'
                    }
                }}
            />

            <SettingsStack.Screen
                name="AccountDetails"
                component={AccountDetails}
                options={{
                    title: "Account",
                    headerLargeTitle: true,
                    headerLargeTitleStyle: {
                        fontFamily: 'Aileron-Bold'
                    }
                }}
            />

            <SettingsStack.Screen
                name="DevTools"
                component={DevToolsScreen}
                options={{
                    headerLargeTitle: true,
                    headerLargeTitleStyle: {
                        fontFamily: 'Aileron-Bold'
                    }    
                }}
            />

            <SettingsStack.Group screenOptions={{ presentation: 'modal'}}>
                <SettingsStack.Screen
                    name="Details"
                    component={DetailsScreen}
                    options={{
                        headerShown: false
                    }}
                />
            </SettingsStack.Group>
        </SettingsStack.Navigator>
    )
}