import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ItemCard } from "../../Global/components/item-card";
import { H2 } from "../../../components/Global/helpers/text";
import { StackParamList } from "../../../components/types";
import React from "react";
import { FlatList } from "react-native";
import { View, XStack } from "tamagui";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../../enums/query-keys";
import { fetchUserPlaylists } from "../../../api/queries/functions/playlists";

export default function Playlists({ navigation }: { navigation: NativeStackNavigationProp<StackParamList>}) : React.JSX.Element {

    const { data: playlists } = useQuery({
        queryKey: [QueryKeys.UserPlaylists],
        queryFn: () => fetchUserPlaylists()
    });

    return (
        <View>
            <XStack alignContent="center" marginHorizontal={"$2"}>
                <H2 textAlign="left">Your Playlists</H2>
            </XStack>
            <FlatList horizontal
                data={playlists}
                renderItem={({ item: playlist }) => {
                    return (
                        <ItemCard
                            item={playlist}
                            squared
                            caption={playlist.Name ?? "Untitled Playlist"}
                            onPress={() => {
                                navigation.navigate('Playlist', {
                                    playlist
                                })
                            }} />
                    )
                }}
            />
        </View>
    )
}