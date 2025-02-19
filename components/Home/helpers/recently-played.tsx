import React, { useMemo } from "react";
import { View } from "tamagui";
import { useHomeContext } from "../provider";
import { H2 } from "../../Global/helpers/text";
import { ItemCard } from "../../Global/components/item-card";
import { usePlayerContext } from "../../../player/provider";
import { StackParamList } from "../../../components/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { trigger } from "react-native-haptic-feedback";
import { QueuingType } from "../../../enums/queuing-type";
import HorizontalCardList from "../../../components/Global/components/horizontal-list";
import { QueryKeys } from "../../../enums/query-keys";

export default function RecentlyPlayed({ 
    navigation 
} : { 
    navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {

    const { nowPlaying, usePlayNewQueue } = usePlayerContext();
    const { recentTracks } = useHomeContext();

    return (
        useMemo(() => {
            return (
                <View>
                <H2 marginLeft={"$2"}>Play it again</H2>

                <HorizontalCardList
                    squared
                    data={recentTracks}
                    onSeeMore={() => {
                        navigation.navigate("Tracks", {
                            query: QueryKeys.RecentlyPlayed
                        })
                    }}
                    renderItem={({ index, item: recentlyPlayedTrack }) => 
                        <ItemCard
                            caption={recentlyPlayedTrack.Name}
                            subCaption={`${recentlyPlayedTrack.Artists?.join(", ")}`}
                            squared
                            width={150}
                            item={recentlyPlayedTrack}
                            onPress={() => {
                                usePlayNewQueue.mutate({ 
                                    track: recentlyPlayedTrack, 
                                    index: index,
                                    tracklist: recentTracks ?? [recentlyPlayedTrack],
                                    queue: "Recently Played",
                                    queuingType: QueuingType.FromSelection
                                });
                            }}
                            onLongPress={() => {
                                trigger("impactMedium");
                                navigation.navigate("Details", {
                                    item: recentlyPlayedTrack,
                                    isNested: false
                                })
                            }}
                        />                                
                    }
                    />
            </View>
            )
        }, [
            recentTracks,
            nowPlaying
        ])
    )
}