import { AlbumsProps } from "../types";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { ItemCard } from "../Global/components/item-card";
import { FlatList, RefreshControl } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../enums/query-keys";
import { fetchFavoriteAlbums } from "../../api/queries/functions/favorites";
import { fetchRecentlyAdded } from "../../api/queries/functions/recents";

export default function Albums({ navigation, route }: AlbumsProps) : React.JSX.Element {

    const fetchRecentlyAddedAlbums = route.params.query === QueryKeys.RecentlyAdded;

    const { data: albums, refetch, isPending } = useQuery({
        queryKey: [route.params.query],
        queryFn: () => fetchRecentlyAddedAlbums ? fetchRecentlyAdded(20) : fetchFavoriteAlbums()
    });

    const { width } = useSafeAreaFrame();

        return (
            <FlatList
                contentInsetAdjustmentBehavior="automatic"
                numColumns={2}
                data={albums}
                refreshControl={
                    <RefreshControl
                        refreshing={isPending}
                        onRefresh={refetch}
                    />
                }
                renderItem={({ index, item: album}) => 
                    <ItemCard
                        item={album}
                        caption={album.Name ?? "Untitled Album"}
                        subCaption={album.ProductionYear?.toString() ?? ""}
                        squared
                        onPress={() => {
                            navigation.navigate("Album", { album })
                        }}
                        width={width / 2.1}
                    />   
                }
            />
        )
    }