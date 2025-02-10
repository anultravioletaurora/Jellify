import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StackParamList } from "../types";
import Index from "./component";
import DetailsScreen from "../ItemDetail/screen";
import Player from "../Player/stack";

export const DiscoverStack = createNativeStackNavigator<StackParamList>();

export function Discover(): React.JSX.Element {
    return (
        <DiscoverStack.Navigator
            initialRouteName="Discover"
            screenOptions={{

            }}>

            <DiscoverStack.Screen
                name="Discover"
                component={Index}
                options={{
                    headerLargeTitle: true,
                    headerLargeTitleStyle: {
                        fontFamily: 'Aileron-Bold'
                    }
                }}
            />
            
            <DiscoverStack.Group screenOptions={{ presentation: "modal"}}>
                <DiscoverStack.Screen
                    name="Details"
                    component={DetailsScreen}
                    options={{
                        headerShown: false,
                    }}
                />
            </DiscoverStack.Group>
        </DiscoverStack.Navigator>
    )
}