import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../types";
import { ScrollView, XStack, YStack } from "tamagui";
import { useApiClientContext } from "../jellyfin-api-provider";
import { usePlayerContext } from "@/player/provider";
import { useItemTracks } from "@/api/queries/tracks";
import { RunTimeTicks } from "../Global/helpers/time-codes";
import { H4, H5, Text } from "../Global/helpers/text";
import Track from "../Global/components/track";
import { FlatList } from "react-native";
import { queryConfig } from "@/api/queries/query.config";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api/image-api";
import { CachedImage } from "@georstat/react-native-image-cache";
import { SafeAreaView } from "react-native-safe-area-context";

interface PlaylistProps { 
    playlist: BaseItemDto;
    navigation: NativeStackNavigationProp<StackParamList>
}

export default function Playlist(props: PlaylistProps): React.JSX.Element {

    const { apiClient, sessionId } = useApiClientContext();

    const { nowPlaying } = usePlayerContext();

    const { data: tracks, isLoading } = useItemTracks(props.playlist.Id!, apiClient!);

    return (
        <SafeAreaView edges={["right", "left"]}>
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <YStack alignItems="center">
                    <CachedImage
                        source={getImageApi(apiClient!)
                            .getItemImageUrlById(
                                props.playlist.Id!,
                                ImageType.Primary,
                                { ...queryConfig.images})}
                        imageStyle={{
                            position: "relative",
                            width: 300,
                            height: 300,
                            borderRadius: 2
                        }}
                    />

                    <H4>{ props.playlist.Name ?? "Untitled Playlist" }</H4>
                    <H5>{ props.playlist.ProductionYear?.toString() ?? "" }</H5>
                </YStack>
                <FlatList
                    data={tracks}
                    extraData={nowPlaying}
                    numColumns={1}
                    renderItem={({ item: track, index }) => {

                        return (
                            <Track
                                track={track}
                                tracklist={tracks!}
                                index={index}
                                queueName={props.playlist.Name ?? "Untitled Playlist"}
                                showArtwork
                            />
                        )

                }}/>

                <XStack justifyContent="flex-end">
                    <Text 
                        color={"$gray10"} 
                        style={{ display: "block"}}
                    >
                        Total Runtime:
                    </Text>
                    <RunTimeTicks>{ props.playlist.RunTimeTicks }</RunTimeTicks>
                </XStack>
            </ScrollView>
        </SafeAreaView>
    )
}