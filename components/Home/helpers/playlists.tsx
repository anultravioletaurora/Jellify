import { useUserPlaylists } from "@/api/queries/playlist";
import { Card } from "@/components/Global/helpers/card";
import { H2 } from "@/components/Global/helpers/text";
import { useApiClientContext } from "@/components/jellyfin-api-provider";
import { ProvidedHomeProps } from "@/components/types";
import React from "react";
import { FlatList } from "react-native";
import { View } from "tamagui";

export default function Playlists({ navigation }: ProvidedHomeProps) : React.JSX.Element {

    const { apiClient, user, library } = useApiClientContext();

    const { data: playlists } = useUserPlaylists(apiClient!, user!.id, library!.playlistLibraryId);

    return (
        <View>
            <H2 marginLeft={"$2"}>Your Playlists</H2>
            <FlatList horizontal
                data={playlists}
                renderItem={({ item: playlist }) => {
                    return (
                        <Card
                            itemId={playlist.Id!}
                            caption={playlist.Name ?? "Untitled Playlist"}
                            onPress={() => {
                                navigation.navigate('Playlist', {
                                    playlist
                                })
                            }} />
                    )
                }} />
        </View>
    )
}