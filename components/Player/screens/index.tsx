import { queryConfig } from "@/api/queries/query.config";
import { HorizontalSlider } from "@/components/Global/helpers/slider";
import { RunTimeSeconds } from "@/components/Global/helpers/time-codes";
import { useApiClientContext } from "@/components/jellyfin-api-provider";
import { StackParamList } from "@/components/types";
import { usePlayerContext } from "@/player/provider";
import { CachedImage } from "@georstat/react-native-image-cache";
import { ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import { SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context";
import { YStack, XStack, Spacer } from "tamagui";
import PlayPauseButton from "../helpers/buttons";
import { H5, Text } from "@/components/Global/helpers/text";
import Icon from "@/components/Global/helpers/icon";
import { Colors } from "@/enums/colors";
import { State } from "react-native-track-player";

export default function PlayerScreen({ navigation }: { navigation: NativeStackNavigationProp<StackParamList>}): React.JSX.Element {

    
    const { apiClient } = useApiClientContext();
    const { playbackState, nowPlaying, progress, useSeekTo, useSkip, usePrevious, queueName } = usePlayerContext();
    
    const [seeking, setSeeking] = useState<boolean>(false);
    const [progressState, setProgressState] = useState<number>(progress!.position);

    const { width, height } = useSafeAreaFrame();

    // Prevent gesture event to close player if we're seeking
    useEffect(() => {
        navigation.setOptions({ gestureEnabled: !seeking });
    }, [
        navigation,
        seeking
    ])

    useEffect(() => {
        if (!seeking)
            setProgressState(Math.floor(progress!.position))
    }, [
        progress
    ]);

    return (
        <SafeAreaView edges={["right", "left"]}>
            { nowPlaying && (
            <>
                <YStack>

                    <YStack alignItems="center">
                        <Text>Playing from</Text>
                        <H5>{ queueName ?? "Queue"}</H5>
                    </YStack>

                    <XStack 
                        animation={"quick"} 
                        justifyContent="center"
                        minHeight={width / 1.1}
                    >
                        <CachedImage
                            source={getImageApi(apiClient!)
                                .getItemImageUrlById(
                                    nowPlaying!.AlbumId,
                                    ImageType.Primary,
                                    { ...queryConfig.playerArtwork }
                                )
                            }
                            imageStyle={{
                                position: "relative",
                                alignSelf: "center",
                                width: playbackState === State.Playing ? width / 1.1 : width / 1.4,
                                height: playbackState === State.Playing ? width / 1.1 : width / 1.4,
                                borderRadius: 2
                            }}
                            />
                    </XStack>

                    <XStack marginHorizontal={20} paddingVertical={5}>
                        <YStack justifyContent="flex-start" flex={4}>
                            <Text 
                                bold 
                                fontSize={"$6"}
                            >
                                {nowPlaying?.title ?? "Untitled Track"}
                            </Text>

                            <Text 
                                fontSize={"$6"}
                                color={Colors.Primary}
                                onPress={() => {
                                    navigation.goBack(); // Dismiss player modal
                                    navigation.push("Artist", {
                                        artistName: nowPlaying!.item.ArtistItems![0].Name ?? "Untitled",
                                        artistId: nowPlaying!.item.ArtistItems![0].Id!,
                                    })
                                }}
                            >
                                {nowPlaying.artist ?? "Unknown Artist"}
                            </Text>

                            <Text 
                                fontSize={"$6"} 
                                color={"$gray10"}
                            >
                                { nowPlaying!.album ?? "" }
                            </Text>
                        </YStack>

                        <XStack alignItems="center" flex={1}>
                            {/* Buttons for favorites, song menu go here */}

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
                                onPressOut: (event) => {
                                    useSeekTo.mutate(progressState);
                                    setSeeking(false);
                                },
                                onSlideStart: (event, value) => {
                                    setSeeking(true);
                                },
                                onSlideMove: (event, value) => {
                                    setProgressState(value);
                                },
                                onSlideEnd: (event, value) => {
                                    const position = value;

                                    useSeekTo.mutate(position);
                                    setSeeking(false);
                                }
                            }}
                            />

                    </XStack>

                    <XStack marginHorizontal={20} marginTop={"$4"} marginBottom={"$5"}>
                        <XStack flex={1} justifyContent="flex-start">
                            <RunTimeSeconds>{progressState}</RunTimeSeconds>
                        </XStack>

                        <XStack flex={1} justifyContent="center">
                            { /** Track metadata can go here */}
                        </XStack>

                        <XStack flex={1} justifyContent="flex-end">
                            <RunTimeSeconds>{progress!.duration}</RunTimeSeconds>
                        </XStack>
                    </XStack>

                    <XStack justifyContent="space-evenly" marginVertical={"$3"}>
                        <Icon
                            name="rewind-15"
                            onPress={() => useSeekTo.mutate(progress!.position - 15)}
                        />
                        
                        <Icon
                            large
                            name="skip-previous"
                            onPress={() => usePrevious.mutate()}
                        />

                        <PlayPauseButton />

                        <Icon 
                            large
                            name="skip-next" 
                            onPress={() => useSkip.mutate(undefined)}
                        />    

                        <Icon
                            name="fast-forward-15"
                            onPress={() => useSeekTo.mutate(progress!.position + 15)}  
                        />              
                    </XStack>

                    <XStack justifyContent="space-evenly" marginVertical={"$7"}>
                        <Icon
                            name="speaker-multiple"
                        />

                        <Spacer />

                        <Icon
                            name="arrow-down-drop-circle"
                            onPress={() => {
                                navigation.goBack();
                            }}
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