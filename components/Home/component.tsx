import { StackParamList } from "../types";
import { ScrollView, RefreshControl } from "react-native";
import { YStack, XStack, Separator } from "tamagui";
import Playlists from "./helpers/playlists";
import RecentArtists from "./helpers/recent-artists";
import RecentlyPlayed from "./helpers/recently-played";
import { useHomeContext } from "./provider";
import { H3 } from "../Global/helpers/text";
import Client from "../../api/client";
import { usePlayerContext } from "../../player/provider";
import { useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export function ProvidedHome({ 
    navigation 
} : { 
    navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {

    const { refreshing: refetching, onRefresh: onRefetch } = useHomeContext()

    const { nowPlayingIsFavorite } = usePlayerContext();

    useEffect(() => {
        onRefetch()
    }, [
        nowPlayingIsFavorite
    ])

    return (
            <ScrollView 
                contentInsetAdjustmentBehavior="automatic"
                refreshControl={
                    <RefreshControl 
                    refreshing={refetching} 
                    onRefresh={onRefetch}
                    />
                }
                removeClippedSubviews // Save memory usage
            >
                <YStack alignContent='flex-start'>
                    <XStack margin={"$2"}>
                        <H3>{`Hi, ${Client.user!.name}`}</H3>
                    </XStack>

                    <Separator marginVertical={"$2"} />

                    <RecentArtists navigation={navigation} />

                    <Separator marginVertical={"$3"} />

                    <RecentlyPlayed navigation={navigation} />

                    <Separator marginVertical={"$3"} />

                    <Playlists navigation={navigation}/>
                </YStack>
            </ScrollView>
    );
}