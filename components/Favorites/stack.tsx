import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StackParamList } from "../types";
import FavoritesScreen from "./component";
import { ArtistScreen } from "../Artist/screens";
import { AlbumScreen } from "../Album/screens";
import { PlaylistScreen } from "../Playlist/screens";
import ArtistsScreen from "../Artists/screen";
import AlbumsScreen from "../Albums/screen";
import TracksScreen from "../Tracks/screen";
import DetailsScreen from "../ItemDetail/screen";
import PlaylistsScreen from "../Playlists/screen";

const FavoritesStack = createNativeStackNavigator<StackParamList>();

export default function Favorites(): React.JSX.Element {
    return (
        <FavoritesStack.Navigator
            initialRouteName="Favorites"
        >
            <FavoritesStack.Screen
                name="Favorites"
                component={FavoritesScreen}
                options={{
                    headerLargeTitle: true,
                    headerLargeTitleStyle: {
                        fontFamily: 'Aileron-Bold'
                    }
                }}
            />

            <FavoritesStack.Screen 
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

            <FavoritesStack.Screen 
                name="Artists" 
                component={ArtistsScreen} 
                options={({ route }) => ({
                    headerLargeTitle: true,
                    headerLargeTitleStyle: {
                        fontFamily: 'Aileron-Bold'
                    }
                })}
            />

            <FavoritesStack.Screen
                name="Album"
                component={AlbumScreen}
                options={({ route }) => ({
                    headerShown: true,
                    headerTitle: ""
                })}
            />

            <FavoritesStack.Screen
                name="Albums"
                component={AlbumsScreen}
                options={{
                    headerLargeTitle: true,
                    headerLargeTitleStyle: {
                        fontFamily: 'Aileron-Bold'
                    }
                }}
            />

            <FavoritesStack.Screen
                name="Tracks"
                component={TracksScreen}
                options={{
                    headerLargeTitle: true,
                    headerLargeTitleStyle: {
                        fontFamily: 'Aileron-Bold'
                    }
                }}
            />

            <FavoritesStack.Screen
                name="Playlists"
                component={PlaylistsScreen}
                options={{
                    headerLargeTitle: true,
                    headerLargeTitleStyle: {
                        fontFamily: 'Aileron-Bold'
                    }
                }}
            />

            <FavoritesStack.Screen
                name="Playlist"
                component={PlaylistScreen}
                options={({ route }) => ({
                    headerShown: true,
                    headerTitle: ""
                })}
            />

            <FavoritesStack.Group screenOptions={{ presentation: 'modal' }}>
                <FavoritesStack.Screen
                    name="Details"
                    component={DetailsScreen}
                    options={{
                        headerShown: false,
                    }}
                />
            </FavoritesStack.Group>
        </FavoritesStack.Navigator>
    )
}