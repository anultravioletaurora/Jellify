import { ScrollView, useWindowDimensions } from "tamagui";
import { useArtistAlbums } from "../../api/queries/artist";
import { useApiClientContext } from "../jellyfin-api-provider";
import { FlatList } from "react-native";
import { Card } from "../Global/helpers/card";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../types";
import { H2 } from "../Global/helpers/text";
import { useState } from "react";
import { CachedImage } from "@georstat/react-native-image-cache";
import { ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { queryConfig } from "@/api/queries/query.config";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api";
import { SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context";

interface ArtistProps {
    artistId: string,
    artistName: string,
    navigation: NativeStackNavigationProp<StackParamList>
}

export default function Artist(props: ArtistProps): React.JSX.Element {

    const [columns, setColumns] = useState<number>(2);

    const { apiClient } = useApiClientContext();

    const { width } = useSafeAreaFrame();

    const { data: albums } = useArtistAlbums(props.artistId, apiClient!);

    return (
        <SafeAreaView edges={["top", "right", "left"]}>
            <ScrollView 
                contentInsetAdjustmentBehavior="automatic"
                alignContent="center">
                <CachedImage
                    source={getImageApi(apiClient!)
                        .getItemImageUrlById(
                            props.artistId,
                            ImageType.Primary,
                            { ...queryConfig.banners})
                        } 
                    imageStyle={{
                        width: 500,
                        height: 350,
                        resizeMode: "cover",
                        position: "relative"
                    }}
                />

                <H2>Albums</H2>
                <FlatList
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        alignItems: "center"
                    }}
                    data={albums}
                    numColumns={columns} // TODO: Make this adjustable
                    renderItem={({ item: album }) => {
                        return (
                            <Card
                                caption={album.Name}
                                subCaption={album.ProductionYear?.toString()}
                                width={(width / 1.1) / columns}
                                cornered 
                                itemId={album.Id!}
                                onPress={() => {
                                    props.navigation.navigate('Album', {
                                        album
                                    })
                                }}
                            />
                        )
                    }}
                />
            </ScrollView>
        </SafeAreaView>
    )
}