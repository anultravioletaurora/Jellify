import { StackParamList } from "../types";
import { FlatList, RefreshControl } from "react-native";
import Track from "../Global/components/track";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { fetchFavoriteTracks } from "../../api/queries/functions/favorites";
import { QueryKeys } from "../../enums/query-keys";
import { useQuery } from "@tanstack/react-query";

export default function Tracks({ navigation }: { navigation: NativeStackNavigationProp<StackParamList> }) : React.JSX.Element {

    const { data: tracks, refetch, isPending } = useQuery({
        queryKey: [QueryKeys.FavoriteTracks],
        queryFn: () => fetchFavoriteTracks()
    });

    return (
        <FlatList
            contentInsetAdjustmentBehavior="automatic"
            numColumns={1}
            data={tracks}
            refreshControl={
                <RefreshControl
                    refreshing={isPending}
                    onRefresh={refetch}
                />
            }
            renderItem={({ index, item: track}) => {
                return (
                    <Track
                        navigation={navigation}
                        showArtwork
                        track={track}
                        tracklist={tracks?.slice(index, index + 50) ?? []}
                        queue="Favorite Tracks"
                    />

                )
            }}
            style={{
                overflow: 'hidden' // Prevent unnecessary memory usage
            }} 
        />
    )
}