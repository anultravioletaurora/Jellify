import { HorizontalSlider } from "../../../components/Global/helpers/slider";
import { RunTimeSeconds } from "../../../components/Global/helpers/time-codes";
import { StackParamList } from "../../../components/types";
import { usePlayerContext } from "../../../player/provider";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import { SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context";
import { YStack, XStack, Spacer, getTokens } from "tamagui";
import PlayPauseButton from "../helpers/buttons";
import { H5, Text } from "../../../components/Global/helpers/text";
import Icon from "../../../components/Global/helpers/icon";
import FavoriteButton from "../../Global/components/favorite-button";
import BlurhashedImage from "../../Global/components/blurhashed-image";
import TextTicker from "react-native-text-ticker";
import { TextTickerConfig } from "../component.config";
import IconButton from "../../../components/Global/helpers/icon-button";
import { toUpper } from "lodash";

export default function PlayerScreen({ navigation }: { navigation: NativeStackNavigationProp<StackParamList>}): React.JSX.Element {

    const { 
        useTogglePlayback, 
        nowPlayingIsFavorite,
        setNowPlayingIsFavorite,
        nowPlaying, 
        progress, 
        useSeekTo, 
        useSkip, 
        usePrevious, 
        queueName,
    } = usePlayerContext();
    
    const [seeking, setSeeking] = useState<boolean>(false);
    const [progressState, setProgressState] = useState<number>(progress!.position);

    const { width } = useSafeAreaFrame();

    // Prevent gesture event to close player if we're seeking
    useEffect(() => {
        navigation.getParent()!.setOptions({ gestureEnabled: !seeking });
    }, [
        navigation,
        seeking
    ])

    useEffect(() => {
        if (!seeking)
            setProgressState(Math.round(progress!.position))
    }, [
        progress
    ]);

    return (
        <SafeAreaView edges={["right", "left"]}>
            { nowPlaying && (
            <>
                <YStack>

                    <YStack 
                        alignItems="center"
                        alignContent="center"
                    >
                        <Text>Playing from</Text>
                        <TextTicker {...TextTickerConfig}>
                            <Text bold>{ queueName ?? "Queue"}</Text>
                        </TextTicker>
                    </YStack>

                    <XStack 
                        justifyContent="center"
                        alignContent="center"
                        minHeight={width / 1.1}
                        onPress={() => {
                            useTogglePlayback.mutate(undefined)
                        }}
                    >
                        <BlurhashedImage
                            item={nowPlaying!.item}
                            width={width / 1.1}
                            />
                    </XStack>

                    <XStack marginHorizontal={20} paddingVertical={5}>
                        <YStack justifyContent="flex-start" flex={4}>
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
                                            navigation.navigate("Artist", {
                                                artist: nowPlaying!.item.ArtistItems![0],
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

                    <XStack justifyContent="center" marginTop={"$5"}>
                        {/* playback progress goes here */}
                        <HorizontalSlider 
                            value={progressState}
                            max={progress!.duration}
                            width={width / 1.1}
                            props={{
                                // If user swipes off of the slider we should seek to the spot
                                onPressOut: () => {
                                    setSeeking(false);
                                    useSeekTo.mutate(progressState);
                                },
                                onSlideStart: () => {
                                    setSeeking(true);
                                },
                                onSlideMove: (event, value) => {
                                    setSeeking(true);
                                    setProgressState(value);
                                },
                                onSlideEnd: (event, value) => {
                                    setSeeking(false);
                                    useSeekTo.mutate(value);
                                }
                            }}
                            />

                    </XStack>

                    <XStack marginHorizontal={20} marginTop={"$4"} marginBottom={"$3"}>
                        <XStack flex={1} justifyContent="flex-start">
                            <RunTimeSeconds>{progressState}</RunTimeSeconds>
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
                            <RunTimeSeconds>{progress!.duration}</RunTimeSeconds>
                        </XStack>
                    </XStack>

                    <XStack 
                        alignItems="center" 
                        justifyContent="space-evenly" 
                        marginVertical={"$3"}
                    >
                        <IconButton
                            circular
                            name="rewind-15"
                            onPress={() => {

                                setSeeking(true);
                                setProgressState(progressState - 15);
                                useSeekTo.mutate(progress!.position - 15);
                                setSeeking(false);
                            }}
                            size={width / 7}
                        />
                        
                        <IconButton
                            circular
                            name="skip-previous"
                            onPress={() => usePrevious.mutate()}
                            size={width / 7}
                        />

                        {/* I really wanted a big clunky play button */}
                        <PlayPauseButton size={width / 5} />

                        <IconButton
                            circular
                            name="skip-next" 
                            onPress={() => useSkip.mutate(undefined)}
                            size={width / 7}
                        />    

                        <IconButton
                            circular
                            name="fast-forward-15"
                            onPress={() => { 
                                setSeeking(true);
                                setProgressState(progressState + 15);
                                useSeekTo.mutate(progress!.position + 15);
                                setSeeking(false);
                            }}  
                            size={width / 7}
                        />              
                    </XStack>

                    <XStack justifyContent="space-evenly" marginVertical={"$7"}>
                        <Icon
                            name="speaker-multiple"
                            large
                        />

                        <Spacer />

                        <Icon
                            name="arrow-down-drop-circle"
                            onPress={() => {
                                navigation.goBack();
                            }}
                            large
                        />

                        <Spacer />


                        <Icon
                            name="playlist-music"
                            onPress={() => {
                                navigation.navigate("Queue");
                            }}
                            large
                        />
                    </XStack>
                </YStack>
            </>
            )}
        </SafeAreaView>
    );
}