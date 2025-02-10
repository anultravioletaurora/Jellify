import { usePlayerContext } from "../../../player/provider";
import { useItem } from "../../../api/queries/item";
import { StackParamList } from "../../../components/types";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getTokens, ListItem, Separator, Spacer, Spinner, XStack, YGroup, YStack } from "tamagui";
import { QueuingType } from "../../../enums/queuing-type";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import IconButton from "../../../components/Global/helpers/icon-button";
import { Text } from "../../../components/Global/helpers/text";
import { useUserPlaylists } from "../../../api/queries/playlist";
import React from "react";
import BlurhashedImage from "../../../components/Global/components/blurhashed-image";
import { useMutation } from "@tanstack/react-query";
import { AddToPlaylistMutation } from "../types";
import { addToPlaylist } from "../../../api/mutations/functions/playlists";
import { trigger } from "react-native-haptic-feedback";
import { queryClient } from "../../../constants/query-client";
import { QueryKeys } from "../../../enums/query-keys";

interface TrackOptionsProps {
    track: BaseItemDto;
    navigation: NativeStackNavigationProp<StackParamList>;
    
    /**
     * Whether this is nested in the player modal
     */
    isNested: boolean | undefined;
}

export default function TrackOptions({ 
    track, 
    navigation,
    isNested
} : TrackOptionsProps) : React.JSX.Element {

    const { data: album, isSuccess: albumFetchSuccess } = useItem(track.AlbumId ?? "");

    const { data: playlists, isPending : playlistsFetchPending, isSuccess: playlistsFetchSuccess } = useUserPlaylists();

    const { useAddToQueue } = usePlayerContext();

    const { width } = useSafeAreaFrame();
    
    return (
        <YStack width={width}>

            <XStack justifyContent="space-evenly">
                { albumFetchSuccess ? (
                    <IconButton 
                        name="music-box"
                        title="Go to Album"
                        onPress={() => {
                            
                            if (isNested)
                                navigation.getParent()!.goBack();
                            
                            navigation.goBack();
                            navigation.navigate("Album", {
                                album
                            });
                        }}
                        size={width / 6}
                    />
                ) : (
                    <Spacer />
                )}

                <IconButton
                    circular
                    name="table-column-plus-before" 
                    title="Play Next"
                    onPress={() => {
                        useAddToQueue.mutate({
                            track: track,
                            queuingType: QueuingType.PlayingNext
                        })
                    }}
                    size={width / 6}
                />

                <IconButton
                    circular
                    name="table-column-plus-after" 
                    title="Queue"
                    onPress={() => {
                        useAddToQueue.mutate({
                            track: track
                        })
                    }}
                    size={width / 6}
                />
            </XStack>

            <Spacer />

            { playlistsFetchPending && (
                <Spinner />
            )}

            { playlistsFetchSuccess && (
                <>
                    <Text 
                        bold 
                        fontSize={"$6"}
                    >
                        Add to Playlist
                    </Text>

                    <YGroup separator={(<Separator />)}>
                        { playlists.map(playlist => {

                            const useAddToPlaylist = useMutation({
                                mutationFn: ({ track, playlist }: AddToPlaylistMutation) => {
                                    return addToPlaylist(track, playlist)
                                },
                                onSuccess: (data, { playlist }) => {
                                    trigger("notificationSuccess")

                                    queryClient.invalidateQueries({
                                        queryKey: [QueryKeys.ItemTracks, playlist.Id!, false],
                                        exact: true
                                    });
                                },
                                onError: () => {
                                    trigger("notificationError")
                                }
                            })

                            return (
                                <YGroup.Item>
                                    <ListItem hoverTheme onPress={() => {
                                        useAddToPlaylist.mutate({
                                            track,
                                            playlist
                                        })
                                    }}>
                                        <XStack alignItems="center">
                                            <YStack flex={1}>

                                                <BlurhashedImage
                                                    cornered
                                                    item={playlist}
                                                    width={width / 6}
                                                    />
                                            </YStack>

                                            <YStack 
                                                alignItems="flex-start"
                                                flex={4} 
                                            >
                                                <Text bold fontSize={"$6"}>{playlist.Name ?? "Untitled Playlist"}</Text>

                                                <Text color={getTokens().color.amethyst}>{`${playlist.ChildCount ?? 0} tracks`}</Text>
                                            </YStack>
                                        </XStack>
                                    </ListItem>
                                </YGroup.Item>
                            )
                        })}
                    </YGroup>
                </>
            )}

        </YStack>
    )
}