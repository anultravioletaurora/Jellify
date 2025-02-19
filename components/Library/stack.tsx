import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StackParamList } from "../types";
import Library from "./component";
import { AlbumScreen } from "../Album";
import { PlaylistScreen } from "../Playlist/screens";
import ArtistsScreen from "../Artists/screen";
import AlbumsScreen from "../Albums/screen";
import TracksScreen from "../Tracks/screen";
import DetailsScreen from "../ItemDetail/screen";
import PlaylistsScreen from "../Playlists/screen";
import AddPlaylist from "./components/add-playlist";
import DeletePlaylist from "./components/delete-playlist";
import { ArtistScreen } from "../Artist";

const Stack = createNativeStackNavigator<StackParamList>();

export default function LibraryStack(): React.JSX.Element {
    return (
        <Stack.Navigator
            initialRouteName="Library"
        >
            <Stack.Screen
                name="Library"
                component={Library}
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
                name="Artists" 
                component={ArtistsScreen} 
                options={({ route }) => ({
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
                name="Albums"
                component={AlbumsScreen}
                options={{
                }}
            />

            <Stack.Screen
                name="Tracks"
                component={TracksScreen}
                options={{
                }}
            />

            <Stack.Screen
                name="Playlists"
                component={PlaylistsScreen}
                options={{
                }}
            />

            <Stack.Screen
                name="Playlist"
                component={PlaylistScreen}
                options={({ route }) => ({
                    headerShown: true,
                    headerTitle: ""
                })}
            />

            <Stack.Group screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen
                    name="Details"
                    component={DetailsScreen}
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack.Group>

            {/* https://www.reddit.com/r/reactnative/comments/1dgktbn/comment/lxd23sj/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button */}
            <Stack.Group screenOptions={{ 
                presentation: 'formSheet', 
                sheetInitialDetentIndex: 0, 
                sheetAllowedDetents: [0.35] 
            }}>
                <Stack.Screen
                    name="AddPlaylist"
                    component={AddPlaylist}
                    options={{
                        title: "Add Playlist",
                    }}
                />

                <Stack.Screen
                    name="DeletePlaylist"
                    component={DeletePlaylist}
                    options={{
                        title: "Delete Playlist"
                    }}
                />
            </Stack.Group>

        </Stack.Navigator>
    )
}