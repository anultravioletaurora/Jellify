import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { StackParamList } from "../types";
import TrackOptions from "./helpers/TrackOptions";
import { getTokens, ScrollView, Spacer, View, XStack, YStack } from "tamagui";
import BlurhashedImage from "../Global/components/blurhashed-image";
import { Text } from "../Global/helpers/text";
import FavoriteButton from "../Global/components/favorite-button";
import { useEffect } from "react";
import { trigger } from "react-native-haptic-feedback";

export default function ItemDetail({ 
    item, 
    navigation,
    isNested
} : { 
    item: BaseItemDto, 
    navigation: NativeStackNavigationProp<StackParamList>,
    isNested?: boolean | undefined
}) : React.JSX.Element {

    let options: React.JSX.Element | undefined = undefined;

    useEffect(() => {
        trigger("impactMedium");
    }, [
        item
    ]);

    const { width } = useSafeAreaFrame();

    switch (item.Type) {
        case "Audio": {
            options = TrackOptions({ item, navigation, isNested });
            break;
        }

        case "MusicAlbum" : {

            break;
        }

        case "MusicArtist" : {

            break;
        }

        case "Playlist" : {

            break;
        }

        default : {
            break;
        }
    }

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <YStack alignItems="center" flex={1}>

                <XStack 
                    justifyContent="center"
                    alignItems="center"
                    maxHeight={width / 1.5}
                    maxWidth={width / 1.5}
                >

                    <BlurhashedImage
                        item={item}
                        width={width / 1.5}
                        />
                </XStack>

                <YStack 
                    marginLeft={"$0.5"} 
                    alignContent="center"
                    justifyContent="center"
                    flex={2}
                >
                    <Text textAlign="center" bold fontSize={"$6"}>
                        { item.Name ?? "Untitled Track" }
                    </Text>

                    <Text 
                        textAlign="center"
                        fontSize={"$6"} 
                        color={getTokens().color.telemagenta}
                        onPress={() => {
                            if (item.ArtistItems) {

                                if (isNested)
                                    navigation.getParent()!.goBack();

                                navigation.goBack();
                                navigation.push("Artist", {
                                    artist: item.ArtistItems[0]
                                });
                            }
                        }}>
                        { item.Artists?.join(", ") ?? "Unknown Artist"}
                    </Text>
                        
                    <Text 
                        textAlign="center"
                        fontSize={"$6"} 
                        color={"$borderColor"}
                    >
                        { item.Album ?? "" }
                    </Text>

                    <Spacer />

                    <FavoriteButton item={item} />
                    
                    <Spacer />
                    
                    { options ?? <View /> }
                </YStack>

            </YStack>
        </ScrollView>
    )
}