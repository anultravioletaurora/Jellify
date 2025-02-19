import { useQuery } from "@tanstack/react-query";
import { StackParamList } from "../../../components/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { QueryKeys } from "../../../enums/query-keys";
import { fetchRecentlyAdded } from "../../../api/queries/functions/recents";
import HorizontalCardList from "../../../components/Global/components/horizontal-list";
import { ItemCard } from "../../../components/Global/components/item-card";
import { H2 } from "../../../components/Global/helpers/text";
import Client from "../../../api/client";

export default function RecentlyAdded({ 
    navigation
} : { 
    navigation: NativeStackNavigationProp<StackParamList>
}) : React.JSX.Element {

    const { data } = useQuery({
        queryKey: [QueryKeys.RecentlyAdded],
        queryFn: () => fetchRecentlyAdded()
    });

    return (
        <HorizontalCardList
            squared
            data={data}
            onSeeMore={() => {
                navigation.navigate("Albums", {
                    query: QueryKeys.RecentlyAdded
                })
            }}
            renderItem={({ item }) => 
                <ItemCard
                    caption={item.Name}
                    subCaption={`${item.Artists?.join(", ")}`}
                    squared
                    width={150}
                    item={item}
                    onPress={() => {
                        navigation.navigate("Album", {
                            album: item
                        })
                    }}
                />
            }
        />
    )
}