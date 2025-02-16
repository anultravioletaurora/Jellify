import React from "react";
import { View } from "tamagui";
import { useHomeContext } from "../provider";
import { H2 } from "../../Global/helpers/text";
import { StackParamList } from "../../types";
import { ItemCard } from "../../Global/components/item-card";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import HorizontalCardList from "../../../components/Global/components/horizontal-list";
import { QueryKeys } from "../../../enums/query-keys";

export default function RecentArtists({ navigation }: { navigation: NativeStackNavigationProp<StackParamList>}): React.JSX.Element {

    const { recentArtists } = useHomeContext();

    return (
        <View>
            <H2 marginLeft={"$2"}>Recent Artists</H2>

            <HorizontalCardList
                items={recentArtists}
                onSeeMore={() => {
                    navigation.navigate("Artists", {
                        query: QueryKeys.RecentlyPlayedArtists
                    })
                }}
                renderItem={({ item: recentArtist}) => {
                    return (
                        <ItemCard 
                            item={recentArtist}
                            caption={recentArtist.Name ?? "Unknown Artist"}
                            onPress={() => {
                                navigation.navigate('Artist', 
                                    { 
                                        artist: recentArtist, 
                                    }
                                )}
                            }>
                        </ItemCard>
                    )
                }}
            />
        </View>
    )
}