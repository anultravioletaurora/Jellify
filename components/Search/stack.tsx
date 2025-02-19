import { createNativeStackNavigator } from "@react-navigation/native-stack"
import SearchScreen from "./screen";
import { StackParamList } from "../types";
import { ArtistScreen } from "../Artist";
import { AlbumScreen } from "../Album";
import { PlaylistScreen } from "../Playlist/screens";
import DetailsScreen from "../ItemDetail/screen";

const Stack = createNativeStackNavigator<StackParamList>();

export default function SearchStack() : React.JSX.Element {
    return (
        <Stack.Navigator>
                <Stack.Screen
                    name="Search"
                    component={SearchScreen}
                    options={{
                        headerLargeTitle: true,
                        headerLargeTitleStyle: {
                            fontFamily: 'Aileron-Bold'
                        }
                    }}
                />

                <Stack.Screen 
                    name="Artist" 
                    component={ArtistScreen} 
                    options={({ route }) => ({
                        title: route.params.artist.Name ?? "Unknown Artist",
                        headerLargeTitle: true,
                        headerLargeTitleStyle: {
                            fontFamily: 'Aileron-Bold'
                        }
                    })}
                />

                <Stack.Screen
                    name="Album"
                    component={AlbumScreen}
                    options={({ route }) => ({
                        headerShown: true,
                        headerTitle: ""
                    })}
                />

                <Stack.Screen
                    name="Playlist"
                    component={PlaylistScreen}
                    options={({ route }) => ({
                        headerShown: true,
                        headerTitle: ""
                    })}
                />

                <Stack.Screen
                    name="Details"
                    component={DetailsScreen}
                    options={{
                        headerShown: false,
                        presentation: "modal"
                    }}
                />
        </Stack.Navigator>
    )
}