import { HomeAlbumProps } from "../types";
import { YStack, XStack, Separator } from "tamagui";
import { ItemSortBy } from "@jellyfin/sdk/lib/generated-client/models";
import { H3, H5, Text } from "../Global/helpers/text";
import { FlatList } from "react-native";
import { RunTimeTicks } from "../Global/helpers/time-codes";
import Track from "../Global/components/track";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import FavoriteButton from "../Global/components/favorite-button";
import BlurhashedImage from "../Global/components/blurhashed-image";
import Avatar from "../Global/components/avatar";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../enums/query-keys";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api";
import Client from "../../api/client";
import { useMemo } from "react";


export function AlbumScreen({ 
    route, 
    navigation 
} : HomeAlbumProps): React.JSX.Element {

    const { album } = route.params;

    navigation.setOptions({
        headerRight: () => {
            return (
                <FavoriteButton item={album} />
            )
        }
    })
    const { width } = useSafeAreaFrame();

    const { data: tracks } =  useQuery({
        queryKey: [QueryKeys.ItemTracks, album.Id!],
        queryFn: () => {

            let sortBy: ItemSortBy[] = [];

            sortBy = [
                ItemSortBy.ParentIndexNumber,
                ItemSortBy.IndexNumber,
                ItemSortBy.SortName
            ]

            return getItemsApi(Client.api!).getItems({
                parentId: album.Id!,
                sortBy
            })
            .then((response) => {
                return response.data.Items ? response.data.Items! : [];
            })
        },
    });

    return (
            <FlatList
                contentInsetAdjustmentBehavior="automatic"
                data={tracks}
                keyExtractor={(item) => item.Id!}
                numColumns={1}
                ItemSeparatorComponent={() => <Separator />}
                ListHeaderComponent={(
                    useMemo(() => {
                        return (
                            <YStack 
                                alignItems="center" 
                                alignContent="center"
                                marginTop={"$4"}
                                minHeight={width / 1.1}
                                >
                                <BlurhashedImage
                                    item={album}
                                    width={width / 1.1}
                                    height={width / 1.1}
                                    />

                                <H5>{ album.Name ?? "Untitled Album" }</H5>
                                <Text>{ album.ProductionYear?.toString() ?? "" }</Text>
                            </YStack>
                        )
                    }, [
                        album
                    ])

                )}
                renderItem={({ item: track, index }) => {
                    
                    return (
                        <Track
                            track={track}
                            tracklist={tracks!}
                            index={index}
                            navigation={navigation}
                            queue={album}
                        />
                    )
                    
                }}
                ListFooterComponent={(
                    <YStack justifyContent="flex-start">
                        <XStack flex={1} marginTop={"$3"} justifyContent="flex-end">
                            <Text 
                                color={"$borderColor"} 
                                style={{ display: "block"}}
                                marginRight={"$1"}
                                >
                                Total Runtime: 
                            </Text>
                            <RunTimeTicks>{ album.RunTimeTicks }</RunTimeTicks>
                        </XStack>

                        <H3>Album Artists</H3>
                        <FlatList
                            horizontal
                            keyExtractor={(item) => item.Id!}
                            data={album.ArtistItems}
                            renderItem={({ index, item: artist }) => {
                                return (
                                    <Avatar
                                        circular
                                        item={artist}
                                        width={width / 4}
                                        onPress={() => {
                                            navigation.navigate("Artist", {
                                                artist
                                            });
                                        }}
                                        subheading={artist.Name ?? "Unknown Artist"}
                                    />
                                )
                            }}
                            />
                    </YStack>

                )}
                // style={{
                //     overflow: 'hidden' // Prevent unnecessary memory usage
                // }} 
            />
    )
}