import _, { isUndefined } from "lodash"
import ServerAuthentication from "./screens/server-authentication";
import ServerAddress from "./screens/server-address";
import { createStackNavigator } from "@react-navigation/stack";
import ServerLibrary from "./screens/server-library";
import { useAuthenticationContext } from "./provider";
import { useEffect } from "react";

export default function Login(): React.JSX.Element {

    const { user, server, setTriggerAuth } = useAuthenticationContext();

    const Stack = createStackNavigator();

    useEffect(() => {
        setTriggerAuth(false);
    });

    return (
        <Stack.Navigator 
            initialRouteName={
                isUndefined(server) 
                ? "ServerAddress" 
                : isUndefined(user)
                ? "ServerAuthentication"
                : "LibrarySelection"
            }
            screenOptions={{ headerShown: false }}
        >
                    <Stack.Screen
                        name="ServerAddress"
                        options={{
                            headerShown: false,     
                        }}
                        component={ServerAddress}
                        />
                    
                        <Stack.Screen 
                            name="ServerAuthentication" 
                            options={{ 
                                headerShown: false, 
                            }} 
                            initialParams={{ server }}
                            //@ts-ignore
                            component={ServerAuthentication} 
                        />
                        <Stack.Screen 
                            name="LibrarySelection" 
                            options={{ 
                                headerShown: false, 
                            }} 
                            component={ServerLibrary}
                        />
        </Stack.Navigator>
    );
}