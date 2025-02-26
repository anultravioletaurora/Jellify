import React, { useEffect, useMemo, useState } from "react";
import { useProgress } from "react-native-track-player";
import { HorizontalSlider } from "../../../components/Global/helpers/slider";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { trigger } from "react-native-haptic-feedback";
import { getToken, XStack, YStack } from "tamagui";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { usePlayerContext } from "../../../player/provider";
import { RunTimeSeconds } from "../../../components/Global/helpers/time-codes";
import { UPDATE_INTERVAL } from "../../../player/config";
import { ProgressMultiplier } from "../component.config";
import Icon from "../../../components/Global/helpers/icon";
import PlayPauseButton from "./buttons";

const scrubGesture = Gesture.Pan();

export default function Scrubber() : React.JSX.Element {

    const { 
        playbackState,
        useSeekTo, 
        useSkip, 
        usePrevious, 
    } = usePlayerContext();
    

    const { width } = useSafeAreaFrame();

    const progress = useProgress(UPDATE_INTERVAL);

    const [seeking, setSeeking] = useState<boolean>(false);
    
    const [position, setPosition] = useState<number>(progress && progress.position ? 
        Math.floor(progress.position * ProgressMultiplier)
        : 0
    );

    useEffect(() => {
        if (!seeking && progress.position)
            setPosition(
                Math.floor(
                    progress.position * ProgressMultiplier
                )
            );
    }, [
        progress.position
    ]);

    return (
        <YStack>
            { useMemo(() => (
                <>
                <GestureDetector gesture={scrubGesture}>
                    <HorizontalSlider 
                        value={position}
                        max={
                            progress && progress.duration > 0 
                            ? progress.duration * ProgressMultiplier
                            : 1
                        }
                        width={width / 1.125}
                        props={{
                            // If user swipes off of the slider we should seek to the spot
                            onPressOut: (event) => {
                                trigger("notificationSuccess")
                                useSeekTo.mutate(Math.floor(position / ProgressMultiplier));
                                setSeeking(false);
                            },
                            onSlideStart: (event, value) => {
                                trigger("impactLight");
                                setSeeking(true);
                                setPosition(value)
                            },
                            onSlideMove: (event, value) => {
                                trigger("clockTick")
                                setSeeking(true);
                                setPosition(value);
                            },
                            onSlideEnd: (event, value) => {
                                trigger("notificationSuccess")
                                setPosition(value)
                                useSeekTo.mutate(Math.floor(value / ProgressMultiplier));
                                setSeeking(false);
                            }
                        }}
                        />
                </GestureDetector>

                <XStack margin={"$2"} marginTop={"$3"}>
                    <YStack flex={1} alignItems="flex-start">
                        <RunTimeSeconds>{Math.floor(position / ProgressMultiplier)}</RunTimeSeconds>
                    </YStack>

                    <YStack flex={1} alignItems="center">
                        { /** Track metadata can go here */}
                    </YStack>

                    <YStack flex={1} alignItems="flex-end">
                        <RunTimeSeconds>
                            {
                                progress && progress.duration
                                ? Math.ceil(progress.duration) 
                                : 0
                            }
                        </RunTimeSeconds>
                    </YStack>
                </XStack>
            </>
            ), [
                position,
                seeking
            ])}

            { useMemo(() => (

                <XStack 
                    alignItems="center" 
                    justifyContent="space-evenly" 
                    marginVertical={"$2"}
                    >
                    <Icon
                        color={getToken("$color.amethyst")}
                        name="rewind-15"
                        onPress={() => {
                            useSeekTo.mutate(progress!.position - 15);
                        }}
                        />
                    
                    <Icon
                        color={getToken("$color.amethyst")}
                        name="skip-previous"
                        onPress={() => {
                            
                            console.debug(`Skipping at ${position}`)
                            if (position / ProgressMultiplier < 3)
                                usePrevious.mutate()
                            else {
                                useSeekTo.mutate(0);
                            }
                        }}
                        large
                        />

                    {/* I really wanted a big clunky play button */}
                    <PlayPauseButton size={width / 5} />

                    <Icon
                        color={getToken("$color.amethyst")}
                        name="skip-next" 
                        onPress={() => useSkip.mutate(undefined)}
                        large
                        />    

                    <Icon
                        color={getToken("$color.amethyst")}
                        name="fast-forward-15"
                        onPress={() => { 
                            useSeekTo.mutate(progress!.position + 15);
                        }}  
                        />              
                </XStack>
            ), [
                playbackState
            ])}
        </YStack>
    )
}