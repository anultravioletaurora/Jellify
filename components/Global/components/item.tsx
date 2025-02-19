import { usePlayerContext } from "../../../player/provider";
import { StackParamList } from "../../../components/types";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getTokens, Separator, Spacer, View, XStack, YStack } from "tamagui";
import { Text } from "../helpers/text";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import BlurhashedImage from "./blurhashed-image";
import Icon from "../helpers/icon";
import { QueuingType } from "../../../enums/queuing-type";
import { RunTimeTicks } from "../helpers/time-codes";

export default function Item({ 
    item,
    queueName,
    navigation,
} : {
    item: BaseItemDto,
    queueName: string,
    navigation: NativeStackNavigationProp<StackParamList>
}) : React.JSX.Element {

    const { usePlayNewQueue } = usePlayerContext();

    const { width } = useSafeAreaFrame();

    return (
        <View flex={1}>
            <Separator />

            <XStack
                alignContent="center"
                flex={1}
                minHeight={width / 9}
                onPress={() => {
                    switch (item.Type) {
                        case ("MusicArtist") : {
                            navigation.navigate("Artist", {
                                artist: item
                            })
                            break;
                        }

                        case ("MusicAlbum") : {
                            navigation.navigate("Album", {
                                album: item
                            })
                            break;
                        }

                        case ("Audio") : {
                            usePlayNewQueue.mutate({
                                track: item,
                                tracklist: [item],
                                queue: "Search",
                                queuingType: QueuingType.FromSelection
                            })
                            break;
                        }
                    }

                }}
                onLongPress={() => {
                    navigation.navigate("Details", {
                        item,
                        isNested: false
                    })
                }}
                paddingVertical={"$2"}
                marginHorizontal={"$1"}
            >
                <BlurhashedImage item={item} width={width / 9} borderRadius={item.Type === 'MusicArtist' ? width / 9 : 2}/>

                <YStack 
                    marginLeft={"$1"}
                    alignContent="center"
                    justifyContent="flex-start"
                    flex={3}
                >
                    <Text 
                        bold
                        lineBreakStrategyIOS="standard"
                        numberOfLines={1}
                    >
                        { item.Name ?? ""}
                    </Text>
                    { (item.Type === 'Audio' || item.Type === 'MusicAlbum') && (
                        <Text
                            lineBreakStrategyIOS="standard"
                            numberOfLines={1}
                        >
                            { item.AlbumArtist ?? "Untitled Artist" }
                        </Text>
                    )}
                </YStack>



                <XStack 
                    justifyContent="space-between"
                    alignItems="center" 
                    flex={1}
                >
                    { item.UserData?.IsFavorite ? (
                        <Icon 
                            small
                            color={getTokens().color.telemagenta.val}
                            name="heart"
                        />
                    ) : (
                        <Spacer />
                    )}
                    {/* Runtime ticks for Songs */}
                    { item.Type ==='Audio' ? (
                        <RunTimeTicks>{item.RunTimeTicks}</RunTimeTicks>
                    ) : (
                        <Spacer />
                    )}

                    {(item.Type === 'Audio' || item.Type === 'MusicAlbum') ? (

                        <Icon  
                        name="dots-vertical"
                        onPress={() => {
                            navigation.navigate("Details", {
                                item,
                                isNested: false
                            })
                        }} 
                        />
                    ) : (
                        <Spacer />
                    )}
                </XStack>
            </XStack>
        </View>
    )
}