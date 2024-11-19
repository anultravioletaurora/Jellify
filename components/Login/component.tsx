import _ from "lodash"
import ServerAuthentication from "./helpers/server-authentication";
import ServerAddress from "./helpers/server-address";
import { createStackNavigator } from "@react-navigation/stack";
import ServerLibrary from "./helpers/server-library";
import { useAuthenticationContext } from "./provider";
import { useEffect } from "react";
import { useApiClientContext } from "../jellyfin-api-provider";

export default function Login(): React.JSX.Element {

    const { changeServer, server, username, changeUsername, setTriggerAuth } = useAuthenticationContext();

    const { apiClient, accessToken } = useApiClientContext();

    const Stack = createStackNavigator();

    useEffect(() => {
        setTriggerAuth(false);
    })

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {
                (_.isUndefined(server) || changeServer) ? (
                    <Stack.Screen
                        name="ServerAddress"
                        options={{
                            headerShown: false,     
                            animationTypeForReplace: changeServer ? 'pop' : 'push'    
                        }}
                        component={ServerAddress}
                        />
                    ) : (
                    
                    (_.isUndefined(accessToken) || changeUsername) ? (
                        <Stack.Screen 
                            name="ServerAuthentication" 
                            options={{ 
                                headerShown: false, 
                                animationTypeForReplace: changeUsername ? 'pop' : 'push'
                            }} 
                            component={ServerAuthentication} 
                        />
                    ) : (
                        <Stack.Screen 
                            name="LibrarySelection" 
                            options={{ 
                                headerShown: false, 
                                animationTypeForReplace: 'push'
                            }} 
                            component={ServerLibrary}
                        />
                    )
                )
            }
        </Stack.Navigator>
    );
}