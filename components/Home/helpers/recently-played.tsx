import React from "react";
import { ScrollView, View } from "tamagui";
import { useHomeContext } from "../provider";
import { H2 } from "../../Global/helpers/text";
import { Card } from "../../Global/helpers/card";
import { useApiClientContext } from "../../jellyfin-api-provider";
import { usePlayerContext } from "../../../player/provider";

export default function RecentlyPlayed(): React.JSX.Element {

    const { usePlayNewQueue } = usePlayerContext();
    const { apiClient, sessionId } = useApiClientContext();
    const { recentTracks } = useHomeContext();

    return (
        <View>
            <H2 marginLeft={"$2"}>Play it again</H2>
            <ScrollView horizontal>
                { recentTracks && recentTracks.map((recentlyPlayedTrack, index) => {
                    return (
                        <Card
                            caption={recentlyPlayedTrack.Name}
                            subCaption={`${recentlyPlayedTrack.Artists?.join(", ")}`}
                            cornered
                            width={150}
                            itemId={recentlyPlayedTrack.AlbumId!}
                            onPress={() => {
                                usePlayNewQueue.mutate({ 
                                    track: recentlyPlayedTrack, 
                                    index: index,
                                    tracklist: recentTracks,
                                    queueName: "Recently Played"
                                });
                            }}
                        />                                
                    )
                })}
            </ScrollView>
        </View>
    )
}