import { usePlayerContext } from "../../../player/provider";
import React from "react";
import { getTokens, Separator, Spacer, Theme, useTheme, XStack, YStack } from "tamagui";
import { Text } from "../helpers/text";
import { RunTimeTicks } from "../helpers/time-codes";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import Icon from "../helpers/icon";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../../../components/types";
import { QueuingType } from "../../../enums/queuing-type";
import BlurhashedImage from "./blurhashed-image";

interface TrackProps {
    track: BaseItemDto;
    navigation: NativeStackNavigationProp<StackParamList>;
    tracklist?: BaseItemDto[] | undefined;
    index?: number | undefined;
    queueName?: string | undefined;
    showArtwork?: boolean | undefined;
    onPress?: () => void | undefined;
    onLongPress?: () => void | undefined;
    isNested?: boolean | undefined;
    invertedColors?: boolean | undefined;
}

export default function Track({
    track,
    tracklist,
    navigation,
    index,
    queueName,
    showArtwork,
    onPress,
    onLongPress,
    isNested,
    invertedColors,
} : TrackProps) : React.JSX.Element {

    const theme = useTheme();
    const { width } = useSafeAreaFrame();
    const { nowPlaying, queue, usePlayNewQueue } = usePlayerContext();

    const isPlaying = nowPlaying?.item.Id === track.Id;

    return (
        <Theme name={invertedColors ? "inverted_purple" : undefined}>
            <Separator />
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
                            tracklist: tracklist ?? queue.map((track) => track.item),
                            queueName: queueName ? queueName : track.Album ? track.Album! : "Queue",
                            queuingType: QueuingType.FromSelection
                        });
                    }
                }}
                onLongPress={
                    onLongPress ? () => onLongPress() 
                    : () => {
                        navigation.push("Details", {
                            item: track,
                            isNested: isNested
                        })
                    }
                }
                paddingVertical={"$2"}
                marginHorizontal={"$1"}
            >
                <XStack 
                    alignContent="center" 
                    justifyContent="center" 
                    flex={1}
                    minHeight={showArtwork ? width / 9 : "unset"}
                >
                    { showArtwork ? (
                        <BlurhashedImage
                            item={track}
                            width={width / 9}
                            cornered
                        />
                    ) : (
                    <Text 
                        color={isPlaying ? getTokens().color.telemagenta : theme.color}
                    >
                        { track.IndexNumber?.toString() ?? "" }
                    </Text>
                )}
                </XStack>

                <YStack alignContent="center" justifyContent="flex-start" flex={5}>
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
                    flex={2}
                >
                    <YStack
                        alignContent="center"
                        justifyContent="center"
                        minWidth={24}
                    >
                        { track.UserData?.IsFavorite ? (
                            <Icon small name="heart" color={getTokens().color.telemagenta.val} />
                        ) : (
                            <Spacer />
                        )}
                    </YStack>

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
                            name="dots-vertical" 
                            onPress={() => {
                                navigation.push("Details", {
                                    item: track,
                                    isNested: isNested
                                });
                            }} 
                        />

                    </YStack>
                </XStack>
            </XStack>
            <Separator />
        </Theme>
    )
}