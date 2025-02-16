import { useSafeAreaFrame } from "react-native-safe-area-context";
import React from "react";
import { FlatList, RefreshControl } from "react-native";
import { ItemCard } from "../Global/components/item-card";
import { ArtistsProps } from "../types";
import { QueryKeys } from "../../enums/query-keys";
import { useQuery } from "@tanstack/react-query";
import { fetchRecentlyPlayedArtists } from "../../api/queries/functions/recents";
import { fetchFavoriteArtists } from "../../api/queries/functions/favorites";

export default function Artists({ 
    navigation,
    route
}: ArtistsProps): React.JSX.Element {

    const { data: artists, refetch, isPending } = 
        route.params.query === 
            QueryKeys.FavoriteArtists ? useQuery({
                queryKey: [QueryKeys.FavoriteArtists],
                queryFn: () => fetchFavoriteArtists()
            }) : 
            
            QueryKeys.RecentlyPlayedArtists ? useQuery({
                queryKey: [QueryKeys.RecentlyPlayedArtists],
                queryFn: () => fetchRecentlyPlayedArtists()
            }) :
            
            useQuery({
                queryKey: [QueryKeys.FavoriteArtists],
                queryFn: () => fetchFavoriteArtists()
            });

    const { width } = useSafeAreaFrame();

    return (
        <FlatList
            contentInsetAdjustmentBehavior="automatic"
            numColumns={2}
            data={artists}
            refreshControl={
                <RefreshControl
                    refreshing={isPending}
                    onRefresh={refetch}
                />
            }
            renderItem={({ index, item: artist}) => {
                return (
                    <ItemCard
                        item={artist}
                        caption={artist.Name ?? "Unknown Artist"}
                        onPress={() => {
                            navigation.navigate("Artist", { artist })
                        }}
                        width={width / 2.1}
                    />
                )
            }}
        />
    )
}