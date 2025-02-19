import { RouteProp, useIsFocused } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../types";
import Client from "../../api/client";
import { QueryKeys } from "../../enums/query-keys";
import { BaseItemKind, ItemSortBy, SortOrder } from "@jellyfin/sdk/lib/generated-client/models";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ScrollView, FlatList } from "react-native";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { YStack } from "tamagui";
import BlurhashedImage from "../Global/components/blurhashed-image";
import FavoriteButton from "../Global/components/favorite-button";
import { ItemCard } from "../Global/components/item-card";
import { H2 } from "../Global/helpers/text";

export function ArtistScreen({ 
    route, 
    navigation 
} : { 
    route: RouteProp<StackParamList, "Artist">, 
    navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {

    const { artist } = route.params;

    navigation.setOptions({
        headerRight: () => { 
            return (
                <FavoriteButton item={artist} />
            )
        }
    });

    const [columns, setColumns] = useState<number>(2);

    const { height, width } = useSafeAreaFrame();

    const bannerHeight = height / 6;

    const { data: albums } = useQuery({
        queryKey: [QueryKeys.ArtistAlbums, artist.Id!],
        queryFn: ({ queryKey }) => {
            return getItemsApi(Client.api!).getItems({
                includeItemTypes: [BaseItemKind.MusicAlbum],
                recursive: true,
                excludeItemIds: [queryKey[1] as string],
                sortBy: [
                    ItemSortBy.PremiereDate,
                    ItemSortBy.ProductionYear,
                    ItemSortBy.SortName
                ],
                sortOrder: [SortOrder.Descending],
                artistIds: [queryKey[1] as string],
            })
            .then((response) => {
                return response.data.Items ? response.data.Items! : [];
            })
        }
    });

    return (
        <ScrollView 
            contentInsetAdjustmentBehavior="automatic"
            removeClippedSubviews
        >
            <YStack alignContent="center" justifyContent="center" minHeight={bannerHeight}>
                <BlurhashedImage
                    borderRadius={0}
                    item={artist}
                    width={width}
                />
            </YStack>

            <H2>Albums</H2>
                <FlatList
                    contentContainerStyle={{
                        flexGrow: 1,
                        alignContent: 'center'
                    }}
                    data={albums}
                    numColumns={columns} // TODO: Make this adjustable
                    renderItem={({ item: album }) => 
                        <ItemCard
                            caption={album.Name}
                            subCaption={album.ProductionYear?.toString()}
                            width={(width / 1.1) / columns}
                            squared 
                            item={album}
                            onPress={() => {
                                navigation.navigate('Album', {
                                    album
                                })
                            }}
                        />
                    }
                />
        </ScrollView>
    )
}