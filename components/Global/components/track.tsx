import { usePlayerContext } from "@/player/provider";
import React from "react";
import { Separator, View, XStack, YStack } from "tamagui";
import { Text } from "../helpers/text";
import { RunTimeTicks } from "../helpers/time-codes";
import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { Colors } from "@/enums/colors";
import { CachedImage } from "@georstat/react-native-image-cache";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api/image-api";
import { useApiClientContext } from "@/components/jellyfin-api-provider";
import { queryConfig } from "@/api/queries/query.config";
import { useSafeAreaFrame } from "react-native-safe-area-context";

interface TrackProps {
    track: BaseItemDto;
    tracklist: BaseItemDto[];
    index: number;
    showArtwork?: boolean | undefined;
    onPress?: () => void | undefined
}

export default function Track({
    track,
    tracklist,
    index,
    queueName,
    showArtwork,
    onPress
} : {
    track: BaseItemDto,
    tracklist: BaseItemDto[],
    index: number,
    queueName?: string | undefined,
    showArtwork?: boolean | undefined,
    onPress?: () => void | undefined
}) : React.JSX.Element {

    const { width } = useSafeAreaFrame();
    const { apiClient } = useApiClientContext();
    const { nowPlaying, usePlayNewQueue } = usePlayerContext();

    const isPlaying = nowPlaying?.item.Id === track.Id;

    return (
        <View>
            <Separator />
            <XStack 
                alignContent="center"
                flex={1}
                onPress={() => {
                    if (onPress) {
                        onPress();
                    } else {
                        usePlayNewQueue.mutate({
                            track,
                            index,
                            tracklist,
                            queueName: queueName ? queueName : track.Album ? track.Album! : "Queue"
                        });
                    }
                }}
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
                        <CachedImage
                            source={getImageApi(apiClient!)
                                .getItemImageUrlById(
                                    track.AlbumId ?? "",
                                    ImageType.Primary,
                                    { ...queryConfig.images }
                                )
                            }
                            imageStyle={{
                                position: "relative",
                                width: width / 9,
                                height: width / 9,
                                borderRadius: 2,
                            }}
                        />
                
                    ) : (
                    <Text color={isPlaying ? Colors.Primary : Colors.White}>
                        { track.IndexNumber?.toString() ?? "" }
                    </Text>
                )}
                </XStack>

                <YStack alignContent="center" justifyContent="flex-start" flex={6}>
                    <Text 
                        bold
                        color={isPlaying ? Colors.Primary : Colors.White}
                        lineBreakStrategyIOS="standard"
                        numberOfLines={1}
                    >
                        { track.Name ?? "Untitled Track" }
                    </Text>

                    { (showArtwork || (track.ArtistCount ?? 0 > 1)) && (
                        <Text lineBreakStrategyIOS="standard" numberOfLines={1}>{ track.Artists?.join(", ") ?? "" }</Text>
                    )}
                </YStack>

                <XStack alignContent="center" flex={1}>
                    <RunTimeTicks>{ track.RunTimeTicks }</RunTimeTicks>
                </XStack>
            </XStack>
        </View>
    )
}