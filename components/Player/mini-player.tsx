import React, {  } from "react";
import { XStack, YStack } from "tamagui";
import { usePlayerContext } from "../../player/provider";
import { BottomTabNavigationEventMap } from "@react-navigation/bottom-tabs";
import { NavigationHelpers, ParamListBase } from "@react-navigation/native";
import { BlurView } from "@react-native-community/blur";
import Icon from "../Global/helpers/icon";
import { Text } from "../Global/helpers/text";
import { Colors } from "../../enums/colors";
import { CachedImage } from "@georstat/react-native-image-cache";
import { ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api";
import { queryConfig } from "../../api/queries/query.config";
import { useApiClientContext } from "../jellyfin-api-provider";
import TextTicker from 'react-native-text-ticker';
import PlayPauseButton from "./helpers/buttons";
import { useSafeAreaFrame } from "react-native-safe-area-context";

export function Miniplayer({ navigation }: { navigation : NavigationHelpers<ParamListBase, BottomTabNavigationEventMap> }) : React.JSX.Element {

    const { nowPlaying, useSkip } = usePlayerContext();

    const { apiClient } = useApiClientContext();

    const { width } = useSafeAreaFrame();

    return (
        <BlurView overlayColor={Colors.Background}>
            { nowPlaying && (

                <XStack 
                    alignItems="center"
                    margin={0}
                    padding={0}
                    height={"$6"} 
                    onPress={() => navigation.navigate("Player")}
                >
                    <YStack
                        alignContent="center"
                        flex={1}>
                        <CachedImage
                            source={getImageApi(apiClient!)
                                .getItemImageUrlById(
                                    nowPlaying!.AlbumId,
                                    ImageType.Primary,
                                    { ...queryConfig.images }
                                )
                            }
                            imageStyle={{
                                position: "relative",
                                width: width / 7,
                                height: width / 7,
                                borderRadius: 2,
                            }}
                        />

                    </YStack>


                    <YStack alignContent="flex-start" flex={4} maxWidth={"$20"}>
                        <TextTicker 
                            duration={5000}
                            loop
                            repeatSpacer={20} 
                            marqueeDelay={1000}
                        >
                            <Text bold>{nowPlaying?.title ?? "Nothing Playing"}</Text>
                        </TextTicker>

                        <TextTicker 
                            duration={5000}
                            loop
                            repeatSpacer={20}
                            marqueeDelay={1000} 
                        >
                            <Text color={Colors.Primary}>{nowPlaying?.artist ?? ""}</Text>
                        </TextTicker>
                    </YStack>
                    
                    <XStack 
                        justifyContent="flex-end" 
                        flex={2}
                    >
                        <PlayPauseButton />

                        <Icon 
                            large
                            name="skip-next" 
                            onPress={() => useSkip.mutate(undefined)}
                            />
                    </XStack>
                </XStack>
            )}
        </BlurView>
    )
}