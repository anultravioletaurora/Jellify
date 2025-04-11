import { usePlayerContext } from "../../../player/provider";
import React from "react";
import { getToken, getTokens, Spacer, Theme, useTheme, XStack, YStack } from "tamagui";
import { Text } from "../helpers/text";
import { RunTimeTicks } from "../helpers/time-codes";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import Icon from "../helpers/icon";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../../../components/types";
import { QueuingType } from "../../../enums/queuing-type";
import { Queue } from "../../../player/types/queue-item";
import FavoriteIcon from "./favorite-icon";
import { Image } from "expo-image";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api";
import Client from "../../../api/client";

interface TrackProps {
    track: BaseItemDto;
    navigation: NativeStackNavigationProp<StackParamList>;
    tracklist?: BaseItemDto[] | undefined;
    index?: number | undefined;
    queue: Queue;
    showArtwork?: boolean | undefined;
    onPress?: () => void | undefined;
    onLongPress?: () => void | undefined;
    isNested?: boolean | undefined;
    invertedColors?: boolean | undefined;
    prependElement?: React.JSX.Element | undefined;
    showRemove?: boolean | undefined;
    onRemove?: () => void | undefined;
}

export default function Track({
    track,
    tracklist,
    navigation,
    index,
    queue,
    showArtwork,
    onPress,
    onLongPress,
    isNested,
    invertedColors,
    prependElement,
    showRemove,
    onRemove
} : TrackProps) : React.JSX.Element {

    const theme = useTheme();
    const { width } = useSafeAreaFrame();
    const { nowPlaying, playQueue, usePlayNewQueue } = usePlayerContext();

    const isPlaying = nowPlaying?.item.Id === track.Id;

    return (
        <Theme name={invertedColors ? "inverted_purple" : undefined}>
            <XStack 
                alignContent="center"
                alignItems="center"
                flex={1}
                onPress={() => {
                    if (onPress) {
                        onPress();
                    } else {
                        usePlayNewQueue.mutate({
                            track,
                            index,
                            tracklist: tracklist ?? playQueue.map((track) => track.item),
                            queue,
                            queuingType: QueuingType.FromSelection
                        });
                    }
                }}
                onLongPress={
                    onLongPress ? () => onLongPress() 
                    : () => {
                        navigation.navigate("Details", {
                            item: track,
                            isNested: isNested
                        })
                    }
                }
                paddingVertical={"$2"}
                marginHorizontal={"$1"}
            >

                { prependElement && (
                    <YStack 
                        alignContent="center"
                        justifyContent="center" 
                        flex={1}
                    >
                        { prependElement }
                    </YStack>
                )}

                <XStack 
                    alignContent="center" 
                    justifyContent="center" 
                    flex={showArtwork ? 2 : 1}
                    minHeight={showArtwork ? width / 9 : "unset"}
                >
                    { showArtwork ? (
                        <Image
                            source={getImageApi(Client.api!).getItemImageUrlById(track.AlbumId!)}
                            style={{
                                width: getToken("$12"),
                                height: getToken("$12"),
                                borderRadius: getToken("$1")
                            }}
                        />
                    ) : (
                    <Text 
                        color={isPlaying ? getTokens().color.telemagenta : theme.color}
                    >
                        { track.IndexNumber?.toString() ?? "" }
                    </Text>
                )}
                </XStack>

                <YStack 
                    alignContent="center" 
                    justifyContent="flex-start" 
                    flex={6}
                >
                    <Text 
                        bold
                        color={isPlaying ? getTokens().color.telemagenta : theme.color}
                        lineBreakStrategyIOS="standard"
                        numberOfLines={1}
                    >
                        { track.Name ?? "Untitled Track" }
                    </Text>

                    { (showArtwork || (track.ArtistCount ?? 0 > 1)) && (
                        <Text 
                            lineBreakStrategyIOS="standard" 
                            numberOfLines={1}
                        >
                            { track.Artists?.join(", ") ?? "" }
                        </Text>
                    )}
                </YStack>

                <XStack 
                    alignItems="center"
                    justifyContent="space-between" 
                    alignContent="center" 
                    flex={3}
                >
                    <FavoriteIcon item={track} />

                    <YStack
                        alignContent="center"
                        justifyContent="space-around"
                    >
                        <RunTimeTicks>{ track.RunTimeTicks }</RunTimeTicks>
                    </YStack>

                    <YStack
                        alignContent="center"
                        justifyContent="center"
                    >
                        <Icon 
                            name={showRemove ? "close" : "dots-horizontal"} 
                            onPress={() => {
                                if (showRemove) {
                                    if (onRemove)
                                        onRemove()
                                }
                                else {
                                    navigation.navigate("Details", {
                                        item: track,
                                        isNested: isNested
                                    });
                                }
                            }} 
                        />

                    </YStack>
                </XStack>
            </XStack>
        </Theme>
    )
}