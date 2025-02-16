import Item from "../../../components/Global/components/item";
import { StackParamList } from "../../../components/types"
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { FlatList } from "react-native"

interface RecentlyPlayedProps {
    tracks: BaseItemDto[];
    navigation: NativeStackNavigationProp<StackParamList, 'RecentTracks'>;
}

export default function RecentArtistsScreen({
    tracks,
    navigation
}: RecentlyPlayedProps) : React.JSX.Element {

    return (
        <FlatList
            data={tracks}
            renderItem={({ index, item: track }) => {
                return <Item item={track} queueName="Recently Played" navigation={navigation} />
            }}
        />
    )

}