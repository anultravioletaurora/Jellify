import React, { useEffect } from "react";
import { View } from "tamagui";
import { useHomeContext } from "../provider";
import { H2 } from "../../Global/helpers/text";
import { ProvidedHomeProps } from "../../types";
import { FlatList } from "react-native";
import { Card } from "../../Global/helpers/card";
import { getPrimaryBlurhashFromDto } from "../../../helpers/blurhash";

export default function RecentArtists({ navigation }: ProvidedHomeProps): React.JSX.Element {

    const { recentArtists } = useHomeContext();

    return (
        <View>
            <H2 marginLeft={"$2"}>Recent Artists</H2>
            <FlatList horizontal
                data={recentArtists}   
                renderItem={({ item: recentArtist}) => {
                    return (
                        <Card 
                            artistName={recentArtist.Name!}
                            blurhash={getPrimaryBlurhashFromDto(recentArtist)}
                            itemId={recentArtist.Id!}
                            caption={recentArtist.Name ?? "Unknown Artist"}
                            onPress={() => {
                                navigation.navigate('Artist', 
                                    { 
                                        artistId: recentArtist.Id!, 
                                        artistName: recentArtist.Name ?? "Unknown Artist" 
                                    }
                                )}
                            }>
                        </Card>
                    )
                }}
            />
        </View>
    )
}