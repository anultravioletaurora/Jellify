import _ from "lodash";
import { HomeProvider } from "./provider";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StackParamList } from "../types";
import { AlbumScreen } from "../Album";
import { PlaylistScreen } from "../Playlist/screens";
import { ProvidedHome } from "./component";
import DetailsScreen from "../ItemDetail/screen";
import AddPlaylist from "../Library/components/add-playlist";
import ArtistsScreen from "../Artists/screen";
import TracksScreen from "../Tracks/screen";
import { ArtistScreen } from "../Artist";

const Stack = createNativeStackNavigator<StackParamList>();

export default function Home(): React.JSX.Element {

    return (
        <HomeProvider>
            <Stack.Navigator 
                
                initialRouteName="Home"
                screenOptions={{
                    
                }}
            >
                <Stack.Group>
                    <Stack.Screen 
                        name="Home" 
                        component={ProvidedHome} 
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
                        name="Artists"
                        component={ArtistsScreen}
                    />

                    <Stack.Screen
                        name="Tracks"
                        component={TracksScreen}
                        options={{
                            title: "Recent Tracks"
                        }}
                    />

                    <Stack.Screen
                        name="Album"
                        component={AlbumScreen}
                        options={({ route }) => ({
                            title: route.params.album.Name ?? "Untitled Album",
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

                </Stack.Group>

                <Stack.Group screenOptions={{ presentation: 'modal' }}>
                    <Stack.Screen
                        name="Details"
                        component={DetailsScreen}
                        options={{
                            headerShown: false,
                        }}
                    />
                </Stack.Group>
            </Stack.Navigator>
        </HomeProvider>
    );
}