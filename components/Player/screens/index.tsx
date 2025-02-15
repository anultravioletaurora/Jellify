import { HorizontalSlider } from "../../../components/Global/helpers/slider";
import { RunTimeSeconds } from "../../../components/Global/helpers/time-codes";
import { StackParamList } from "../../../components/types";
import { usePlayerContext } from "../../../player/provider";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState, useEffect, useMemo } from "react";
import { SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context";
import { YStack, XStack, Spacer, getTokens } from "tamagui";
import PlayPauseButton from "../helpers/buttons";
import { Text } from "../../../components/Global/helpers/text";
import Icon from "../../../components/Global/helpers/icon";
import FavoriteButton from "../../Global/components/favorite-button";
import BlurhashedImage from "../../Global/components/blurhashed-image";
import TextTicker from "react-native-text-ticker";
import { ProgressMultiplier, TextTickerConfig } from "../component.config";
import { toUpper } from "lodash";
import { trigger } from "react-native-haptic-feedback";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";

const scrubGesture = Gesture.Pan();

export default function PlayerScreen({ 
    navigation 
} : { 
    navigation: NativeStackNavigationProp<StackParamList>
}) : React.JSX.Element {

    const { 
        useTogglePlayback, 
        nowPlayingIsFavorite,
        setNowPlayingIsFavorite,
        nowPlaying, 
        progress, 
        useSeekTo, 
        useSkip, 
        usePrevious, 
        playQueue,
        queue
    } = usePlayerContext();
    
    const [seeking, setSeeking] = useState<boolean>(false);

    /**
     * TrackPlayer.getProgress() returns a high sig-fig number. We're going to apply
     * a multiplier so that the scrubber bar can take advantage of those extra numbers
     */
    const [progressState, setProgressState] = useState<number>(
        progress && progress.position 
        ? Math.ceil(progress.position * ProgressMultiplier)
        : 0
    );

    const { width } = useSafeAreaFrame();

    useEffect(() => {
        if (!seeking)
            progress && progress.position
            ? setProgressState(
                Math.ceil(
                    progress.position * ProgressMultiplier
                )
            ) : 0;
    }, [
        progress
    ]);

    return (
        <SafeAreaView edges={["right", "left"]}>
            { nowPlaying && (
            <>
                <YStack>

                    <XStack marginHorizontal={"$2"}>

                        <YStack 
                            alignContent="flex-end"
                            flex={1}
                            justifyContent="center"
                        >
                            <Icon
                                name="chevron-down"
                                onPress={() => {
                                    navigation.goBack();
                                }}
                                small
                            />
                        </YStack>

                        <YStack 
                            alignItems="center"
                            alignContent="center"
                            flex={3}
                        >
                            <Text>Playing from</Text>
                            <TextTicker {...TextTickerConfig}>
                                <Text bold>
                                    { 
                                        // If the Queue is a BaseItemDto, display the name of it
                                        typeof(queue) === 'object' 
                                        ? (queue as BaseItemDto).Name ?? "Untitled"
                                        : queue
                                    }
                                </Text>
                            </TextTicker>
                        </YStack>

                        <Spacer flex={1} />
                    </XStack>

                    <XStack 
                        justifyContent="center"
                        alignContent="center"
                        minHeight={width / 1.1}
                        // onPress={() => {
                        //     useTogglePlayback.mutate(undefined)
                        // }}
                    >
                    { useMemo(() => {
                        return (
                            <BlurhashedImage
                                item={nowPlaying!.item}
                                width={width / 1.1}
                            />
                        )
                    }, [
                        nowPlaying
                    ])}
                    </XStack>

                    <XStack marginHorizontal={20} paddingVertical={5}>

                        {/** Memoize TextTickers otherwise they won't animate due to the progress being updated in the PlayerContext */}
                        { useMemo(() => {
                            return (
                                <YStack justifyContent="flex-start" flex={5}>
                                    <TextTicker {...TextTickerConfig}>
                                        <Text 
                                            bold 
                                            fontSize={"$6"}
                                            >
                                            {nowPlaying!.title ?? "Untitled Track"}
                                        </Text>
                                    </TextTicker>

                                    <TextTicker {...TextTickerConfig}>
                                        <Text 
                                            fontSize={"$6"}
                                            color={getTokens().color.telemagenta}
                                            onPress={() => {
                                                if (nowPlaying!.item.ArtistItems) {
                                                    navigation.goBack(); // Dismiss player modal
                                                    navigation.navigate('Tabs', {
                                                        screen: 'Home', 
                                                        params: {
                                                            screen: 'Artist',
                                                            params: {
                                                                artist: nowPlaying!.item.ArtistItems![0],
                                                            }
                                                        }
                                                    });
                                                }
                                            }}
                                            >
                                            {nowPlaying.artist ?? "Unknown Artist"}
                                        </Text>
                                    </TextTicker>

                                    <TextTicker {...TextTickerConfig}>
                                        <Text 
                                            fontSize={"$6"} 
                                            color={"$borderColor"}
                                            >
                                            { nowPlaying!.album ?? "" }
                                        </Text>
                                    </TextTicker>
                                </YStack>
                        )}, [
                            nowPlaying
                        ])}

                        <XStack 
                            justifyContent="flex-end" 
                            alignItems="center" 
                            flex={2}
                        >
                            {/* Buttons for favorites, song menu go here */}

                            <Icon
                                name="dots-horizontal-circle-outline"
                                onPress={() => {
                                    navigation.navigate("Details", {
                                        item: nowPlaying!.item,
                                        isNested: true
                                    });
                                }}
                            />

                            <Spacer />

                            <FavoriteButton 
                                item={nowPlaying!.item} 
                                onToggle={() => setNowPlayingIsFavorite(!nowPlayingIsFavorite)}
                            />
                        </XStack>
                    </XStack>

                    <XStack justifyContent="center" marginTop={"$3"}>
                        {/* playback progress goes here */}
                        { useMemo(() => {

                            return (
                                <GestureDetector gesture={scrubGesture}>
                                    <HorizontalSlider 
                                        value={progressState}
                                        max={
                                            progress && progress.duration > 0 
                                            ? progress.duration * ProgressMultiplier 
                                            : 1
                                        }
                                        width={width / 1.1}
                                        props={{
                                            // If user swipes off of the slider we should seek to the spot
                                            onPressOut: () => {
                                                setSeeking(false);

                                                navigation.setOptions({
                                                    gestureEnabled: true
                                                });

                                                useSeekTo.mutate(Math.floor(progressState / ProgressMultiplier));
                                            },
                                            onSlideStart: () => {
                                                trigger("impactLight");
                                                setSeeking(true);

                                                navigation.setOptions({
                                                    gestureEnabled: false
                                                });
                                            },
                                            onSlideMove: (event, value) => {
                                                setSeeking(true);

                                                navigation.setOptions({
                                                    gestureEnabled: false
                                                });

                                                setProgressState(value);
                                            },
                                            onSlideEnd: (event, value) => {
                                                setSeeking(false);
                                                
                                                navigation.setOptions({
                                                    gestureEnabled: true
                                                });
                                                
                                                useSeekTo.mutate(Math.floor(value / ProgressMultiplier));
                                            }
                                        }}
                                    />
                                </GestureDetector>
                            )}, [
                                progressState
                            ]
                        )}
                    </XStack>

                    <XStack marginHorizontal={20} marginTop={"$3"} marginBottom={"$2"}>
                        <XStack flex={1} justifyContent="flex-start">
                            <RunTimeSeconds>{Math.floor(progressState / ProgressMultiplier)}</RunTimeSeconds>
                        </XStack>

                        <XStack flex={1} justifyContent="space-between">
                            { /** Track metadata can go here */}
                            { nowPlaying!.item.MediaSources && (
                                <>
                                <Text>{toUpper(nowPlaying!.item.MediaSources[0].Container ?? "")}</Text>
                                <Text>{nowPlaying!.item.MediaSources[0].Bitrate?.toString() ?? ""}</Text>
                                </>
                            )}
                        </XStack>

                        <XStack flex={1} justifyContent="flex-end">
                            <RunTimeSeconds>
                                {
                                    progress && progress.duration
                                    ? Math.ceil(progress.duration) 
                                    : 0
                                }
                            </RunTimeSeconds>
                        </XStack>
                    </XStack>

                    <XStack 
                        alignItems="center" 
                        justifyContent="space-evenly" 
                        marginVertical={"$2"}
                    >
                        <Icon
                            color={getTokens().color.amethyst.val}
                            name="rewind-15"
                            onPress={() => {

                                setSeeking(true);
                                setProgressState(progressState - (15 * ProgressMultiplier));
                                setSeeking(false);
                                useSeekTo.mutate(progress!.position - 15);
                            }}
                        />
                        
                        <Icon
                            color={getTokens().color.amethyst.val}
                            name="skip-previous"
                            onPress={() => usePrevious.mutate()}
                            large
                        />

                        {/* I really wanted a big clunky play button */}
                        <PlayPauseButton size={width / 5} />

                        <Icon
                            color={getTokens().color.amethyst.val}
                            name="skip-next" 
                            onPress={() => useSkip.mutate(undefined)}
                            large
                        />    

                        <Icon
                            color={getTokens().color.amethyst.val}
                            name="fast-forward-15"
                            onPress={() => { 
                                setSeeking(true);
                                setProgressState(progressState + (15 * ProgressMultiplier));
                                setSeeking(false);
                                useSeekTo.mutate(progress!.position + 15);
                            }}  
                        />              
                    </XStack>

                    <XStack justifyContent="space-evenly" marginVertical={"$7"}>
                        <Icon name="speaker-multiple"
                        />

                        <Spacer />

                        <Icon
                            name="playlist-music"
                            onPress={() => {
                                navigation.navigate("Queue");
                            }}
                        />
                    </XStack>
                </YStack>
            </>
            )}
        </SafeAreaView>
    );
}