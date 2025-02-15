import React from "react";
import { getToken, ScrollView, View, XStack, YStack } from "tamagui";
import { useHomeContext } from "../provider";
import { H2 } from "../../Global/helpers/text";
import { ItemCard } from "../../Global/components/item-card";
import { usePlayerContext } from "../../../player/provider";
import { StackParamList } from "../../../components/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { trigger } from "react-native-haptic-feedback";
import { QueuingType } from "../../../enums/queuing-type";
import Icon from "../../../components/Global/helpers/icon";
import { FlatList } from "react-native";

export default function RecentlyPlayed({ 
    navigation 
} : { 
    navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {

    const { usePlayNewQueue } = usePlayerContext();
    const { recentTracks } = useHomeContext();

    return (
        <View>
            <XStack alignContent="center" marginHorizontal="$2">
                <H2 textAlign="left">Play it again</H2>

                { recentTracks && (
                    <YStack justifyContent="center" alignContent="center" marginTop={7} marginLeft={"$2"}>
                        <Icon 
                            name="play-circle-outline" 
                            color={getToken("$color.telemagenta")} 
                            onPress={() => {
                                usePlayNewQueue.mutate({ 
                                    track: recentTracks[0], 
                                    index: 0,
                                    tracklist: recentTracks,
                                    queue: "Recently Played",
                                    queuingType: QueuingType.FromSelection
                                });
                            }}
                        />
                    </YStack>
                )}
            </XStack>
            <FlatList 
                horizontal
                data={recentTracks}
                renderItem={({ index, item: recentlyPlayedTrack }) => {
                    return (
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
                    )
                }} 
                style={{
                    overflow: 'hidden'
                }}
            />
        </View>
    )
}